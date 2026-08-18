# Bookamore на GCP e2-micro + Cloudflare Tunnel

Ранбук міграції PROD-середовища на безкоштовний хостинг.
DEV лишається на старому VPS (`185.143.145.151`) — два повні стеки в 1 GB RAM не влазять.

PROD на GCP публікується на власному домені **`www.bookamore.store`** через Cloudflare Tunnel
(апекс `bookamore.store` віддає 301 на www — канонічна форма одна, див. 5.3).
Зона `alt-web.biz.ua` у Cloudflare **не заводиться** — вона несе пошту й сторонні сайти,
а `bookamore.alt-web.biz.ua` та `bookamore-dev.alt-web.biz.ua` лишаються на старому VPS
(причини й межі — розділ 5.1).

---

## 1. Що змінюється в архітектурі

**Було** (VPS, 4+ GB RAM):

```
Інтернет → :443 host nginx (Let's Encrypt) → :3432 frontend-контейнер
                                            → :3000 backend-контейнер
```
Образи збиралися прямо на сервері: `docker compose up -d --build`.

**Стало** (GCP e2-micro, 1 GB RAM):

```
Інтернет → Cloudflare edge (TLS, кеш статики)
              ↓ вихідний тунель, ініційований зсередини VM
           cloudflared (контейнер) → frontend:80 → backend:8080 → db:5432
```

Три наслідки, які тягнуть за собою решту змін:

| | Наслідок |
|---|---|
| **Збірка** | Maven + npm build на 1 GB RAM падає по OOM → образи збирає CI і кладе в GHCR, VM робить лише `docker compose pull`. |
| **Мережа** | Тунель ініціюється **зсередини**, тож на VM не потрібен жоден відкритий вхідний порт і жоден публічний вхід. Host nginx і certbot зникають — TLS тримає Cloudflare. |
| **Egress** | Безкоштовний ліміт GCP — 1 GB вихідного трафіку/міс. Статику кешує Cloudflare edge, тому origin віддає її раз, а не кожному відвідувачу. |

`deploy/nginx.conf` у цій схемі **не використовується** — його роль перебрали Cloudflare (TLS)
і nginx усередині frontend-контейнера (`frontend/nginx.conf`). Файл лишається для DEV на старому VPS.

---

## 2. Бюджет памʼяті

e2-micro — це 1024 MB, з яких ядру та системі лишається ~200 MB.

| Сервіс | `mem_limit` | Виміряно в спокої | Очікуваний пік |
|---|---|---|---|
| backend (JVM) | 460 MB | 232 MB | ~380–420 MB |
| db (Postgres) | 192 MB | 52 MB | ~120–150 MB |
| cloudflared | 48 MB | — | ~30 MB |
| frontend (nginx) | 32 MB | 12 MB | ~15 MB |
| **Разом лімітів** | **732 MB** | **296 MB** | |

Колонка «виміряно» — реальний `docker stats` після прогону цього ж compose-файлу
з тими самими лімітами і JVM-прапорцями (порожня БД, після старту й Liquibase).
Під навантаженням цифри ростуть, але запас до 1 GB лишається.

Плюс swap-файл на 1 GB як подушка на піки (перезапуск JVM, `pg_dump`, Liquibase-міграції).

> **Про `-Xss256k`.** Значення агресивне (Spring + Hibernate подекуди дають глибокі стеки
> на проксі), тож його перевірено окремо: під ним застосунок стартує за 12.5 с, Liquibase
> проганяє всі changeset-и, `/api/v1/*` і OAuth2 відповідають без `StackOverflowError`.
> Якщо він усе ж колись зʼявиться в логах — це перше, що треба послабити до `-Xss512k`
> у `docker-compose.gcp.yaml`; решта JVM-прапорців від цього не залежить.

---

## 3. Створення VM

### 3.0 Always Free — що це насправді

Це **не** «акаунт без картки» і **не** $300 тріалу. Три різні речі, які легко сплутати:

| | Що це |
|---|---|
| **Free Trial** | $300 на 90 днів. Вмикається автоматично при створенні billing account. Після закінчення Google **не списує** нічого сам — ресурси просто зупиняються і згодом видаляються. |
| **Always Free** | Безстроковий ліміт, який діє **і під час тріалу, і після нього**. Але щоб машина продовжила працювати після закінчення тріалу, акаунт треба перевести в платний (Billing → **Upgrade**). |
| **Платне споживання** | Усе поза лімітами Always Free на вже апгрейдженому акаунті. Списується з картки без окремого підтвердження. |

