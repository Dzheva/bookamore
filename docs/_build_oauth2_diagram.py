#!/usr/bin/env python3
"""Генерує docs/TFB-010-oauth2-flow.svg — схему рантайм-флоу Google OAuth2.0.

PNG збирається з цього SVG через headless Chrome (див. команду в кінці файлу).
"""

from html import escape
from pathlib import Path

W = 1560
LANE_Y = 150          # верх боксів акторів
LANE_H = 64
STEP_Y0 = 300         # перша стрілка
STEP_DY = 88

BLUE_FILL, BLUE_LINE, BLUE_TEXT = "#BBDEFB", "#1976D2", "#0D2B45"
GREY_FILL, GREY_LINE, GREY_TEXT = "#ECEFF1", "#607D8B", "#263238"
NOTE_FILL, NOTE_LINE = "#FFF8E1", "#F9A825"
INK, MUTED = "#1A237E", "#546E7A"

actors = [
    ("browser", 190, "Браузер · React SPA", "bookamore.alt-web.biz.ua", True),
    ("nginx", 590, "Nginx", "хостовий + у контейнері", True),
    ("backend", 990, "Backend · Spring Boot", "Spring Security oauth2Login", True),
    ("google", 1390, "Google", "accounts.google.com", False),
]
X = {a[0]: a[1] for a in actors}

# (тип, від, до, номер, заголовок, підпис)
steps = [
    ("arrow", "browser", "nginx", "1", "Клік «Continue with Google»",
     "GET /oauth2/authorization/google — повна навігація сторінки, не fetch"),
    ("arrow", "nginx", "backend", "2", "proxy_pass до backend:8080",
     "location ~ ^/(oauth2/authorization|login/oauth2/code)/  +  X-Forwarded-Proto $scheme"),
    ("arrow", "backend", "browser", "3", "302 Location: accounts.google.com/o/oauth2/v2/auth",
     "redirect_uri = {origin}/login/oauth2/code/google — будується з X-Forwarded-* заголовків"),
    ("arrow", "browser", "google", "4", "Екран згоди: автентифікація користувача",
     "scopes: openid, profile, email"),
    ("arrow", "google", "browser", "5", "302 назад на застосунок з authorization code",
     "/login/oauth2/code/google?code=…"),
    ("arrow", "browser", "backend", "6", "Колбек з code — через ту саму локацію Nginx",
     "SPA цей URL не бачить: він іде у бекенд, а не в React Router"),
    ("bidir", "backend", "google", "7", "Server-to-server: обмін code на токени та профіль",
     "CustomOidcUserService — браузер у цьому обміні не бере участі"),
    ("note", "backend", None, "8", "OAuth2ServiceImpl: find-or-create User, лінк AuthProvider по email",
     "OAuth2SuccessHandler видає власний JWT застосунку"),
    ("arrow", "backend", "browser", "9", "302 на {CLIENT_URL}/oauth2/callback?token=<JWT>",
     "при невдачі — /oauth2/callback?error=oauth2_login_failed"),
    ("note", "browser", None, "10", "OAuth2CallbackPage: setCredentials → localStorage",
     "GET /api/v1/user/current-user → navigate('/', replace: true)"),
]

H = STEP_Y0 + STEP_DY * len(steps) + 130
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
add(f'<text x="48" y="62" font-size="30" font-weight="700" fill="{INK}">'
    'Google OAuth2.0 у Bookamore — як працює вхід</text>')
add(f'<text x="48" y="94" font-size="17" fill="{MUTED}">'
    'Браузер ніколи не говорить з Google від імені застосунку — до Google ходить бекенд. '
    'SPA лише йде за редиректами.</text>')
add(f'<text x="48" y="118" font-size="15" fill="{MUTED}">'
    'TFB-010 · гілка TFB-010-oauth2-callback-and-nginx · коміт cc1f029</text>')

