#!/usr/bin/env bash
# ============================================================
# Elite Academy — прекомпиляция сайта для продакшена.
#
# Зачем: исходный сайт грузит Babel в браузер и компилирует все
# .jsx у КАЖДОГО посетителя при каждом заходе (отсюда спиннер
# «Загрузка…»). Этот скрипт компилирует .jsx один раз на сервере
# и собирает готовый сайт в отдельную папку — страницы начинают
# открываться в разы быстрее.
#
# Использование:
#   scripts/build.sh /var/www/elite-www
#   (папка НЕ должна быть внутри репозитория; nginx root
#    указывается на неё — см. scripts/nginx-elite.conf.example)
#
# Требования на сервере: node 18+ и npm (apt install nodejs npm).
# Зависимости ставятся автоматически при первом запуске.
#
# ВАЖНО: компилируем только JSX (@babel/preset-react), без
# preset-env — ровно то же самое делает Babel standalone в
# браузере; преобразование async/await не требуется и сломало бы
# админку (regenerator).
# ============================================================
set -euo pipefail

REPO="$(cd "$(dirname "$0")/.." && pwd)"
OUT="${1:-${ELITE_BUILD_DIR:-}}"
if [ -z "$OUT" ]; then
  echo "Использование: scripts/build.sh <папка-для-сборки>" >&2
  exit 1
fi
case "$OUT" in
  "$REPO"/*) echo "Папка сборки не должна быть внутри репозитория: $OUT" >&2; exit 1 ;;
esac

cd "$REPO"

# ---- зависимости (один раз) ----
if [ ! -d node_modules/@babel/cli ]; then
  npm install --no-audit --no-fund --loglevel=error
fi

# ---- копия сайта без служебного ----
mkdir -p "$OUT"
if command -v rsync >/dev/null 2>&1; then
  rsync -a --delete \
    --exclude .git --exclude node_modules --exclude scripts \
    --exclude package.json --exclude package-lock.json \
    --exclude 'elite/*.jsx' \
    "$REPO/" "$OUT/"
else
  rm -rf "$OUT"
  mkdir -p "$OUT"
  cp -a "$REPO/." "$OUT/"
  rm -rf "$OUT/.git" "$OUT/node_modules" "$OUT/scripts" \
         "$OUT/package.json" "$OUT/package-lock.json"
  find "$OUT/elite" -name '*.jsx' -delete
fi

# ---- компиляция JSX → JS ----
# Каждый файл оборачиваем в IIFE: Babel standalone исполняет text/babel
# скрипты в изолированной функции, поэтому одинаковые top-level const
# (например `const { useState } = React;`) в разных файлах не конфликтуют.
# Обычные <script> делят global scope — без обёртки будет SyntaxError.
TMP="$(mktemp)"
for f in elite/*.jsx; do
  npx --no-install babel "$f" --presets=@babel/preset-react > "$TMP"
  {
    printf '(function () {\n'
    cat "$TMP"
    printf '\n})();\n'
  } > "$OUT/elite/$(basename "${f%.jsx}").js"
done
rm -f "$TMP"

# ---- html: обычные скрипты вместо text/babel, убрать Babel standalone ----
for h in "$OUT"/*.html; do
  sed -i \
    -e '/@babel\/standalone/d' \
    -e 's|<script type="text/babel" src="elite/\([a-zA-Z0-9._-]*\)\.jsx\([^"]*\)"></script>|<script src="elite/\1.js\2"></script>|g' \
    "$h"
done

echo "$(date '+%F %T') build → $OUT"
