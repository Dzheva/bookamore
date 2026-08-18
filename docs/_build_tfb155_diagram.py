#!/usr/bin/env python3
"""Генерує схему міграції TFB-155 (GCP e2-micro + Cloudflare Tunnel).

Малює SVG вручну, PNG знімає з нього headless Chrome — той самий підхід, що і в
_build_oauth2_diagram.py, щоб обидві схеми проєкту лишались в одному стилі.

    python3 docs/_build_tfb155_diagram.py
"""

from html import escape
from pathlib import Path

W = 1680

BLUE_FILL, BLUE_LINE, BLUE_TEXT = "#BBDEFB", "#1976D2", "#0D2B45"
GREY_FILL, GREY_LINE, GREY_TEXT = "#ECEFF1", "#607D8B", "#263238"
NOTE_FILL, NOTE_LINE = "#FFF8E1", "#F9A825"
CARD_FILL, CARD_LINE = "#FAFBFC", "#CFD8DC"
CHIP_FILL, CHIP_LINE = "#E8F5E9", "#66BB6A"
INK, MUTED = "#1A237E", "#546E7A"
MONO = "DejaVu Sans Mono, Consolas, monospace"

# ── горизонтальні смуги: конвеєр деплою і шлях запиту ────────────────────────
# (заголовок, підпис, наше/зовнішнє)
ci_lane = [
    ("git push → main", "гілка main у GitHub", True),
    ("GitHub Actions", "job build-images: Maven + npm", False),
    ("GHCR", "ghcr.io/dzheva/bookamore-*:sha", False),
    ("GCP e2-micro", "docker compose pull && up -d", True),
]
rt_lane = [
    ("Користувач", "www.bookamore.store", False),
    ("Cloudflare edge", "TLS + кеш статики", False),
    ("cloudflared", "контейнер, вихідний тунель", True),
    ("frontend · nginx", "порт 80, лише в docker-мережі", True),
    ("backend · Spring", "порт 8080", True),
    ("db · Postgres 16", "порт 5432", True),
]

# ── кроки міграції ───────────────────────────────────────────────────────────
# (номер, заголовок, деталі, артефакт)
steps = [
    ("1", "Створити VM у межах Always Free",
     "e2-micro · us-east1-b · pd-standard 30 GB · network tier STANDARD. Інший тип диска "
     "або регіон робить машину платною; зони перебираються до вільної.",
     "gcloud compute instances create"),
    ("2", "Підготувати систему під 1 GB",
     "Swap-файл 1 GB і vm.swappiness=10 як подушка на піки, Docker, каталог /opt/bookamore, "
     ".env з правами 600.",
     "deploy/gcp/env.example"),
    ("3", "Винести збірку образів у CI",
     "Maven і npm build не влазять у 1 GB — образи збирає GitHub Actions і кладе в GHCR "
     "тегами :latest і :sha. VM робить лише pull.",
     ".github/workflows/deploy.yml"),
    ("4", "Ужати рантайм під ліміт памʼяті",
     "JVM: -Xmx256m -Xss256k, SerialGC, ExitOnOutOfMemoryError. Postgres: shared_buffers=48MB, "
     "без паралельних воркерів. Іменовані томи для БД і фото.",
     "docker-compose.gcp.yaml"),
    ("5", "Полагодити X-Forwarded-Proto",
     "За тунелем nginx бачить лише http, тож Spring будував redirect_uri з http:// — провайдер "
     "такий колбек відхиляє. Схему тепер беремо з вхідного заголовка через map.",
     "frontend/nginx.conf"),
    ("6", "Підняти Cloudflare Tunnel",
     "Токен коннектора в .env, Public Hostname → frontend:80 по docker-мережі. На хості не "
     "публікується жоден порт, прямий вхід по IP закритий.",
     "cloudflared у compose"),
    ("7", "Завести власний домен у Cloudflare",
     "У Cloudflare їде чиста зона bookamore.store, а не alt-web.biz.ua з поштою і чужими "
     "сайтами. Канонічний хост www, апекс віддає 301 на нього. Universal SSL + Always Use HTTPS.",
     "Cloudflare Dashboard"),
    ("8", "Перенести дані та закрити периметр",
     "pg_dump / pg_restore, uploads розпаковуються в named volume. Видалити firewall-правила "
     "http/https, поставити budget alert на $1.",
     "deploy/gcp/README.md §6, §9"),
]

