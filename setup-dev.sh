#!/usr/bin/env bash
# setup-dev.sh — Одноразове налаштування локального середовища Bookamore.
# Ідемпотентний: безпечно запускати повторно — вже завантажені/імпортовані дані не переписуються.
set -euo pipefail

# ─── Конфігурація ─────────────────────────────────────────────────────────────
readonly COMPOSE_FILE="docker-compose-local.yaml"
readonly DB_SERVICE="bookamore-db"
readonly DB_NAME="bookamore-db"
readonly DB_USER="postgres"
readonly BACKUP_FILE="backup.sql"
readonly UPLOADS_DIR="./data/uploads"
readonly SQL_GDRIVE_ID="1GayK26b5QgtS0-xqC1HFjIj6HEcUWm-U"
readonly FOLDER_GDRIVE_URL="https://drive.google.com/drive/folders/1B_2EW9lK_qsJfOyjpje3dWZjGp81NXwn"
readonly DB_WAIT_ATTEMPTS=30
readonly DB_WAIT_INTERVAL=3
readonly VENV_DIR=".venv"

# ─── Утиліти виводу ──────────────────────────────────────────────────────────
GREEN='\033[0;32m'; YELLOW='\033[1;33m'; RED='\033[0;31m'; BOLD='\033[1m'; NC='\033[0m'
info()  { echo -e "${GREEN}[✓]${NC} $*"; }
warn()  { echo -e "${YELLOW}[!]${NC} $*"; }
step()  { echo -e "\n${BOLD}── $* ${NC}"; }
die()   { echo -e "${RED}[✗] ПОМИЛКА:${NC} $*" >&2; exit 1; }

# ─── Тимчасові директорії (оголошуємо на початку для cleanup) ─────────────────
TEMP_DIR=""
TEMP_STRUCT=""

# ─── Cleanup trap ─────────────────────────────────────────────────────────────
cleanup() {
  [ -f "$BACKUP_FILE" ] && rm -f "$BACKUP_FILE" && warn "backup.sql прибрано (cleanup trap)."
  [ -d "${TEMP_DIR:-}"    ] && rm -rf "${TEMP_DIR:-}"
  [ -d "${TEMP_STRUCT:-}" ] && rm -rf "${TEMP_STRUCT:-}"
}
trap cleanup EXIT

# ════════════════════════════════════════════════════════════════════════════
step "1/6  Перевірка залежностей"
# ════════════════════════════════════════════════════════════════════════════

for cmd in curl docker; do
  command -v "$cmd" &>/dev/null || die "'$cmd' не знайдено. Встановіть його та повторіть запуск."
done

# gdown встановлюємо у локальний venv — PEP 668 забороняє глобальний pip install
# на Debian/Ubuntu 24.04+. Ніякого sudo, ніякого засмічення системного Python.
command -v python3 &>/dev/null \
  || die "'python3' не знайдено. Встановіть: sudo apt install python3"

python3 -c "import venv" &>/dev/null \
  || die "Модуль 'venv' недоступний. Встановіть: sudo apt install python3-venv"

if [ ! -d "$VENV_DIR" ]; then
  info "Створюємо віртуальне середовище Python у $VENV_DIR..."
  python3 -m venv "$VENV_DIR"
fi

# GDOWN_CMD — повний шлях, не потребує activate. Решта системи залишається незмінною.
GDOWN_CMD="$VENV_DIR/bin/gdown"
if [ ! -f "$GDOWN_CMD" ]; then
  info "Встановлюємо gdown у $VENV_DIR..."
  "$VENV_DIR/bin/pip" install gdown --quiet \
    || die "Не вдалося встановити gdown у venv. Спробуйте: $VENV_DIR/bin/pip install gdown"
  info "gdown встановлено у $VENV_DIR."
else
  info "gdown вже присутній у $VENV_DIR — пропускаємо інсталяцію."
fi

