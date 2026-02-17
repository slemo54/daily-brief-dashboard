# Rocketbook-Gmail Integration

Integrazione automatica per recuperare scansioni Rocketbook da Gmail e mostrarle nella dashboard.

## 📧 Configurazione Gmail API

1. Vai su [Google Cloud Console](https://console.cloud.google.com/)
2. Crea un nuovo progetto (o usa uno esistente)
3. Abilita l'API Gmail:
   - Vai su "APIs & Services" > "Library"
   - Cerca "Gmail API" e abilitala
4. Crea credenziali OAuth2:
   - Vai su "APIs & Services" > "Credentials"
   - Clicca "Create Credentials" > "OAuth client ID"
   - Seleziona "Desktop app"
   - Scarica il file JSON e rinominalo in `credentials.json`
   - Mettilo in `/tmp/daily-brief-ghpages/`

## 🚀 Utilizzo

### Sync manuale
```bash
cd /tmp/daily-brief-ghpages
python3 rocketbook_gmail.py
```

### Aggiungi nota manuale
```bash
python3 rocketbook_cli.py add "Titolo Nota" "17 Feb 2026" "https://drive.google.com/..."
```

### Lista note
```bash
python3 rocketbook_cli.py list
```

## ⏰ Cron Job

Il cron job è configurato per eseguire ogni giorno alle 9:00 CET:

```bash
# Verifica cron job
crontab -l

# Modifica cron job
crontab -e
```

Configurazione attuale:
```
0 9 * * * /tmp/daily-brief-ghpages/rocketbook_cron.sh
```

## 📁 Struttura File

- `rocketbook_gmail.py` - Script principale con Gmail API
- `rocketbook_cli.py` - CLI per gestione manuale
- `rocketbook_cron.sh` - Script cron
- `credentials.json` - Credenziali Google Cloud (da creare)
- `token.json` - Token OAuth2 (generato automaticamente)
- `rocketbook_data.json` - Cache dati note

## 🔧 Troubleshooting

### Errore: "credentials.json non trovato"
Scarica le credenziali da Google Cloud Console e salva come `credentials.json`

### Errore: "Modulo mancante"
Installa le dipendenze:
```bash
pip3 install google-auth google-auth-oauthlib google-auth-httplib2 google-api-python-client
```

### Primo avvio
Al primo avvio, si aprirà il browser per l'autenticazione Google. 
Accedi con l'account Gmail di Anselmo e autorizza l'applicazione.

## 📝 Note

- Le email cercate sono da: `notes@email.getrocketbook.com`
- Vengono recuperate solo email degli ultimi 30 giorni
- Vengono mostrate massimo 6 note nella dashboard
- I PDF vengono salvati in `rocketbook_pdfs/`