Практичний наслідок: **картку прикріпити доведеться в будь-якому разі** — без billing account GCP не дасть створити VM узагалі. «Нуль на місяць» тримається не на відсутності картки, а на тому, що ми не виходимо за ліміти. Тому бюджет-алерт із розділу 9 ставиться **до** створення VM, а не після.

Що саме покриває Always Free:

- **одна** non-preemptible `e2-micro` на місяць — у `us-west1`, `us-central1` або `us-east1`;
- 30 GB-місяців **standard** persistent disk (`pd-standard`);
- 1 GB вихідного трафіку з Північної Америки на місяць (крім Китаю та Австралії).

Ліміт рахується **на billing account, а не на проєкт**: другої безкоштовної e2-micro під DEV в тому ж акаунті не буде.

Поза лімітом лишаються, зокрема, снапшоти диска, Cloud NAT і зовнішні IP-адреси — останні варто перевірити в Billing → Reports через добу після запуску (розділ 9).

### 3.1 Команда створення

```bash
PROJECT_ID="bookamore-prod"

gcloud compute instances create bookamore-prod \
  --project="$PROJECT_ID" \
  --zone=us-east1-b \
  --machine-type=e2-micro \
  --image-family=ubuntu-2404-lts-amd64 \
  --image-project=ubuntu-os-cloud \
  --boot-disk-type=pd-standard \
  --boot-disk-size=30GB \
  --network-tier=STANDARD \
  --metadata=enable-oslogin=FALSE
```

Що тут критично і чому:

- `--machine-type=e2-micro` + регіон зі списку вище — інакше машина платна.
- `--boot-disk-type=pd-standard` — `pd-balanced` (дефолт у консолі!) у Always Free **не входить**.
- `--boot-disk-size=30GB` — рівно ліміт; більше почне списуватись.
- `--network-tier=STANDARD` — дешевший egress, якщо ліміт усе ж перевищимо.
- `enable-oslogin=FALSE` — щоб GitHub Actions ходив звичайним SSH-ключем з метаданих (розділ 8).

Зовнішня IP-адреса лишається (ефемерна): вона потрібна для вихідних зʼєднань —
`docker pull` з GHCR і сам тунель до Cloudflare. Альтернатива `--no-address`
вимагає Cloud NAT, а він платний.

> **`ZONE_RESOURCE_POOL_EXHAUSTED`.** e2-micro — дефіцитний тип, і зона регулярно
> відмовляє: під час цієї міграції поспіль відпали `us-central1-a`, `-b`, `-c`, `-f`,
> машина піднялась аж у `us-east1-b`. Це тимчасова відсутність заліза, а не помилка
> конфігурації — просто перебирати зони трьох Always Free регіонів, поки одна не дасть
> інстанс. **Зону не міняти на іншу за межами `us-west1` / `us-central1` / `us-east1`:
> там машина стане платною.** Фактична зона потім потрібна для `gcloud compute ssh`
> і `add-metadata`; у `deploy.yml` вона не фігурує — CI ходить по IP із `GCP_VM_HOST`.

### 3.2 Фаєрвол: закрити прямий доступ по IP

Тунель не потребує жодного відкритого вхідного порту, тож типові правила прибираємо:

> У свіжій мережі `default` правил `default-allow-http` / `default-allow-https` **може не бути
> взагалі** — вони зʼявляються лише коли VM створюють через веб-консоль із галочками
> «Allow HTTP/HTTPS traffic», що вішають теги `http-server` / `https-server`. Команда з
> розділу 3.1 цих тегів не ставить, тож видаляти нічого і крок пропускається (інакше
> `delete` впаде з `was not found`). Перевірити — `gcloud compute firewall-rules list`.

```bash
# HTTP/HTTPS ззовні більше не потрібні — весь вхід іде через тунель (якщо правила існують)
gcloud compute firewall-rules delete default-allow-http default-allow-https --quiet

# SSH — не на весь інтернет, а лише через IAP TCP forwarding
gcloud compute firewall-rules delete default-allow-ssh --quiet
gcloud compute firewall-rules create allow-ssh-from-iap \
  --network=default --allow=tcp:22 --source-ranges=35.235.240.0/20
```