# Перевіряємо що Docker daemon відповідає (не просто що бінарник є)
docker info &>/dev/null \
  || die "Docker daemon не запущений або у вас немає прав. Перевірте: sudo systemctl status docker"

info "Всі залежності присутні."

# ════════════════════════════════════════════════════════════════════════════
step "2/6  Завантаження SQL-дампу"
# ════════════════════════════════════════════════════════════════════════════

if [ -f "$BACKUP_FILE" ]; then
  warn "$BACKUP_FILE вже існує — пропускаємо завантаження (видаліть файл для повторного)."
else
  info "Завантажуємо $BACKUP_FILE з Google Drive..."
  "$GDOWN_CMD" "$SQL_GDRIVE_ID" -O "$BACKUP_FILE" \
    || die "Не вдалося завантажити SQL-дамп. Перевірте ID файлу та публічний доступ до Google Drive."

  # Перевіряємо що отримали SQL, а не HTML-сторінку підтвердження Google
  if head -c 20 "$BACKUP_FILE" | grep -qi "<!doctype\|<html"; then
    rm -f "$BACKUP_FILE"
    die "Завантажений файл є HTML-сторінкою, а не SQL-дампом.\n  Google Drive може вимагати підтвердження для великих файлів.\n  Спробуйте: $GDOWN_CMD --fuzzy 'https://drive.google.com/uc?id=${SQL_GDRIVE_ID}' -O ${BACKUP_FILE}"
  fi
  info "backup.sql завантажено ($(du -sh "$BACKUP_FILE" | cut -f1))."
fi

# ════════════════════════════════════════════════════════════════════════════
step "3/6  Завантаження зображень"
# ════════════════════════════════════════════════════════════════════════════

mkdir -p "$UPLOADS_DIR"

if [ -n "$(ls -A "$UPLOADS_DIR" 2>/dev/null)" ]; then
  warn "$UPLOADS_DIR вже містить файли — пропускаємо завантаження."
else
  info "Завантажуємо папку зображень..."

  # gdown --folder завжди створює підпапку з назвою Drive-папки всередині -O.
  # Завантажуємо у тимчасову директорію, потім переносимо вміст (уникаємо зайвого рівня вкладеності).
  TEMP_DIR=$(mktemp -d)

  "$GDOWN_CMD" --folder "$FOLDER_GDRIVE_URL" -O "$TEMP_DIR" --quiet \
    || die "Не вдалося завантажити папку зображень. Перевірте URL та публічний доступ."

  # Переносимо всі файли (будь-яка глибина) безпосередньо в UPLOADS_DIR
  find "$TEMP_DIR" -type f | while IFS= read -r file; do
    mv "$file" "$UPLOADS_DIR/"
  done
  rm -rf "$TEMP_DIR"; TEMP_DIR=""

  FILE_COUNT=$(find "$UPLOADS_DIR" -type f | wc -l)
  info "Завантажено файлів зображень: $FILE_COUNT"
fi

# chown без sudo — ми є власником директорії (mkdir -p створив її)
chown -R "$(id -u):$(id -g)" "$UPLOADS_DIR"

# ════════════════════════════════════════════════════════════════════════════
step "4/6  Запуск PostgreSQL та імпорт БД"
# ════════════════════════════════════════════════════════════════════════════

# Спочатку запускаємо ТІЛЬКИ БД — до старту backend'у та Liquibase.
# Це гарантує, що дамп імпортується у чисту схему.
info "Запускаємо тільки $DB_SERVICE..."
docker compose -f "$COMPOSE_FILE" up -d "$DB_SERVICE" \
  || die "Не вдалося запустити $DB_SERVICE. Перевірте: docker compose -f $COMPOSE_FILE logs $DB_SERVICE"

