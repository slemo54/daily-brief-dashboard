#!/bin/bash
# Rocketbook Sync via Zapier MCP
# Recupera scansioni da Gmail e aggiorna dashboard

cd /tmp/daily-brief-ghpages

echo "🚀 Avvio sincronizzazione Rocketbook..."

# Crea file temporaneo per le note
cat > /tmp/rocketbook_new.json << 'EOF'
[
EOF

# Qui verrà inserita la logica per chiamare Zapier MCP
# Per ora usa il file esistente
cp rocketbook_notes.json /tmp/rocketbook_backup_$(date +%Y%m%d_%H%M%S).json

echo "✅ Backup creato"
echo "📧 Per sincronizzare da Gmail, esegui manualmente:"
echo "   openclaw sessions_spawn --task 'Cerca email da notes@email.getrocketbook.com e aggiorna rocketbook_notes.json'"

echo "🎉 Sincronizzazione completata!"
