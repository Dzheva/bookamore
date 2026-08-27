# TFD-001 — Split migration: `Dzheva/bookamore` → 3 repos in `Bookamore-Store`

Пошаговий runbook для розбиття монорепо `https://github.com/Dzheva/bookamore.git`
на три окремі репозиторії всередині вже створеної організації
`https://github.com/orgs/Bookamore-Store/repositories`:

- `Bookamore-Store/front`
- `Bookamore-Store/backend`
- `Bookamore-Store/gitops`

Це деталізація кроку 9 з `slides.md` ("Варіант B — розбити на окремі
репозиторії"). Документ описує сам спліт, а не рішення "чи спліттити" —
воно вже прийняте в презентації.

> Незворотні дії позначені **⚠️**. Кожну з них виконує власник репозиторію
> (Oleksandr Korchenko) після явного підтвердження, не автоматично.

## 0. Передумови

- [ ] Organization `Bookamore-Store` існує, власник має Owner-права
- [ ] Встановлено [`git-filter-repo`](https://github.com/newren/git-filter-repo)
      (не `git filter-branch` — той на цьому розмірі репо повільний і легко
      лишає сміття в history)
  ```bash
  pip install git-filter-repo   # або: apt install git-filter-repo
  ```
- [ ] Teams `frontend`, `backend`, `devops` вже створені в організації
      (крок 3 з `slides.md`)
- [ ] Секрети деплою (`GHCR_PULL_TOKEN`, `GCP_SSH_KEY`, `GCP_VM_HOST`,
      `GCP_VM_USER`, `VPS_SSH_KEY`, `VPS_HOST`) під рукою — знадобляться на
      кроці 5

## 1. Підготувати три «сирі» клони з обрізаною історією

Працюємо на **свіжих клонах**, оригінальний робочий репозиторій не чіпаємо.
`git filter-repo` переписує історію тільки в копії, на якій запущений.

```bash
mkdir -p ~/bookamore-split && cd ~/bookamore-split

git clone https://github.com/Dzheva/bookamore.git front
git clone https://github.com/Dzheva/bookamore.git backend
git clone https://github.com/Dzheva/bookamore.git gitops
```

### 1.1 `front`

Лишає тільки `frontend/`, підіймаючи вміст у корінь нового репо (щоб
`npm run dev`, Vite-конфіг і Dockerfile працювали без зміни шляхів).

```bash
cd ~/bookamore-split/front
git filter-repo --path frontend/ --path-rename frontend/:
```

### 1.2 `backend`

```bash
cd ~/bookamore-split/backend
git filter-repo --path backend/ --path-rename backend/:
```

### 1.3 `gitops`

Все, що *не* frontend і не backend: docker-compose файли, `deploy/`,
`.github/workflows/`, `nginx-local.conf`, `README.md`, `docs/`, `.env.example`.
Це той репозиторій, що описує, як зібрані образи `frontend`/`backend`
розгортаються разом.

```bash
cd ~/bookamore-split/gitops
git filter-repo \
  --path docker-compose.yaml \
  --path docker-compose.dev.yml \
  --path docker-compose.gcp.yaml \
  --path docker-compose-local.yaml \
  --path nginx-local.conf \
  --path deploy/ \
  --path .github/ \
  --path docs/ \
  --path README.md \
  --path .env.example \
  --path .gitignore
```

> `local_backup.sql`, `.env`, `.idea/`, `.agents/`, `data/` свідомо не входять
> у жоден з трьох path-списків — вони або локальні артефакти, або секрети,
> і не мають потрапити в жоден новий репозиторій. Перевір `git log --stat`
> у кожному з трьох клонів перед push, що нічого зайвого не проскочило.

## 2. Створити репозиторії в організації

⚠️ Через GitHub UI (Bookamore-Store → New repository) або `gh`:

```bash
gh repo create Bookamore-Store/front   --public  --source ~/bookamore-split/front
gh repo create Bookamore-Store/backend --public  --source ~/bookamore-split/backend
gh repo create Bookamore-Store/gitops  --private --source ~/bookamore-split/gitops
```

`front`/`backend` — публічні: код клієнта й сервера сам по собі не секрет,
а публічні репо не з'їдають 2000 хв Actions/міс з ліміту Free tier.
`gitops` — приватний: там deploy-скрипти, шляхи на VM (`/opt/bookamore`,
`/home/deploy/www/dev`) і структура секретів — це вже інфраструктурні деталі,
які не варто світити.

Якщо створюєш через UI — **не** ініціалізуй README/`.gitignore`/license на
GitHub, інакше перший push у порожній репозиторій з нашою історією
конфліктне з автостворенним комітом.

## 3. Запушити переписану історію

⚠️ Push в **новий, порожній** репозиторій — незворотна дія лише в тому сенсі,
що після цього репозиторій більше не порожній; сам вихідний `Dzheva/bookamore`
на цьому кроці не змінюється.

```bash
cd ~/bookamore-split/front
git remote set-url origin git@github.com:Bookamore-Store/front.git
git push -u origin --all
git push -u origin --tags

cd ~/bookamore-split/backend
git remote set-url origin git@github.com:Bookamore-Store/backend.git
git push -u origin --all
git push -u origin --tags

cd ~/bookamore-split/gitops
git remote set-url origin git@github.com:Bookamore-Store/gitops.git
git push -u origin --all
git push -u origin --tags
```

## 4. Оновити `gitops` під нову структуру

Це репозиторій-оркестратор — після спліту в ньому лишається CI/CD і
docker-compose, які раніше збирали `./frontend` і `./backend` з **того самого**
чекауту. Тепер образи будуються в **різних** репозиторіях, тож
`.github/workflows/deploy.yml` треба переробити з `matrix`-збірки в двох
контекстах на **два незалежні джерела образів**.

### 4.1 Варіант "мінімальні зміни" (рекомендовано на старт)

`gitops` більше нічого не білдить сам — тільки деплоїть готові
образи, які push'ять `front`/`backend` кожен зі
своєї гілки.

- В `front` і `backend` додати свій власний
  `.github/workflows/build.yml`: build + push у GHCR під `latest`/`:<sha>`,
  той самий патерн тегів, що вже є в поточному `deploy.yml`
  (`ghcr.io/<org>/bookamore-frontend`, `ghcr.io/<org>/bookamore-backend` —
  `IMAGE_PREFIX`/`component` з `deploy.yml`, назва образу не пов'язана
  з назвою репозиторію)
- В `gitops` лишити тільки `deploy-prod-gcp` / `deploy-dev-vps`
  job'и, тригер — `workflow_dispatch` або `repository_dispatch` від
  frontend/backend workflow'ів (щоб деплой стартував після успішного білду
  будь-якого з двох)
- `docker-compose.gcp.yaml`/`docker-compose.dev.yml` не міняються —
  вони й так тягнуть образи з GHCR за `BACKEND_IMAGE`/`FRONTEND_IMAGE`
  зі `.env`, а не білдять локально

### 4.2 Наскрізний деплой (одна фіча = один PR у двох репо)

Якщо потрібно тримати lockstep-версії frontend/backend — додати в
`gitops` git submodule або просто пінити версії образів тегами
в `.env`, і оновлювати їх окремим PR у `gitops` після релізу
кожного сервісу. Складніше в адмініструванні, але дає явний "changelog"
деплоїв на рівні gitops-репо.

> Для Bookamore на поточному масштабі команди раджу 4.1 — простіше
> підтримувати, ціна незалежних релізів прийнятна.

## 5. Перенести секрети

⚠️ Секрети **не переносяться автоматично** при спліті — вводяться заново.

| Секрет | Куди |
|---|---|
| `GHCR_PULL_TOKEN` | `gitops` — опційно: `front`/`backend` публічні, тож і образи в GHCR публічні, `docker login` на VM не потрібен (див. коментар у `deploy.yml`, крок з `if [ -n "${GHCR_TOKEN:-}" ]`) |
| `GCP_SSH_KEY`, `GCP_VM_HOST`, `GCP_VM_USER` | `gitops` (prod deploy) |
| `VPS_SSH_KEY`, `VPS_HOST` | `gitops` (dev deploy) |
| Нічого специфічного | `front`, `backend` — `GITHUB_TOKEN` для push у GHCR видається автоматично, окремий секрет не потрібен |

Якщо організація на Free tier і хочеться спільних секретів між репо —
`Bookamore-Store → Settings → Secrets and variables → Actions → New
organization secret`, обмежити видимість трьома репозиторіями через
"Selected repositories".

## 6. Оновити шляхи розгортання на VM

На GCP e2-micro та старому VPS деплой-скрипти в `deploy.yml` роблять
`git reset --hard origin/main` у `TARGET_DIR` (`/opt/bookamore`,
`/home/deploy/www/dev`) — це чекаут **gitops-репозиторія**, тому:

```bash
# на VM, разово при переході
cd /opt/bookamore   # або /home/deploy/www/dev
git remote set-url origin git@github.com:Bookamore-Store/gitops.git
git fetch --all --prune
git reset --hard origin/main   # або origin/dev
```

`.env`, `uploads/`, `pgdata/`, `data/`, `certs/` на VM не чіпаємо — вони й
так виключені з `git clean` у `deploy.yml` (рядки 105, 162).

## 7. Оновити посилання в документації

Замінити `github.com/Dzheva/bookamore` на відповідний з трьох нових
репозиторіїв у:

- `README.md` кожного нового репо (генерується зі спліту зі старим
  вмістом — посилання там ще на монорепо)
- `deploy/gcp/README.md` (переноситься в `gitops`)
- `docs/tfd-001-github-organization/slides.md`, якщо після спліту
  презентація ще актуальна для нових учасників

## 8. Проєктні налаштування після спліту

- [ ] Branch protection на `main`/`dev` — окремо в кожному з трьох репо
      (правила не переносяться зі старого монорепо автоматично)
- [ ] `CODEOWNERS` — `front` → `@Bookamore-Store/frontend`,
      `backend` → `@Bookamore-Store/backend`,
      `gitops` → `@Bookamore-Store/devops`
- [ ] Team access: `frontend`-team отримує Write лише на
      `front`, аналогічно для `backend`/`devops`
- [ ] Локальні клони розробників: `git remote set-url origin <новий URL>`
      або переклон з нуля — простіше для тих, хто не тримає локальних гілок

## 9. Архівувати старий монорепо

⚠️ Тільки після того, як обидва CI (frontend/backend build, gitops deploy)
підтверджено пройшли хоч раз у нових репозиторіях і прод/dev деплой з нового
джерела перевірено вручну.

`Dzheva/bookamore` → Settings → General → **Archive this repository**
(не видаляти — лишається як read-only довідка про історію до спліту).

---

## Контрольний список одним поглядом

1. `git-filter-repo` × 3 (frontend / backend / gitops) — окремі клони, обрізана історія
2. Створити 3 приватні репо в `Bookamore-Store`
3. Push переписаної історії в кожен
4. Переробити `gitops/.github/workflows/deploy.yml`: build переїжджає у frontend/backend, gitops лишає тільки deploy
5. Секрети завести заново в кожному репо (таблиця вище)
6. На VM (`/opt/bookamore`, `/home/deploy/www/dev`) — `git remote set-url` на `gitops`
7. Оновити посилання на репозиторій у README/docs
8. Branch protection, CODEOWNERS, team access — окремо в кожному з трьох репо
9. Архівувати `Dzheva/bookamore` після перевірки обох деплоїв
