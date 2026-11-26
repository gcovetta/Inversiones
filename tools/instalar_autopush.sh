#!/bin/bash
# Instala (o reinstala) el servicio que sube solo los commits de Inversiones a GitHub.
# Uso, una sola vez desde la Terminal:   bash ~/Documents/Claude/Projects/Inversiones/tools/instalar_autopush.sh
# Para sacarlo:                          bash ~/Documents/Claude/Projects/Inversiones/tools/instalar_autopush.sh --quitar
REPO="$HOME/Documents/Claude/Projects/Inversiones"
ID="com.gcovetta.inversiones.autopush"
PLIST="$HOME/Library/LaunchAgents/$ID.plist"
launchctl bootout "gui/$(id -u)/$ID" 2>/dev/null
if [ "$1" = "--quitar" ]; then rm -f "$PLIST"; echo "✓ Servicio quitado."; exit 0; fi
mkdir -p "$HOME/Library/LaunchAgents" "$HOME/Library/Logs"
chmod +x "$REPO/tools/autopush.sh"
cat > "$PLIST" <<PL
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0"><dict>
  <key>Label</key><string>$ID</string>
  <key>ProgramArguments</key><array><string>/bin/bash</string><string>$REPO/tools/autopush.sh</string></array>
  <key>WatchPaths</key><array><string>$REPO/.git/refs/heads</string><string>$REPO/.git/logs/HEAD</string></array>
  <key>StartInterval</key><integer>600</integer>
  <key>RunAtLoad</key><true/>
  <key>StandardErrorPath</key><string>$HOME/Library/Logs/inversiones-autopush.log</string>
</dict></plist>
PL
launchctl bootstrap "gui/$(id -u)" "$PLIST" && echo "✓ Listo: cada commit nuevo de Inversiones se sube solo a GitHub." || echo "✕ No se pudo instalar el servicio."
echo "Registro: ~/Library/Logs/inversiones-autopush.log"
