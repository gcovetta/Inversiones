#!/bin/bash
# Sube a GitHub los commits de Inversiones que todavía no estén subidos.
# Lo corre solo el servicio de macOS (ver instalar_autopush.sh): cada vez que hay un commit nuevo
# y, por las dudas, cada 10 minutos. Solo hace "git push": nunca commitea ni toca archivos.
REPO="$HOME/Documents/Claude/Projects/Inversiones"
LOG="$HOME/Library/Logs/inversiones-autopush.log"
export PATH="/usr/local/bin:/opt/homebrew/bin:/usr/bin:/bin:$PATH"
cd "$REPO" || { echo "$(date '+%F %T') no pude entrar a $REPO" >> "$LOG"; exit 1; }
git fetch -q origin 2>>"$LOG"
RAMA=$(git rev-parse --abbrev-ref HEAD)
PEND=$(git rev-list --count "origin/$RAMA..$RAMA" 2>/dev/null || echo 0)
[ "$PEND" = "0" ] && exit 0
if git push -q origin "$RAMA" >>"$LOG" 2>&1; then
  echo "$(date '+%F %T') subidos $PEND commit(s): $(git log -1 --pretty=%s)" >> "$LOG"
  osascript -e "display notification \"Subidos $PEND commit(s) de Inversiones\" with title \"GitHub\"" 2>/dev/null
else
  echo "$(date '+%F %T') ERROR al hacer push (mirá arriba)" >> "$LOG"
  osascript -e 'display notification "No se pudo subir a GitHub: mirá ~/Library/Logs/inversiones-autopush.log" with title "GitHub"' 2>/dev/null
fi
