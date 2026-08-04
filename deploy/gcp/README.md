# Bookamore на GCP e2-micro + Cloudflare Tunnel

Ранбук міграції PROD-середовища на безкоштовний хостинг.
DEV лишається на старому VPS (`185.143.145.151`) — два повні стеки в 1 GB RAM не влазять.

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
PROJECT_ID="<ваш-проєкт>"

gcloud compute instances create bookamore-prod \
  --project="$PROJECT_ID" \
  --zone=us-central1-a \
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

### 3.2 Фаєрвол: закрити прямий доступ по IP

Тунель не потребує жодного відкритого вхідного порту, тож типові правила прибираємо:

```bash
# HTTP/HTTPS ззовні більше не потрібні — весь вхід іде через тунель
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
gcloud compute ssh bookamore-prod --zone=us-central1-a
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
(токен зʼявиться на кроці 5). Значення `CLIENT_URL` і `SWAGGER_SERVER_URL` не змінюються —
домен той самий, тож **redirect URI в Google/Facebook консолях чіпати не треба**.

---

## 5. Cloudflare Tunnel

### 5.1 Зона `alt-web.biz.ua` у Cloudflare

Домен має обслуговуватись у Cloudflare (безкоштовний план):

1. Cloudflare Dashboard → **Add a site** → `alt-web.biz.ua`.
2. Cloudflare просканує наявні DNS-записи — **звірити список і дописати ті, що не підхопились**.
3. У реєстратора замінити NS-сервери на видані Cloudflare.

> ⚠️ Це переносить у Cloudflare **весь** домен, не лише `bookamore.*`. Перед зміною NS
> вивантажте поточну зону в реєстратора і переконайтесь, що всі записи (пошта — MX, SPF,
> DKIM; інші піддомени) перенесені. Втрачений MX = мовчки зламана пошта на всьому домені.

Після активації зони: **SSL/TLS → Overview → Full (strict)**, а також
**Edge Certificates → Always Use HTTPS: On**. Universal SSL покриває
`bookamore.alt-web.biz.ua` як піддомен першого рівня — окремий сертифікат не потрібен.

### 5.2 Створення тунелю

**Zero Trust → Networks → Tunnels → Create a tunnel → Cloudflared**, назва `bookamore-prod`.

На кроці «Install and run a connector» **не виконуйте показану команду** — cloudflared у нас
працює контейнером із compose. Потрібен лише токен із неї (довгий рядок після `--token`):

```bash
# у /opt/bookamore/.env
CLOUDFLARE_TUNNEL_TOKEN=eyJhIjoiXXXX...
```

### 5.3 Public Hostname

Вкладка **Public Hostname → Add a public hostname**:

| Поле | Значення |
|---|---|
| Subdomain | `bookamore` |
| Domain | `alt-web.biz.ua` |
| Type | `HTTP` |
| URL | `frontend:80` |

`frontend` — це імʼя сервісу в docker-мережі `bookamore_prod_network`; cloudflared
резолвить його напряму, тому назовні не треба публікувати жодного порту.

У **Additional application settings → HTTP Settings** поле *HTTP Host Header* лишити
**порожнім**: оригінальний `Host` має дійти до nginx і Spring без підміни.

DNS-запис `bookamore.alt-web.biz.ua → <tunnel-uuid>.cfargotunnel.com` (CNAME, proxied)
Cloudflare створює автоматично — **старий A-запис на `185.143.145.151` треба видалити вручну**,
інакше частина трафіку піде повз тунель на старий VPS.

`bookamore-dev.alt-web.biz.ua` у цьому тунелі не заводимо — DEV лишається A-записом
на старий VPS.

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
| `GCP_VM_USER` | Користувач на VM (той, що володіє `/opt/bookamore`) |
| `GCP_SSH_KEY` | Приватний ключ; публічний — у метаданих інстансу |
| `GHCR_PULL_TOKEN` | *Необовʼязково.* PAT з `read:packages`, якщо пакети приватні |
| `VPS_HOST`, `VPS_SSH_KEY` | Лишаються — ними деплоїться DEV |

Публічний ключ на VM:

```bash
gcloud compute instances add-metadata bookamore-prod --zone=us-central1-a \
  --metadata-from-file ssh-keys=<(echo "deploy:$(cat ~/.ssh/bookamore_gcp.pub)")
```

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

# Origin відповідає всередині мережі
docker compose -f docker-compose.gcp.yaml exec cloudflared \
  wget -qO- http://frontend:80/ | head -5

# Ззовні
curl -I https://bookamore.alt-web.biz.ua
curl -s https://bookamore.alt-web.biz.ua/api/v1/books | head -c 200

# Прямий доступ по IP має бути закритий
curl -m 5 -I "http://$(curl -s ifconfig.me)" || echo "OK: прямий вхід закрито"
```

Окремо перевірити OAuth2: логін через Google має завершитись поверненням на
`https://bookamore.alt-web.biz.ua/oauth2/callback`. Якщо Google скаржиться на
`redirect_uri_mismatch` — значить `X-Forwarded-Proto` не доїхав; дивитись `map`
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