> GitHub Actions ходить по SSH із динамічних IP GitHub і через IAP не пройде.
> Якщо CI-деплой має працювати, лишіть `tcp:22` відкритим, але **тільки з ключем**
> (`PasswordAuthentication no` в `/etc/ssh/sshd_config` — на Ubuntu-образах GCP це вже так).
> Компроміс усвідомлений: 22-й порт назовні в обмін на автоматичний деплой.

---

## 4. Базове налаштування VM

```bash
gcloud compute ssh bookamore-prod --zone=us-east1-b
```

### 4.1 Swap 1 GB

Без нього піковий момент (рестарт JVM поверх ще живого старого контейнера) кладе систему.

```bash
sudo fallocate -l 1G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab

# Свопити тільки коли справді треба, а не витісняти гарячі сторінки JVM
echo 'vm.swappiness=10' | sudo tee /etc/sysctl.d/99-swappiness.conf
sudo sysctl --system

free -h   # має показати Swap: 1.0Gi
```

### 4.2 Docker

```bash
curl -fsSL https://get.docker.com | sudo sh
sudo usermod -aG docker "$USER"
newgrp docker
```

### 4.3 Каталог деплою

```bash
sudo mkdir -p /opt/bookamore
sudo chown "$USER:$USER" /opt/bookamore
git clone https://github.com/Dzheva/bookamore.git /opt/bookamore
```

### 4.4 `.env`

```bash
cp /opt/bookamore/deploy/gcp/env.example /opt/bookamore/.env
chmod 600 /opt/bookamore/.env
nano /opt/bookamore/.env
```

Заповнити `DB_PASSWORD`, `JWT_SECRET`, OAuth-креденшели та `CLOUDFLARE_TUNNEL_TOKEN`
(токен зʼявиться на кроці 5). `CLIENT_URL` і `SWAGGER_SERVER_URL` вказують на
`https://bookamore.store` — власний домен PROD, тож **redirect URI в консолях
Google/Facebook доведеться доповнити** (розділ 5.4).

---

## 5. Cloudflare Tunnel

### 5.1 Зона `bookamore.store` у Cloudflare

PROD на GCP їде на **власному домені `bookamore.store`** (реєстратор — Namecheap), а не
на піддомені `alt-web.biz.ua`. Причина: `alt-web.biz.ua` обслуговує пошту (`MX → mail.`,
SPF, DKIM-селектор `dkim`) і кілька сторонніх сайтів на `185.174.220.11`. Перенесення
тієї зони в Cloudflare зачепило б **весь** домен заради одного піддомену — невиправданий
ризик мовчки зламати пошту. `bookamore.store` натомість чистий і належить проєкту.

Що лишається на старому VPS `185.143.145.151` і в Cloudflare **не заводиться**:

| Хост | Призначення |
|---|---|
| `bookamore.alt-web.biz.ua` | старий PROD, A-запис, host nginx + certbot |
| `bookamore-dev.alt-web.biz.ua` | DEV, A-запис |

Порядок:

1. Cloudflare Dashboard → **Add a site** → `bookamore.store`, план **Free**.
2. Cloudflare просканує зону на Namecheap — **звірити список записів** (нижче).
3. У Namecheap: **Domain → Nameservers → Custom DNS** → вписати пару, видану Cloudflare.
4. Дочекатись, доки зона перейде `Pending` → `Active` (зазвичай хвилини, TTL у `.store` — 900 с).

**Що прибрати** зі скану — парковку Namecheap, вона більше не потрібна:

```
A      @     162.255.119.47          ← parkingpage
CNAME  www   parkingpage.namecheap.com.
```

**Що зберегти обовʼязково** — інакше тихо помре пересилання пошти:

```
MX  @  10 eforward1.registrar-servers.com.
MX  @  10 eforward2.registrar-servers.com.
MX  @  10 eforward3.registrar-servers.com.
MX  @  15 eforward4.registrar-servers.com.
MX  @  20 eforward5.registrar-servers.com.
TXT @  "v=spf1 include:spf.efwd.registrar-servers.com ~all"
```

