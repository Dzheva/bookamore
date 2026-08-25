---
theme: default
title: Bookamore → GitHub Organization
info: |
  TFD-001. Перехід з персонального репозиторію на GitHub Organization.
class: text-center
transition: slide-left
mdc: true
---

# Bookamore → GitHub Organization

Перехід з персонального репозиторію одного розробника
на повноцінну безкоштовну GitHub Organization

<div class="text-sm opacity-60 mt-8">TFD-001 · DevOps</div>

---

# Поточний стан

- Репозиторій `Dzheva/bookamore` живе під **особистим акаунтом**
- Доступи видаються як collaborators по одному, без ролей і команд
- CI/CD-секрети (`GHCR_PULL_TOKEN`, `GCP_SSH_KEY`, `VPS_SSH_KEY`, `GCP_VM_HOST`, `VPS_HOST`) лежать у Settings одного акаунта
- Образи в GHCR публікуються під `ghcr.io/dzheva/bookamore-*`
- **Bus factor = 1**: якщо акаунт власника недоступний — недоступне все (репо, Actions, secrets, packages)

---

# Що дає GitHub Organization (Free)

- **Teams** замість плоского списку collaborators
- Права доступу **по репозиторію на команду**: Read / Triage / Write / Maintain / Admin
- **Organization secrets** — спільні для кількох репозиторіїв, не прив'язані до людини
- **Environments** з required reviewers для продакшн-деплою
- Необмежена кількість приватних і публічних репозиторіїв
- 2000 хв Actions/міс на приватні репо (публічні — без обмежень)
- Репозиторій належить **організації**, а не людині

---

# Плюси переходу

- Централізоване адміністрування доступів через teams, а не ручний список collaborators
- Розділення ролей: `frontend`, `backend`, `devops` — кожна команда бачить і чіпає лише своє
- Незалежність від одного акаунта (bus factor знижується з 1 до кількох owners)
- Organization secrets + Environments — акуратніший контроль над деплоєм
- `GITHUB_REPOSITORY_OWNER` у `deploy.yml` вже обчислюється динамічно —
  **перейменування власника не ламає CI/CD**, образи самі стануть
  `ghcr.io/<org>/bookamore-*`
- Готовність до росту команди без переробки прав з нуля

---

# Мінуси / обмеження Free tier

- Немає SSO (SAML) — лише на GitHub Enterprise
- Audit log обмежений і без retention/export (це вже Team/Enterprise)
- Немає IP allow list і advanced security policies
- 2000 хв Actions/міс на приватні репо — при рості CI можна впертись у ліміт
- Розділення на кілька репозиторіїв (front/backend/gitops) — це:
  - додаткова синхронізація версій між репозиторіями
  - потрібна дисципліна тегів/релізів
  - складніше робити наскрізні PR (одна фіча = кілька PR)
- Організаційна складність зростає: teams, permissions matrix треба підтримувати

---

# Адміністрування організації

- **Owners**: 2+ людини (bus factor), не одна
- **Teams**:
  - `@bookamore/frontend`
  - `@bookamore/backend`
  - `@bookamore/devops`
- Права на репозиторій видаються **команді**, не людині напряму
- `CODEOWNERS` на репозиторій — авто-реквест рев'ю потрібної команди
- 2FA обов'язковий для всіх членів організації (Org settings → Authentication security)
- Branch protection rules на рівні репозиторію (required review, required checks)

---

# Командна розробка

- Розробник — **member організації**, а не зовнішній collaborator конкретного репо
- Required PR review + required status checks перед merge у `main`/`dev`
- Project boards (GitHub Projects) на рівні організації — видно роботу всіх репозиторіїв
- Onboarding нового розробника = додати в потрібну team, а не видавати доступ вручну по репо

---

# Секрети та автоматизація

- **Organization secrets** — спільне для всіх репо (напр. `GHCR_PULL_TOKEN`)
- **Repository secrets** — специфічне для одного сервісу (напр. `GCP_SSH_KEY` лише для backend/gitops)
- **Environments** (`production`, `dev`) з required reviewers — деплой у прод вимагає підтвердження
- Спільні reusable workflows можна винести в окремий `.github`-репозиторій організації
  і підключати через `uses: bookamore/.github/.github/workflows/build.yml@main`
- Поточний `deploy.yml` міняти майже не треба — `REGISTRY`/`IMAGE_PREFIX`/`GITHUB_REPOSITORY_OWNER`
  вже параметризовані

---

# Структура репозиторіїв: варіанти

**Варіант A — лишити монорепо**
- Мінімум змін у CI/CD, найпростіший перехід
- Frontend/backend і далі деплояться разом, права на рівні всього репо

**Варіант B — розбити на окремі репозиторії**
- `bookamore-frontend`
- `bookamore-backend`
- `bookamore-gitops` (docker-compose, nginx, deploy/, .github/workflows)
- Чіткіші права per team, незалежні CI-прогони, менші checkout/build
- Ціна: рефакторинг CI, синхронізація версій між репо, окрема задача

<div class="text-sm opacity-60 mt-4">Рекомендація: почати з варіанта A (transfer монорепо), варіант B — окрема задача пізніше</div>

---

# План міграції

1. Створити GitHub Organization (Free plan)
2. Додати owners, увімкнути обов'язковий 2FA для організації
3. Створити teams: `frontend`, `backend`, `devops`
4. **Transfer** `Dzheva/bookamore` → організація (Settings → Transfer ownership)
5. Оновити remotes у локальних клонах команди (`git remote set-url origin ...`)
6. Перенести секрети в Organization/Repository secrets нового namespace
7. Перевірити `GHCR_PULL_TOKEN`/пакети — новий namespace `ghcr.io/<org>/bookamore-*`
8. Оновити посилання на репозиторій в `README.md`, `deploy/gcp/README.md`
9. (Окрема задача) розбиття монорепо на `frontend`/`backend`/`gitops`
10. Презентація команді, збір фідбеку, узгодження дати transfer

<div class="text-sm opacity-60 mt-4">Кроки 4–8 — незворотна дія, виконується лише після явного підтвердження власника репозиторію</div>

---
class: text-center
---

# Питання?

Матеріал: `docs/tfd-001-github-organization/`