info "Чекаємо готовності PostgreSQL (до $((DB_WAIT_ATTEMPTS * DB_WAIT_INTERVAL)) сек)..."
attempt=0
until docker compose -f "$COMPOSE_FILE" exec -T "$DB_SERVICE" \
    pg_isready -U "$DB_USER" -d "$DB_NAME" &>/dev/null; do
  attempt=$((attempt + 1))
  if [ "$attempt" -ge "$DB_WAIT_ATTEMPTS" ]; then
    die "PostgreSQL не готовий після $((DB_WAIT_ATTEMPTS * DB_WAIT_INTERVAL)) сек.\n  Перевірте логи: docker compose -f $COMPOSE_FILE logs $DB_SERVICE"
  fi
  warn "Очікуємо DB ($attempt/$DB_WAIT_ATTEMPTS)..."
  sleep "$DB_WAIT_INTERVAL"
done
info "PostgreSQL готовий."

# Ідемпотентність: перевіряємо чи в таблиці images вже є рядки.
# (Перевіряємо саме images — не лише таблиці — бо Liquibase міг створити схему без даних.)
images_count=$(docker compose -f "$COMPOSE_FILE" exec -T "$DB_SERVICE" \
  psql -U "$DB_USER" -d "$DB_NAME" -tAc \
  "SELECT CASE WHEN EXISTS (
     SELECT 1 FROM information_schema.tables
     WHERE table_schema='public' AND table_name='images'
   ) THEN (SELECT COUNT(*)::text FROM images) ELSE '0' END;" \
  2>/dev/null | tr -d '[:space:]')

if [ "${images_count:-0}" -gt "0" ]; then
  warn "БД вже містить ${images_count} зображень — пропускаємо імпорт.\n  Для повторного імпорту: docker compose -f $COMPOSE_FILE down -v && bash $0"
else
  # Зупиняємо всі контейнери (крім volumes!) перед зміною схеми.
  # Якщо backend вже запущений з Liquibase-схемою — він має перестартувати після імпорту.
  info "Зупиняємо запущені контейнери (volumes зберігаються)..."
  docker compose -f "$COMPOSE_FILE" down 2>/dev/null || true

  info "Перезапускаємо тільки $DB_SERVICE..."
  docker compose -f "$COMPOSE_FILE" up -d "$DB_SERVICE" \
    || die "Не вдалося запустити $DB_SERVICE."

  info "Очікуємо PostgreSQL після рестарту..."
  attempt=0
  until docker compose -f "$COMPOSE_FILE" exec -T "$DB_SERVICE" \
      pg_isready -U "$DB_USER" -d "$DB_NAME" &>/dev/null; do
    attempt=$((attempt + 1))
    [ "$attempt" -ge "$DB_WAIT_ATTEMPTS" ] && die "PostgreSQL не відповів."
    sleep "$DB_WAIT_INTERVAL"
  done

  info "Очищаємо публічну схему перед імпортом..."
  docker compose -f "$COMPOSE_FILE" exec -T "$DB_SERVICE" \
    psql -U "$DB_USER" -d "$DB_NAME" \
    -c "DROP SCHEMA public CASCADE; CREATE SCHEMA public;
        GRANT ALL ON SCHEMA public TO postgres;
        GRANT ALL ON SCHEMA public TO public;" \
    || die "Не вдалося очистити схему БД."

  info "Імпортуємо $BACKUP_FILE → ${DB_NAME}..."
  docker compose -f "$COMPOSE_FILE" exec -T "$DB_SERVICE" \
    psql -U "$DB_USER" -d "$DB_NAME" < "$BACKUP_FILE" \
    || die "Імпорт SQL завершився з помилкою.\n  Перевірте дамп: psql -U $DB_USER -h 127.0.0.1 -p 5433 -d $DB_NAME < $BACKUP_FILE"
  info "SQL-дамп успішно імпортовано."
fi

# ════════════════════════════════════════════════════════════════════════════
step "5/6  Запуск всіх контейнерів"
# ════════════════════════════════════════════════════════════════════════════

info "docker compose up -d..."
docker compose -f "$COMPOSE_FILE" up -d \
  || die "docker compose up завершився з помилкою. Перевірте: docker compose -f $COMPOSE_FILE logs"
