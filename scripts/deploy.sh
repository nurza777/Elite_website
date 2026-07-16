#!/usr/bin/env bash
# ============================================================
# Elite Academy — автодеплой сайта на сервере (Linux).
#
# Что делает:
#   1. Подтягивает свежие коммиты ветки for-public (правки из
#      админ-панели попадают в GitHub — без этого скрипта сервер
#      их НЕ увидит, и «Опубликовать» будет выглядеть сломанным).
#   2. Пережимает тяжёлые видео, загруженные через админку
#      (страховка: браузерное сжатие в админке не всегда срабатывает).
#
# Установка (один раз, на сервере):
#   chmod +x scripts/deploy.sh
#   crontab -e   → добавить строку (путь поправить под себя):
#   * * * * * /var/www/elite/scripts/deploy.sh >> /var/log/elite-deploy.log 2>&1
#
# Чтобы сжатые видео уезжали обратно в GitHub (рекомендуется),
# серверу нужен доступ на push (deploy key с write или токен в
# git credential store). Если доступа нет — сжатие останется
# локальным коммитом, скрипт продолжит работать через rebase.
# ============================================================
set -euo pipefail

REPO_DIR="$(cd "$(dirname "$0")/.." && pwd)"
BRANCH="for-public"
cd "$REPO_DIR"

git fetch origin "$BRANCH" --quiet
LOCAL=$(git rev-parse HEAD)
REMOTE=$(git rev-parse "origin/$BRANCH")

if [ "$LOCAL" != "$REMOTE" ]; then
  # rebase, а не reset: локальные коммиты сжатия видео не теряются
  git pull --rebase --quiet origin "$BRANCH"
  echo "$(date '+%F %T') deployed $(git rev-parse --short HEAD)"
fi

# ---- пережать тяжёлые видео из админки (>900px или >1.2 Mbps) ----
command -v ffmpeg >/dev/null 2>&1 || exit 0
command -v ffprobe >/dev/null 2>&1 || exit 0

CHANGED=0
while IFS= read -r -d '' f; do
  h=$(ffprobe -v error -select_streams v:0 -show_entries stream=height -of csv=p=0 "$f" 2>/dev/null | head -1 || echo 0)
  br=$(ffprobe -v error -show_entries format=bit_rate -of csv=p=0 "$f" 2>/dev/null | head -1 || echo 0)
  h=${h:-0}; br=${br:-0}
  if [ "$h" -gt 920 ] || [ "$br" -gt 1200000 ]; then
    tmp="${f%.mp4}.tmp.mp4"
    if ffmpeg -y -v error -i "$f" -vf "scale=-2:900,fps=30" -c:v libx264 -crf 30 -preset medium \
         -pix_fmt yuv420p -c:a aac -b:a 96k -movflags +faststart "$tmp"; then
      mv -f "$tmp" "$f"
      echo "$(date '+%F %T') compressed $f ($h px, $br bps)"
      CHANGED=1
    else
      rm -f "$tmp"
    fi
  fi
done < <(find videos -name '*.mp4' -size +4M -print0 2>/dev/null)

if [ "$CHANGED" = "1" ]; then
  git add videos
  git commit --quiet -m "server: auto-compress admin-uploaded videos"
  git push --quiet origin "HEAD:$BRANCH" || echo "$(date '+%F %T') push failed (нет write-доступа?) — сжатие осталось локально"
fi