# ── актори та lifelines ──────────────────────────────────────────────────────
for key, x, title, sub, ours in actors:
    fill, line, text = (BLUE_FILL, BLUE_LINE, BLUE_TEXT) if ours else (GREY_FILL, GREY_LINE, GREY_TEXT)
    bw = 320
    add(f'<rect x="{x - bw // 2}" y="{LANE_Y}" width="{bw}" height="{LANE_H}" rx="10" '
        f'fill="{fill}" stroke="{line}" stroke-width="2"/>')
    add(f'<text x="{x}" y="{LANE_Y + 27}" font-size="17" font-weight="700" fill="{text}" '
        f'text-anchor="middle">{escape(title)}</text>')
    add(f'<text x="{x}" y="{LANE_Y + 49}" font-size="13" fill="{text}" opacity="0.75" '
        f'text-anchor="middle">{escape(sub)}</text>')
    add(f'<line x1="{x}" y1="{LANE_Y + LANE_H}" x2="{x}" y2="{H - 78}" stroke="{line}" '
        f'stroke-width="2" stroke-dasharray="6 7" opacity="0.55"/>')

# ── кроки ────────────────────────────────────────────────────────────────────
for i, (kind, a, b, num, title, sub) in enumerate(steps):
    y = STEP_Y0 + i * STEP_DY

    if kind == "note":
        x = X[a]
        nw, nh = 610, 62
        nx = x + 26
        if nx + nw > W - 40:
            nx = x - 26 - nw
        add(f'<rect x="{nx}" y="{y - nh // 2}" width="{nw}" height="{nh}" rx="8" '
            f'fill="{NOTE_FILL}" stroke="{NOTE_LINE}" stroke-width="2"/>')
        add(f'<text x="{nx + 18}" y="{y - 6}" font-size="15" font-weight="600" fill="{INK}">'
            f'{escape(title)}</text>')
        add(f'<text x="{nx + 18}" y="{y + 17}" font-size="13.5" fill="{MUTED}">{escape(sub)}</text>')
        badge_x = x
    else:
        x1, x2 = X[a], X[b]
        external = "google" in (a, b)
        stroke = GREY_LINE if external else BLUE_LINE
        marker = "ahg" if external else "ah"
        d = 1 if x2 > x1 else -1
        sx, ex = x1 + d * 14, x2 - d * 14
        start_attr = f' marker-start="url(#{marker})"' if kind == "bidir" else ""
        add(f'<line x1="{sx}" y1="{y}" x2="{ex}" y2="{y}" stroke="{stroke}" stroke-width="2.6" '
            f'marker-end="url(#{marker})"{start_attr}/>')
        mid = (x1 + x2) // 2
        add(f'<text x="{mid}" y="{y - 15}" font-size="15" font-weight="600" fill="{INK}" '
            f'text-anchor="middle">{escape(title)}</text>')
        add(f'<text x="{mid}" y="{y + 26}" font-size="13.5" fill="{MUTED}" '
            f'text-anchor="middle">{escape(sub)}</text>')
        badge_x = sx - d * 4

    add(f'<circle cx="{badge_x}" cy="{y}" r="15" fill="{INK}"/>')
    add(f'<text x="{badge_x}" y="{y + 5}" font-size="14" font-weight="700" fill="#FFFFFF" '
        f'text-anchor="middle">{num}</text>')

# ── підвал ───────────────────────────────────────────────────────────────────
fy = H - 46
add(f'<rect x="48" y="{fy - 30}" width="{W - 96}" height="58" rx="8" fill="#F5F7FA" stroke="#CFD8DC"/>')
add(f'<text x="70" y="{fy - 8}" font-size="14" fill="{INK}">'
    'Токен приїжджає query-параметром після повного перезавантаження сторінки, а не JSON-відповіддю: '
    'Redux-стан на цей момент порожній.</text>')
add(f'<text x="70" y="{fy + 15}" font-size="14" fill="{MUTED}">'
    'Навігацію переживає лише localStorage — тому колбек-сторінка першою дією робить setCredentials, '
    'а перехід іде з replace: true, щоб токен не лишився в історії.</text>')

add('</svg>')

svg_path = Path(__file__).with_name("TFB-010-oauth2-flow.svg")
svg_path.write_text("\n".join(out), encoding="utf-8")
print(f"SVG: {svg_path}  ({W}x{H})")

# ── PNG через headless Chrome ────────────────────────────────────────────────
# Chrome віддає viewport на ~78px нижчий за --window-size, тож беремо з запасом
# і зрізаємо зайве. SCALE=2 — щоб текст лишався чітким при перегляді та друку.
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