info "Контейнери запущено."

# ════════════════════════════════════════════════════════════════════════════
step "6/6  Копіювання зображень у volume та очищення"
# ════════════════════════════════════════════════════════════════════════════

if [ -n "$(ls -A "$UPLOADS_DIR" 2>/dev/null)" ]; then
  UPLOADS_VOLUME=$(docker volume ls --format '{{.Name}}' | grep 'uploads_data' | head -1 || true)
  if [ -z "$UPLOADS_VOLUME" ]; then
    warn "Volume 'uploads_data' не знайдено — зображення не скопійовано."
  else
    # Читаємо шляхи зображень з БД (/img/book/filename.jpg), щоб покласти файли
    # в правильні підтеки volume (book/ або offer/).
    DB_PATHS=$(docker compose -f "$COMPOSE_FILE" exec -T "$DB_SERVICE" \
      psql -U "$DB_USER" -d "$DB_NAME" -tAc "SELECT path FROM images;" 2>/dev/null || true)

    if [ -z "$DB_PATHS" ]; then
      warn "Таблиця images порожня — пропускаємо копіювання зображень."
    else
      TEMP_STRUCT=$(mktemp -d)
      COPY_COUNT=0; MISS_COUNT=0

      while IFS= read -r img_path; do
        [ -z "$img_path" ] && continue
        # /img/book/abc123.jpg → subdir=book, filename=abc123.jpg
        subdir=$(echo "$img_path" | sed 's|^/img/\([^/]*\)/.*$|\1|')
        filename=$(basename "$img_path")
        src_file="$UPLOADS_DIR/$filename"

        if [ -f "$src_file" ]; then
          mkdir -p "$TEMP_STRUCT/$subdir"
          cp "$src_file" "$TEMP_STRUCT/$subdir/$filename"
          COPY_COUNT=$((COPY_COUNT + 1))
        else
          MISS_COUNT=$((MISS_COUNT + 1))
          warn "Файл не знайдено локально: $filename (шлях у БД: $img_path)"
        fi
      done <<< "$DB_PATHS"

      if [ "$COPY_COUNT" -gt "0" ]; then
        docker run --rm \
          -v "${UPLOADS_VOLUME}:/dst" \
          -v "${TEMP_STRUCT}:/src:ro" \
          alpine sh -c "cp -rn /src/. /dst/ && echo 'Зображення скопійовано.'" \
          || warn "Не вдалося скопіювати зображення в volume."
        info "Скопійовано: $COPY_COUNT зображень$([ "$MISS_COUNT" -gt 0 ] && echo "; відсутніх локально: $MISS_COUNT" || true)"
      else
        warn "Жодне зображення не знайдено в $UPLOADS_DIR (відсутніх з БД: $MISS_COUNT)."
      fi

      rm -rf "$TEMP_STRUCT"; TEMP_STRUCT=""
    fi
  fi
fi

# backup.sql видаляється через trap при EXIT — тут лише підтвердження
info "Тимчасові файли буде прибрано при виході."

# ─── Підсумок ────────────────────────────────────────────────────────────────
echo ""
echo -e "${GREEN}${BOLD}══════════════════════════════════════════════${NC}"
echo -e "${GREEN}${BOLD}  Готово! Локальне середовище активне.${NC}"
echo -e "${GREEN}${BOLD}══════════════════════════════════════════════${NC}"
echo ""
echo -e "  Сайт:     ${BOLD}http://localhost:8080${NC}"
echo -e "  Swagger:  ${BOLD}http://localhost:8080/swagger-ui/index.html${NC}"
echo -e "  DB port:  ${BOLD}localhost:5433${NC}  (user: postgres)"
echo ""
echo -e "  Статус контейнерів:"
docker compose -f "$COMPOSE_FILE" ps --format "table {{.Name}}\t{{.Status}}" 2>/dev/null | sed 's/^/    /'
echo ""