> ⚠️ Namecheap віддає безкоштовний email forwarding **за умови їхніх NS** (BasicDNS).
> Після переходу на Cloudflare MX-записи лишаться валідними, але сам сервіс Namecheap
> може відмовитись приймати пошту для домену на чужих NS. Тому після зміни NS —
> **надіслати тестовий лист** на адресу пересилання. Не дійшов → перевести пересилання
> на **Cloudflare Email Routing** (безкоштовний, живе в тій самій зоні: *Email → Email
> Routing → Enable*; він сам замінить MX на `route*.mx.cloudflare.net`).

Після активації зони: **SSL/TLS → Overview → Full (strict)**, **Edge Certificates →
Always Use HTTPS: On**. Universal SSL покриває `bookamore.store` і `*.bookamore.store` —
окремий сертифікат не потрібен.

### 5.2 Створення тунелю

**Zero Trust → Networks → Tunnels → Create a tunnel → Cloudflared**, назва `bookamore-prod`.

На кроці «Install and run a connector» **не виконуйте показану команду** — cloudflared у нас
працює контейнером із compose. Потрібен лише токен із неї (довгий рядок після `--token`):

```bash
# у /opt/bookamore/.env
CLOUDFLARE_TUNNEL_TOKEN=eyJhIjoiXXXX...
```

### 5.3 Public Hostname

Канонічний хост — **`www.bookamore.store`**. Апекс теж заводимо, але тільки щоб було чому
відповідати на edge: далі його перехоплює Redirect Rule і віддає 301 на www.

Чому саме один канонічний хост, а не два рівноправні: `CLIENT_URL` у беку — одне значення
(`OAuth2SuccessHandler` підставляє його в redirect цілим рядком). Якби апекс і www обидва
віддавали застосунок, користувач з апексу отримав би CORS-origin, якого немає в дозволених,
і мовчазні 403 на XHR.

Вкладка **Public Hostname → Add a public hostname**, два записи:

| Поле | `www` (канонічний) | Апекс |
|---|---|---|
| Subdomain | `www` | *(порожньо)* |
| Domain | `bookamore.store` | `bookamore.store` |
| Type | `HTTP` | `HTTP` |
| URL | `frontend:80` | `frontend:80` |

`frontend` — це імʼя сервісу в docker-мережі `bookamore_prod_network`; cloudflared
резолвить його напряму, тому назовні не треба публікувати жодного порту.

У **Additional application settings → HTTP Settings** поле *HTTP Host Header* лишити
**порожнім**: оригінальний `Host` має дійти до nginx і Spring без підміни. У
`frontend/nginx.conf` стоїть `server_name _`, тож будь-який `Host` приймається — зміна
домену конфіг nginx не зачіпає.

DNS-записи `→ <tunnel-uuid>.cfargotunnel.com` (CNAME, proxied) Cloudflare створює
автоматично. На апексі це працює завдяки CNAME flattening — окремий A-запис не потрібен.
Парковочні `A @ 162.255.119.47` і `CNAME www parkingpage.namecheap.com` **видалити
вручну**, інакше вони конфліктуватимуть із записами тунелю.

**Redirect Rule для апексу.** *Rules → Redirect Rules → Create rule*, назва `apex to www`:

| Поле | Значення |
|---|---|
| If — Custom filter expression | `Hostname` `equals` `bookamore.store` |
| Then — Type | `Dynamic` |
| Expression | `concat("https://www.bookamore.store", http.request.uri.path)` |
| Status code | `301` |
| Preserve query string | ✅ |

`Dynamic` замість `Static` — щоб редірект зберігав шлях: інакше глибокі посилання на
апекс (`/offers/…`) губили б URI і кидали на головну.

Що в цей тунель **не** заводимо: `bookamore.alt-web.biz.ua` і `bookamore-dev.alt-web.biz.ua`
лишаються A-записами на старий VPS у зоні, яку веде bitteserver.

### 5.4 OAuth2 redirect URI

Домен новий, тож у консолях провайдерів треба дозволити його **до** першого логіну —
інакше `redirect_uri_mismatch`.