# ── геометрія ────────────────────────────────────────────────────────────────
HDR_H = 132
LANE1_Y = HDR_H + 46
LANE_BOX_H = 66
LANE2_Y = LANE1_Y + LANE_BOX_H + 78
STEPS_Y0 = LANE2_Y + LANE_BOX_H + 66
CARD_H, CARD_GAP = 96, 13
FOOT_H = 108

H = STEPS_Y0 + len(steps) * (CARD_H + CARD_GAP) + FOOT_H + 46

out = []
add = out.append

add(f'<svg xmlns="http://www.w3.org/2000/svg" width="{W}" height="{H}" viewBox="0 0 {W} {H}" '
    f'font-family="DejaVu Sans, Segoe UI, Roboto, sans-serif">')
add(f'<rect width="{W}" height="{H}" fill="#FFFFFF"/>')
add('<defs>'
    f'<marker id="ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" '
    f'orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="{BLUE_LINE}"/></marker>'
    f'<marker id="ahg" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" '
    f'orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="{GREY_LINE}"/></marker>'
    '</defs>')

# ── заголовок ────────────────────────────────────────────────────────────────
add(f'<text x="48" y="60" font-size="30" font-weight="700" fill="{INK}">'
    'Міграція Bookamore на GCP e2-micro за Cloudflare Tunnel</text>')
add(f'<text x="48" y="92" font-size="17" fill="{MUTED}">'
    'Два обмеження визначають усе інше: 1 GB RAM (збірка переїжджає в CI) '
    'і 1 GB вихідного трафіку на місяць (статику кешує Cloudflare).</text>')
add(f'<text x="48" y="116" font-size="15" fill="{MUTED}">'
    'TFB-155 · PROD на GCP за www.bookamore.store · DEV і старий PROD лишаються на VPS '
    'у зоні alt-web.biz.ua</text>')


def lane(y, title, boxes, note):
    """Малює горизонтальну смугу з боксів, зʼєднаних стрілками."""
    add(f'<text x="48" y="{y - 14}" font-size="16" font-weight="700" fill="{INK}">{escape(title)}</text>')
    add(f'<text x="{48 + 260}" y="{y - 14}" font-size="14" fill="{MUTED}">{escape(note)}</text>')

    n = len(boxes)
    gap = 34
    bw = (W - 96 - gap * (n - 1)) // n
    for i, (t, sub, ours) in enumerate(boxes):
        x = 48 + i * (bw + gap)
        fill, line, text = (BLUE_FILL, BLUE_LINE, BLUE_TEXT) if ours else (GREY_FILL, GREY_LINE, GREY_TEXT)
        add(f'<rect x="{x}" y="{y}" width="{bw}" height="{LANE_BOX_H}" rx="10" fill="{fill}" '
            f'stroke="{line}" stroke-width="2"/>')
        add(f'<text x="{x + bw // 2}" y="{y + 28}" font-size="16" font-weight="700" fill="{text}" '
            f'text-anchor="middle">{escape(t)}</text>')
        add(f'<text x="{x + bw // 2}" y="{y + 50}" font-size="12.5" fill="{text}" opacity="0.78" '
            f'text-anchor="middle">{escape(sub)}</text>')
        if i < n - 1:
            ax1, ax2 = x + bw + 6, x + bw + gap - 6
            add(f'<line x1="{ax1}" y1="{y + LANE_BOX_H // 2}" x2="{ax2}" y2="{y + LANE_BOX_H // 2}" '
                f'stroke="{GREY_LINE}" stroke-width="2.4" marker-end="url(#ahg)"/>')


lane(LANE1_Y, "Конвеєр доставки", ci_lane,
     "збірка більше не відбувається на сервері")
lane(LANE2_Y, "Шлях запиту в рантаймі", rt_lane,
     "тунель ініціюється зсередини VM — вхідних портів немає")

# ── кроки ────────────────────────────────────────────────────────────────────
add(f'<text x="48" y="{STEPS_Y0 - 18}" font-size="16" font-weight="700" fill="{INK}">'
    'Порядок виконання</text>')

