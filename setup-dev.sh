#!/usr/bin/env bash
# setup-dev.sh — Розгортання та синхронізація локального середовища Bookamore.
set -euo pipefail

# ─── Конфігурація ─────────────────────────────────────────────────────────────
readonly COMPOSE_FILE="docker-compose-local.yaml"
readonly DB_SERVICE="bookamore-db"
readonly DB_NAME="bookamore-db"
readonly DB_USER="postgres"
readonly BACKUP_FILE="backup.sql"
# Відповідає bind-mount nginx та backend: ./data/uploads/img → /uploads (backend) та /usr/share/nginx/html/uploads (nginx)
readonly UPLOADS_IMG_DIR="./data/uploads/img"
readonly DB_WAIT_INTERVAL=3

# Налаштування синхронізації з VPS
readonly REMOTE_USER="devuser"
readonly REMOTE_HOST="185.143.145.151"
readonly REMOTE_DIR="/home/devuser/www/prod"
readonly REMOTE_DB_CONTAINER="bookamore_prod-bookamore-db-1"

# ─── Утиліти виводу ───────────────────────────────────────────────────────────
GREEN='\033[0;32m'; YELLOW='\033[1;33m'; RED='\033[0;31m'; BOLD='\033[1m'; NC='\033[0m'
info()  { echo -e "${GREEN}[✓]${NC} $*"; }
warn()  { echo -e "${YELLOW}[!]${NC} $*"; }
step()  { echo -e "\n${BOLD}── $* ${NC}"; }
die()   { echo -e "${RED}[✗] ПОМИЛКА:${NC} $*" >&2; exit 1; }

cleanup() { [ -f "$BACKUP_FILE" ] && rm -f "$BACKUP_FILE"; }
trap cleanup EXIT

# Режим Spring Boot за замовчуванням: fresh schema + seed з data-local.sql
DDL_AUTO="create"
SQL_INIT_MODE="always"

# ─── 0/5 Перевірка залежностей ────────────────────────────────────────────────
step "0/5  Перевірка залежностей"
for cmd in docker rsync ssh; do
  command -v "$cmd" &>/dev/null || die "'$cmd' не знайдено. Встановіть його та запустіть скрипт знову."
done
info "Всі залежності присутні."

# ─── 1/5 Синхронізація з VPS ──────────────────────────────────────────────────
step "1/5  Синхронізація з продакшн-сервером"
read -rp "Бажаєте оновити дані (БД + фото) з сервера $REMOTE_HOST? [y/N]: " sync_choice
if [[ "$sync_choice" =~ ^[Yy]$ ]]; then
  info "Створюємо свіжий дамп БД на сервері..."
  ssh "$REMOTE_USER@$REMOTE_HOST" \
    "docker exec $REMOTE_DB_CONTAINER pg_dump -U postgres $DB_NAME > $REMOTE_DIR/backup.sql"

  info "Завантажуємо дамп БД..."
  rsync -avzP "$REMOTE_USER@$REMOTE_HOST:$REMOTE_DIR/backup.sql" "./$BACKUP_FILE"

  info "Синхронізуємо фото..."
  mkdir -p "$UPLOADS_IMG_DIR"
  rsync -avzP --delete "$REMOTE_USER@$REMOTE_HOST:$REMOTE_DIR/uploads/" "$UPLOADS_IMG_DIR/"

  info "Встановлюємо права читання для Nginx..."
  find "$UPLOADS_IMG_DIR" -type f -exec chmod o+r {} +
  find "$UPLOADS_IMG_DIR" -type d -exec chmod o+rx {} +

  # Коли є backup — Spring Boot не повинен перестворювати схему або запускати seed
  DDL_AUTO="none"
  SQL_INIT_MODE="never"
  info "Синхронізацію завершено."
else
  info "Синхронізацію пропущено — використовується seed з data-local.sql."
fi

# ─── 2/5 Зупинка старих контейнерів ──────────────────────────────────────────
step "2/5  Зупинка старих контейнерів"
docker compose -f "$COMPOSE_FILE" down --remove-orphans 2>/dev/null || true
info "Старі контейнери зупинено."

# ─── 3/5 Запуск PostgreSQL та імпорт дампу ────────────────────────────────────
step "3/5  Запуск PostgreSQL"
docker compose -f "$COMPOSE_FILE" up -d "$DB_SERVICE"
info "Чекаємо готовності PostgreSQL..."
until docker compose -f "$COMPOSE_FILE" exec -T "$DB_SERVICE" \
  pg_isready -U "$DB_USER" -d "$DB_NAME" &>/dev/null; do
  sleep "$DB_WAIT_INTERVAL"
done
info "PostgreSQL готовий."

if [ -f "$BACKUP_FILE" ]; then
  info "Очищаємо схему та імпортуємо дамп з VPS..."
  docker compose -f "$COMPOSE_FILE" exec -T "$DB_SERVICE" \
    psql -U "$DB_USER" -d "$DB_NAME" \
    -c "DROP SCHEMA public CASCADE; CREATE SCHEMA public;"
  docker compose -f "$COMPOSE_FILE" exec -T "$DB_SERVICE" \
    psql -U "$DB_USER" -d "$DB_NAME" < "$BACKUP_FILE"
  info "Імпорт завершено."
fi

# ─── 4/5 Збірка та запуск контейнерів ────────────────────────────────────────
step "4/5  Збірка та запуск контейнерів"
export SPRING_JPA_HIBERNATE_DDL_AUTO="$DDL_AUTO"
export SPRING_SQL_INIT_MODE="$SQL_INIT_MODE"
docker compose -f "$COMPOSE_FILE" up -d --build
unset SPRING_JPA_HIBERNATE_DDL_AUTO SPRING_SQL_INIT_MODE
info "Контейнери запущено (ddl-auto=$DDL_AUTO, sql.init=$SQL_INIT_MODE)."

# ─── 5/5 Підсумок ─────────────────────────────────────────────────────────────
step "5/5  Підсумок"
echo ""
echo -e "${GREEN}${BOLD}╔══════════════════════════════════════════╗${NC}"
echo -e "${GREEN}${BOLD}║   Локальне середовище готове!  ✓         ║${NC}"
echo -e "${GREEN}${BOLD}╚══════════════════════════════════════════╝${NC}"
echo ""
echo -e "  Сайт:       ${BOLD}http://localhost${NC}"
echo -e "  Swagger UI: ${BOLD}http://localhost/swagger-ui/index.html${NC}"
echo -e "  БД:         ${BOLD}localhost:5432${NC}  (user: postgres / pw: postgres)"
echo ""