| Провайдер | Де | Що додати |
|---|---|---|
| Google | Cloud Console → APIs & Services → Credentials → OAuth 2.0 Client ID | *Authorized redirect URIs*: `https://www.bookamore.store/login/oauth2/code/google`; *Authorized JavaScript origins*: `https://www.bookamore.store` |
| Facebook | Meta for Developers → застосунок → Facebook Login → Settings | *Valid OAuth Redirect URIs*: `https://www.bookamore.store/login/oauth2/code/facebook` |

Форма **з `www`** — саме її бачить провайдер, бо апекс редіректиться ще на edge і до
застосунку не доходить. Апексну форму додавати не потрібно.

Старі URI на `bookamore.alt-web.biz.ua` не видаляти: цей домен далі обслуговує старий VPS.

---

## 6. Перенесення даних зі старого VPS

Робити після того, як стек на GCP підніметься вперше (розділ 9), але **до** переключення DNS.

```bash
# --- на старому VPS ---
docker exec bookamore-prod-db-1 \
  pg_dump -U "$DB_USER" -d bookamore_prod -Fc > /tmp/prod.dump
tar czf /tmp/uploads.tar.gz -C /home/deploy/www/prod uploads
```

```bash
# --- на GCP VM (файли вже скопійовані в /tmp) ---
cd /opt/bookamore

# База: Liquibase створив порожню схему, тому чистимо її перед відновленням
docker compose -f docker-compose.gcp.yaml --env-file .env stop backend
docker cp /tmp/prod.dump bookamore-prod-db-1:/tmp/prod.dump
docker compose -f docker-compose.gcp.yaml --env-file .env exec db \
  pg_restore -U "$DB_USER" -d bookamore_prod --clean --if-exists /tmp/prod.dump

# Фото: розпаковуємо всередину іменованого тому
docker run --rm \
  -v bookamore_prod_uploads:/dst \
  -v /tmp:/src:ro \
  alpine sh -c 'tar xzf /src/uploads.tar.gz -C /dst --strip-components=1'

docker compose -f docker-compose.gcp.yaml --env-file .env start backend
```

---

## 7. Секрети GitHub

**Settings → Secrets and variables → Actions**:

| Секрет | Призначення |
|---|---|
| `GCP_VM_HOST` | Зовнішній IP e2-micro |
| `GCP_VM_USER` | Користувач на VM (той, що володіє `/opt/bookamore`) — фактично `mrx` |
| `GCP_SSH_KEY` | Приватний ключ; публічний — у метаданих інстансу |
| `GHCR_PULL_TOKEN` | *Необовʼязково.* PAT з `read:packages`, якщо пакети приватні |
| `VPS_HOST`, `VPS_SSH_KEY` | Лишаються — ними деплоїться DEV |

Публічний ключ на VM. Імʼя перед двокрапкою — це логін, під яким CI зайде по SSH,
тож воно має збігатися з `GCP_VM_USER` і з власником `/opt/bookamore`:

```bash
gcloud compute instances add-metadata bookamore-prod --zone=us-east1-b \
  --metadata-from-file ssh-keys=<(echo "mrx:$(cat ~/.ssh/bookamore_gcp.pub)")
```

Ключ кладеться в метадані **інстансу**, а не проєкту: project-wide ключ від
`gcloud compute ssh` лишається чинним, бо `block-project-ssh-keys` не виставлений.

Якщо зробити пакети GHCR публічними (**Package → Package settings → Change visibility**),
`GHCR_PULL_TOKEN` не потрібен — крок логіну в workflow сам пропуститься.

---

## 8. Перший запуск

```bash
cd /opt/bookamore
docker compose -f docker-compose.gcp.yaml --env-file .env pull
docker compose -f docker-compose.gcp.yaml --env-file .env up -d
docker compose -f docker-compose.gcp.yaml --env-file .env ps
```

Перевірки:

```bash
# Памʼять: сума RSS має лишатись нижче ~800 MB, swap — майже не зайнятий
docker stats --no-stream
free -h

# Тунель піднявся і зареєстрував коннектори
docker compose -f docker-compose.gcp.yaml logs cloudflared | grep -i "registered tunnel"

# Origin відповідає всередині мережі. Через `exec cloudflared` не вийде —
# образ cloudflared distroless, там немає ні wget, ні curl. Тому одноразовий контейнер
# у тій самій мережі: він бачить `frontend` за тим самим іменем, що й тунель.
docker run --rm --network bookamore_prod_network curlimages/curl:8.10.1 \
  -s -i --max-time 20 http://frontend:80/ | head -5

# Ззовні. Ознака, що відповідь іде саме через тунель, а не повз нього, —
# заголовки `server: cloudflare` і `cf-ray` у відповіді.
curl -sI https://www.bookamore.store | grep -iE "^(HTTP|server|cf-ray)"
# Апекс має віддати 301 саме на www-форму, зі збереженим шляхом
curl -sI https://bookamore.store/offers | grep -iE "^(HTTP|location)"
# Колекційний ендпойнт — саме /offers. GET /api/v1/books у API немає
# (лише /api/v1/books/{bookId}), тож він віддає 500 "No static resource" і на PROD, і на DEV.
curl -s https://www.bookamore.store/api/v1/offers | head -c 200

# Прямий доступ по IP має бути закритий
curl -m 5 -I "http://$(curl -s ifconfig.me)" || echo "OK: прямий вхід закрито"
```

Окремо перевірити OAuth2. Ланцюжок такий: Google повертає код на
`https://www.bookamore.store/login/oauth2/code/google` (дефолтний шлях Spring — кастомного
`redirect-uri` в `application-prod.yaml` немає), далі `OAuth2SuccessHandler` редіректить
браузер на `${CLIENT_URL}/login` з токеном у параметрах.

Дві різні причини збою, які легко сплутати:

- **`redirect_uri_mismatch` від Google** — URI не доданий у консоль (розділ 5.4).
- **Редірект пішов на `http://`** — `X-Forwarded-Proto` не доїхав; дивитись `map`
  у `frontend/nginx.conf`.

---

## 9. Контроль «нуля» в білінгу

DoD вимагає $0/міс, тож це не одноразова перевірка:

```bash
gcloud billing budgets create \
  --billing-account="$BILLING_ACCOUNT_ID" \
  --display-name="bookamore-zero" \
  --budget-amount=1USD \
  --threshold-rule=percent=0.5
```

Через добу після запуску відкрити **Billing → Reports** і переконатись, що по проєкту
немає ненульових рядків. Найчастіші приховані списання:

- `pd-balanced` замість `pd-standard` (створили через веб-консоль з дефолтами);
- статична зовнішня IP, зарезервована і не відчеплена;
- вихідний трафік понад 1 GB — дивитись, чи Cloudflare реально кешує статику
  (заголовок `cf-cache-status: HIT` на `/assets/*` і `/img/*`);
- знімки диска (snapshots), якщо вмикали автобекап.

---

## 10. Експлуатація

```bash
cd /opt/bookamore
COMPOSE="docker compose -f docker-compose.gcp.yaml --env-file .env"

$COMPOSE logs -f backend          # логи
$COMPOSE restart backend          # рестарт одного сервісу
docker stats --no-stream          # памʼять
docker system df -v               # що зʼїло диск
```

**Відкат на попередній образ.** CI пінить у `.env` конкретний sha, тож відкат — це
підставити попередній тег і підняти заново:

```bash
sed -i "s|^BACKEND_IMAGE=.*|BACKEND_IMAGE=ghcr.io/dzheva/bookamore-backend:<попередній-sha>|" .env
$COMPOSE up -d backend
```

**Бекап.** Іменовані томи переживають `down`, але не видалення VM:

```bash
$COMPOSE exec db pg_dump -U "$DB_USER" -d bookamore_prod -Fc > ~/backup-$(date +%F).dump
docker run --rm -v bookamore_prod_uploads:/src:ro -v "$HOME":/dst alpine \
  tar czf /dst/uploads-$(date +%F).tar.gz -C /src .
```

Зберігати копії **поза** VM — 30 GB диска теж у безкоштовному ліміті, а знімки платні.

---

## 11. Вимкнення старого PROD

Після того як домен стабільно віддається через тунель і дані звірені:

```bash
# на старому VPS
cd /home/deploy/www/prod
docker compose -f docker-compose.yaml --env-file .env down
```

Каталог і томи не видаляти щонайменше тиждень — це фактичний бекап на випадок відкату.
Конфіг `deploy/nginx.conf` лишається чинним для DEV, PROD-блок у ньому стає мертвим.