for i, (num, title, detail, artifact) in enumerate(steps):
    y = STEPS_Y0 + i * (CARD_H + CARD_GAP)
    add(f'<rect x="48" y="{y}" width="{W - 96}" height="{CARD_H}" rx="10" fill="{CARD_FILL}" '
        f'stroke="{CARD_LINE}" stroke-width="1.6"/>')
    add(f'<rect x="48" y="{y}" width="6" height="{CARD_H}" rx="3" fill="{BLUE_LINE}"/>')

    add(f'<circle cx="98" cy="{y + CARD_H // 2}" r="20" fill="{INK}"/>')
    add(f'<text x="98" y="{y + CARD_H // 2 + 7}" font-size="18" font-weight="700" fill="#FFFFFF" '
        f'text-anchor="middle">{num}</text>')

    add(f'<text x="140" y="{y + 33}" font-size="18" font-weight="700" fill="{INK}">'
        f'{escape(title)}</text>')

    # Деталі ріжемо по словах: SVG сам не переносить рядки.
    words, lines, cur = detail.split(), [], ""
    for w_ in words:
        if len(cur) + len(w_) + 1 > 118:
            lines.append(cur)
            cur = w_
        else:
            cur = f"{cur} {w_}".strip()
    lines.append(cur)
    for j, ln in enumerate(lines[:2]):
        add(f'<text x="140" y="{y + 58 + j * 21}" font-size="14" fill="{MUTED}">{escape(ln)}</text>')

    cw = 372
    cx = W - 48 - 20 - cw
    add(f'<rect x="{cx}" y="{y + 28}" width="{cw}" height="40" rx="8" fill="{CHIP_FILL}" '
        f'stroke="{CHIP_LINE}" stroke-width="1.6"/>')
    add(f'<text x="{cx + cw // 2}" y="{y + 53}" font-size="13.5" font-family="{MONO}" '
        f'fill="#1B5E20" text-anchor="middle">{escape(artifact)}</text>')

# ── підвал: перевірка результату ─────────────────────────────────────────────
fy = STEPS_Y0 + len(steps) * (CARD_H + CARD_GAP) + 16
add(f'<rect x="48" y="{fy}" width="{W - 96}" height="{FOOT_H - 16}" rx="10" fill="{NOTE_FILL}" '
    f'stroke="{NOTE_LINE}" stroke-width="2"/>')
add(f'<text x="72" y="{fy + 28}" font-size="16" font-weight="700" fill="{INK}">'
    'Що перевіряти після запуску</text>')
add(f'<text x="72" y="{fy + 54}" font-size="14" fill="{MUTED}">'
    'docker stats — сума RSS нижче ~800 MB · апекс віддає 301 на www зі збереженим шляхом · '
    'cf-cache-status: HIT на /assets/ і /img/</text>')
add(f'<text x="72" y="{fy + 77}" font-size="14" fill="{MUTED}">'
    'прямий запит на публічний IP не відповідає · Billing → Reports через добу показує нуль · '
    'фото і БД лишаються на місці після docker compose down</text>')

add('</svg>')

svg_path = Path(__file__).with_name("TFB-155-gcp-migration.svg")
svg_path.write_text("\n".join(out), encoding="utf-8")
print(f"SVG: {svg_path}  ({W}x{H})")

# ── PNG через headless Chrome ────────────────────────────────────────────────
# Chrome віддає viewport нижчий за --window-size, тож беремо з запасом і зрізаємо.
import subprocess
from PIL import Image

SCALE, PAD = 2, 90
png_path = svg_path.with_suffix(".png")
subprocess.run(
    ["google-chrome", "--headless", "--disable-gpu", "--no-sandbox", "--hide-scrollbars",
     f"--force-device-scale-factor={SCALE}", f"--window-size={W},{H + PAD}",
     f"--screenshot={png_path}", str(svg_path)],
    check=True, capture_output=True,
)
img = Image.open(png_path).crop((0, 0, W * SCALE, H * SCALE))
img.save(png_path)
print(f"PNG: {png_path}  ({img.width}x{img.height})")
