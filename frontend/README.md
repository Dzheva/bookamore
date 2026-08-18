# BOOKAMORE FRONTEND

React 19 + TypeScript на Vite. Стан — Redux Toolkit (RTK Query), маршрутизація —
React Router v7, UI — MUI + TailwindCSS, локалізація — i18next (`public/locales/{en,ua}`).

Нижче — як підняти на своєму ПК **увесь сайт разом із фотографіями книжок**, а не
самий лише фронт. Це різні речі, і плутанина між ними — головна причина «в мене
порожні картинки» (див. [розділ 1](#1-чому-фронт-окремо-не-показує-ні-даних-ні-фото)).

---

## 0. Швидкий старт

Якщо `.env`-файли вже на місці, а в `data/uploads/` уже лежать фото:

```bash
cd /path/to/bookamore
docker compose -f docker-compose-local.yaml up -d --build
```

Відкрити **http://localhost:8080** — і саме цю адресу, не `:3000`.

Перший запуск довгий: контейнер бекенду виконує `mvn spring-boot:run` і тягне
залежності в `~/.m2` (кеш прокинутий з хоста, тож удруге це швидко).

---

## 1. Чому фронт окремо не показує ні даних, ні фото

У стеку чотири контейнери, і точка входу — nginx, а не Vite:

```
браузер → :8080 nginx ──/api/v1/*──→ backend:8080 (Spring Boot) → bookamore-db:5432
                     ├──/img/*─────→ ./data/uploads/img/  (bind-mount, тільки читання)
                     └──/*─────────→ frontend:3000 (Vite dev server)
```

Vite-сервер на `:3000` теж відповідає, але це **не той самий сайт**:

| | `http://localhost:8080` (nginx) | `http://localhost:3000` (Vite напряму) |
|---|---|---|
| `/api/v1/*` | локальний backend | проксі на `bookamore-dev.alt-web.biz.ua` (див. `vite.config.ts`) |
| `/img/*` | файли з `data/uploads/img/` | нічого, Vite віддає `index.html` |
| Що видно | локальні дані + обкладинки | дані з DEV-сервера, **усі картинки биті** |

Перевірено в браузері на цьому ж стеку: через `:8080` головна вантажить 17 зображень
і жодного битого; через порт Vite — 0 завантажених і замість обкладинок alt-тексти,
а книжки в списку взагалі інші, бо приїхали з DEV-сервера.

Тому `npm run dev` без Docker годиться лише для роботи над версткою на чужих даних.
Для «сайту з фото на ПК» потрібен весь compose-стек і вхід через `:8080`.

---

## 2. Передумови

- Docker + Docker Compose v2 (`docker compose`, не `docker-compose`).
- Вільні порти на хості: **8080** (nginx), **3000** (Vite), **5433** (Postgres, слухає
  лише `127.0.0.1`). Зайняті — див. [розділ 8](#8-якщо-порти-зайняті).
- Для синхронізації даних із сервера — `rsync`, `ssh` і доступ до VPS.

Node.js на хості потрібен тільки якщо запускати фронт поза Docker; сам стек збирає
все всередині контейнерів.

---

## 3. Крок 1 — env-файли

Обидва файли в `.gitignore`, тож на свіжому клоні їх немає і створити треба вручну.

### 3.1 `frontend/.env`

```dotenv
VITE_BASE_API_URL=/api/v1
```

Шлях **відносний**: браузер б'є в той самий origin (`:8080`), а nginx уже розводить
`/api/v1/*` на backend. Абсолютний URL тут зайвий і ламає CORS.

Змінна обов'язкова. Забути її — це не «нічого не станеться»: RTK Query збирає
`baseUrl` як `` `${import.meta.env.VITE_BASE_API_URL}/offers` ``, і без значення запити
підуть на `/undefined/offers`. Симптом — порожні списки й 404 у вкладці Network.

`VITE_IMAGE_HOST` для локалки лишається незаданим — код (`BookImageGallery`,
`AnnouncementCard`, `UploadPhoto`, `BookSection`) підставляє `''`, і шлях `/img/book/…`
з бази йде на той самий origin, де його вже чекає nginx.

> `frontend/.env.production` (він у git) містить те саме значення, але Vite у режимі
> `dev` його **не читає** — потрібен саме `.env`.

### 3.2 `backend/src/main/resources/.env`

```bash
cp backend/src/main/resources/.env.example backend/src/main/resources/.env
```

Файл читає `EnvConfig` через `dotenv-java` і розкладає значення в системні
properties. Ключі, які реально вживаються в `application-*.yaml`: `DB_URL`,
`DB_USERNAME`, `DB_PASSWORD`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`,
`FACEBOOK_CLIENT_ID`, `FACEBOOK_CLIENT_SECRET`.

Реквізити БД для локального профілю все одно перевизначає `docker-compose-local.yaml`
(`postgres/postgres`), тож змінювати їх не треба. OAuth-ключі можна лишити
заглушками — соціальний логін не працює в жодному середовищі проєкту, але без
самих змінних Spring не стартує: `application-local.yaml` посилається на них без
дефолтів.

---

## 4. Крок 2 — дані і фотографії

Фото **лежать у репозиторії** — `data/uploads/img/` (58 файлів, ~19 МБ) приїжджає
разом із клоном, тож окремо їх діставати не треба. Виняток у `.gitignore` зроблений
точково: решта `data/` (дампи, робочі файли) і далі ігнорується.

Самі записи в базі — інша річ. Фото прив'язані до конкретних `id` книжок і оферів,
тому «сайт із картинками» виходить лише тоді, коли база й тека узгоджені між собою.

### Варіант А — дамп із сервера (найповніший, дає всі 58 фото прив'язаними)

```bash
./setup-dev.sh
```

На питання про оновлення даних відповісти `y`. Скрипт:

1. знімає `pg_dump` на VPS і забирає його разом із текою `uploads/` через `rsync`;
2. виставляє файлам `o+r`, а текам `o+rx` — інакше nginx у контейнері не має права
   їх прочитати і на кожне фото віддає 404;
3. піднімає Postgres, чистить схему й заливає дамп;
4. **нормалізує шляхи** в `images` / `books_images`: зрізає домен, зводить різні
   історичні варіанти (`/uploads/img/…`, `/img/books/…`) до єдиного `/img/book/<hash>.jpg`;
5. видаляє записи зображень, файлів яких немає на диску, — щоб замість битої картинки
   картка просто лишилась без фото;
6. піднімає весь стек із `SPRING_SQL_INIT_MODE=never` і `DDL_AUTO=none`, щоб демо-сід
   не затер щойно залиті дані.

Потрібен ssh-доступ до VPS — без нього скрипт впаде на першому ж кроці.

### Варіант Б — свій дамп і своя тека з фото

Якщо дамп і архів фото вже є (наприклад, передав хтось із команди):

```bash
# 1. фото: розкласти так, щоб вийшло data/uploads/img/book/… і data/uploads/img/offer/…
mkdir -p data/uploads
tar xzf uploads.tar.gz -C data/uploads --strip-components=1
find data/uploads -type f -exec chmod o+r {} +
find data/uploads -type d -exec chmod o+rx {} +

# 2. база
docker compose -f docker-compose-local.yaml up -d bookamore-db
docker compose -f docker-compose-local.yaml exec -T bookamore-db \
  psql -U postgres -d bookamore-db -c "DROP SCHEMA public CASCADE; CREATE SCHEMA public;"
docker compose -f docker-compose-local.yaml exec -T bookamore-db \
  psql -U postgres -d bookamore-db < local_backup.sql

# 3. решта стеку — БЕЗ демо-сіду поверх залитих даних
SPRING_SQL_INIT_MODE=never SPRING_JPA_HIBERNATE_DDL_AUTO=none \
  docker compose -f docker-compose-local.yaml up -d --build
```

Дві змінні в кінці не косметичні: за замовчуванням compose підставляє
`SPRING_SQL_INIT_MODE=always`, і `data-local.sql` виконається поверх дампу при
**кожному** `up`.

Звірити, що шляхи в базі збігаються з файлами на диску:

```bash
docker compose -f docker-compose-local.yaml exec -T bookamore-db \
  psql -U postgres -d bookamore-db -t -A -c "SELECT path FROM books_images;" \
  | while read p; do [ -f "./data/uploads$p" ] && echo "OK   $p" || echo "MISS $p"; done
```

`MISS` означає рівно те, що написано: запис у базі є, файлу немає — картка покаже
alt-текст. Це нормальний стан для дампу, свіжішого за архів фото; такі рядки
прибирає `setup-dev.sh` (крок 5) або можна видалити їх вручну.

### Варіант В — демо-сід (нічого не треба, крім Docker)

Просто підняти стек без жодних змінних:

```bash
docker compose -f docker-compose-local.yaml up -d --build
```

Liquibase створить схему, а `backend/src/main/resources/data-local.sql` заллє
демо-набір: п'ять користувачів, три автори, три книжки, три офери — **і три
зображення до них**, які посилаються на файли з `data/uploads/img/`. Тобто на
чистому клоні, без ssh і без чужого дампу, головна сторінка одразу малює картки
з картинками.

Це шлях за замовчуванням для нової людини в команді. Варіанти А і Б потрібні
тільки тоді, коли треба працювати саме на прод-подібному наборі даних.

> Сід прив'язує нейтральні знімки, а не обкладинки з прод-дампу: демо-книжки —
> «Effective Java», «Spring in Action», «Clean Code», і чужа обкладинка під такою
> назвою збивала б з пантелику.

---

## 5. Крок 3 — запуск і перевірка

```bash
docker compose -f docker-compose-local.yaml up -d --build
docker compose -f docker-compose-local.yaml ps
```

Мають бути `Up` усі чотири: `nginx`, `frontend`, `backend`, `bookamore-db`.
Healthcheck є лише в бази — у фронта й бекенду його свідомо прибрано (у dev-образах
немає `curl`, а `/actuator/health` не підключений, тож перевірка завжди брехала
`unhealthy`).

Перевірки з терміналу:

```bash
# сторінка віддається через nginx
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:8080/

# API відповідає локальний, а не DEV
curl -s "http://localhost:8080/api/v1/offers?size=2" | head -c 200

# конкретне фото віддається як зображення, а не як HTML
F=$(ls data/uploads/img/book | head -1)
curl -s -o /dev/null -w "%{http_code} %{content_type}\n" "http://localhost:8080/img/book/$F"
# очікуємо: 200 image/jpeg

# Swagger
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:8080/swagger-ui/index.html
```

І головне — відкрити http://localhost:8080 і подивитись очима: на головній мають
бути секції «New» і «Recommended» з реальними обкладинками, а не сірі прямокутники
з підписами.

Корисні адреси:

| Адреса | Що це |
|---|---|
| http://localhost:8080 | сайт (єдина правильна точка входу) |
| http://localhost:8080/swagger-ui/index.html | Swagger UI бекенду |
| http://localhost:8080/v3/api-docs | OpenAPI-схема |
| `localhost:5433` | Postgres із хоста (`postgres` / `postgres` / база `bookamore-db`) |

---

## 6. Куди потрапляють нові фото

Тека `./data/uploads` прокинута в два контейнери одночасно:

- у backend як `/app/uploads` (`FILE_UPLOAD_DIR=/app/uploads/img`) — сюди він **пише**;
- у nginx як `/usr/share/nginx/html/uploads` у режимі `:ro` — звідси він **читає**.

Тому файл, завантажений через форму на сайті, одразу з'являється в
`data/uploads/img/` на хості й одразу віддається за `/img/…`. Перезапуск контейнерів
його не чіпає: це bind-mount на хостову теку, а не том, що живе всередині Docker.

База переживає рестарти окремо — вона в іменованому томі `pgdata`.

> ⚠️ `data/uploads/img/` **під версійним контролем**, тож кожне завантаження через
> локальний сайт з'являється в `git status` як новий файл. Перед комітом варто
> глянути, що саме туди набігло: тестові картинки, кинуті «щоб перевірити форму»,
> у репозиторії нікому не потрібні.
>
> ```bash
> git status --short data/uploads/    # має бути порожньо перед комітом
> git clean -n data/uploads/          # що прибереться, якщо зробити -f
> ```
>
> Файли пише backend-контейнер від root, тож видаляти їх, найімовірніше, доведеться
> через `sudo rm`.

---

## 7. Робота над фронтом без Docker

```bash
cd frontend
npm install
npm run dev     # http://localhost:3000
```

Це режим «верстка на чужих даних»: `vite.config.ts` проксює `/api/v1` на
`https://bookamore-dev.alt-web.biz.ua`, тому дані будуть із DEV-сервера, а
локальних фото не буде взагалі (`/img/*` там ніхто не обслуговує).

Змінити щось у верстці й одразу побачити результат на **локальних** даних можна
й без цього: контейнер фронта монтує `./frontend` усередину, Vite стежить за
файлами (`CHOKIDAR_USEPOLLING=true`), тож правка в редакторі підхоплюється
стеком на `:8080` без перезбирання образу.

Інші команди:

```bash
npm run build     # tsc + vite build
npm run lint      # ESLint
npm run format    # Prettier
```

---

## 8. Якщо порти зайняті

`8080`, `3000` або `5433` можуть бути зайняті іншим проєктом. Правити
`docker-compose-local.yaml` не треба — поруч кладеться особистий override, який у git
не потрапляє:

```yaml
# docker-compose-local.override.yaml
services:
  frontend:
    ports: !override
      - "3100:3000"
  bookamore-db:
    ports: !override
      - "127.0.0.1:5434:5432"
```

```bash
docker compose -f docker-compose-local.yaml -f docker-compose-local.override.yaml up -d --build
```

Тег `!override` обов'язковий: без нього Compose **зливає** списки портів, старий
`5433:5432` лишається поруч із новим, і бінд падає.

Змінюються тільки host-порти. Всередині мережі сервіси й далі `frontend:3000` і
`bookamore-db:5432`, тому `nginx-local.conf` чіпати не треба.

Порт самого nginx (`8080:80`) краще не рухати: `CLIENT_URL=http://localhost:8080`
у compose використовується для CORS і OAuth-редіректу, і його довелось би міняти
разом із портом.

> Побічний ефект зміни порту фронта: Vite HMR у `vite.config.ts` жорстко прибитий до
> `localhost:3000`, тож на іншому порту гаряче перезавантаження не підключиться
> (у консолі — `WebSocket connection to 'ws://localhost:3000/…' failed`). Сторінка
> працює, просто зміни доведеться оновлювати вручну.

---

## 9. Типові поломки

| Симптом | Причина | Що робити |
|---|---|---|
| Картки без картинок, у Network `404` на `/img/…` | у базі є запис, файлу в `data/uploads/img/…` немає (типово для дампу з прода, свіжішого за теку) | звірити базу з диском (скрипт у розділі 4Б) |
| Усі фото `404`, хоча файли на місці | після `rsync` файли без прав на читання для інших | `find data/uploads -type f -exec chmod o+r {} +` і те саме `o+rx` для тек |
| Дані не ті, що заливали; після кожного `up` знову демо | спрацював `data-local.sql` | піднімати з `SPRING_SQL_INIT_MODE=never SPRING_JPA_HIBERNATE_DDL_AUTO=none` |
| Запити летять на `/undefined/offers` | немає `frontend/.env` або в ньому немає `VITE_BASE_API_URL` | створити файл (розділ 3.1) і перезапустити контейнер фронта |
| Списки порожні, у Network видно `bookamore-dev.alt-web.biz.ua` | сайт відкрито на порту Vite, а не через nginx | відкрити `http://localhost:8080` |
| Backend падає на старті з `Could not resolve placeholder 'GOOGLE_CLIENT_ID'` | немає `backend/src/main/resources/.env` | скопіювати з `.env.example` |
| `port is already allocated` | зайнятий порт на хості | override-файл із розділу 8 |
| Бекенд довго стартує на першому `up` | `mvn spring-boot:run` тягне залежності | почекати; кеш лишається в `~/.m2`, наступні старти швидкі |

Логи, коли симптом незрозумілий:

```bash
docker compose -f docker-compose-local.yaml logs -f backend
docker compose -f docker-compose-local.yaml logs -f nginx
docker compose -f docker-compose-local.yaml logs -f frontend
```

---

## 10. Щоденні команди

```bash
COMPOSE="docker compose -f docker-compose-local.yaml"

$COMPOSE up -d --build          # підняти / перезібрати
$COMPOSE restart frontend       # перезапустити один сервіс
$COMPOSE logs -f backend        # логи
$COMPOSE down                   # зупинити (дані і фото лишаються)
$COMPOSE down -v                # ⚠ разом із томом pgdata — база зникне,
                                #   фото в data/uploads/ переживуть
```

Структура фронта — у кореневому `CLAUDE.md`: аліаси Vite (`@`, `@app`, `@pages`,
`@modules`, `@shared`, `@types`, `@store`, `@api`) і розкладка тек
(`app/`, `entities/`, `modules/`, `pages/`, `shared/`).
