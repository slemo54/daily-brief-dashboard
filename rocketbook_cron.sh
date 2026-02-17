#!/bin/bash
# Rocketbook-Gmail Integration Cron Script
# Eseguito ogni giorno alle 9:00 CET
# Recupera scansioni Rocketbook da Gmail e aggiorna la dashboard

set -e

DASHBOARD_DIR="/tmp/daily-brief-ghpages"
LOG_FILE="/tmp/rocketbook_sync.log"

# Esporta token GitHub da file .env se esiste
if [ -f "$DASHBOARD_DIR/.env" ]; then
    export $(cat "$DASHBOARD_DIR/.env" | grep -v '^#' | xargs)
fi

echo "========================================" >> "$LOG_FILE"
echo "🚀 Rocketbook Sync - $(date)" >> "$LOG_FILE"
echo "========================================" >> "$LOG_FILE"

cd "$DASHBOARD_DIR"

# Funzione per loggare
log() {
    echo "$1" | tee -a "$LOG_FILE"
}

# Verifica Python
if ! command -v python3 &> /dev/null; then
    log "❌ Python3 non trovato"
    exit 1
fi

# Esegui sync Gmail completo
log "🔄 Esecuzione sync Gmail..."
if python3 rocketbook_gmail.py >> "$LOG_FILE" 2>&1; then
    log "✅ Sync completato"
else
    log "⚠️ Sync con errori"
fi

log "🏁 Completato: $(date)"
echo "" >> "$LOG_FILE"
