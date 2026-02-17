# Setup Rocketbook → Google Drive

## Problema
I PDF sono allegati in Gmail, ma i link nella dashboard devono puntare a Google Drive per essere visualizzabili.

## Soluzione 1: Configurare Rocketbook (Consigliata)
Rocketbook app → Destinazioni → Google Drive → Imposta come default
- Le scansioni andranno dirette su Google Drive
- Link automatici funzionanti nella dashboard

## Soluzione 2: Script Python (Alternativa)
Se vuoi mantenere l'invio via email:

```bash
# Installa dipendenze
pip3 install google-auth google-auth-oauthlib google-auth-httplib2 google-api-python-client

# Esegui script di sincronizzazione
python3 rocketbook_sync_gdrive.py
```

Lo script:
1. Legge email da notes@email.getrocketbook.com
2. Scarica allegati PDF
3. Carica su Google Drive
4. Aggiorna rocketbook_notes.json con link reali

## Soluzione 3: Manuale (Immediata)
1. Scarica i 7 PDF dalle email Gmail
2. Caricali su https://drive.google.com
3. Condividi ogni file (link "Chiunque con il link")
4. Aggiorna rocketbook_notes.json con i link

## Stato attuale
- ✅ 7 scansioni trovate in Gmail
- ❌ Link Google Drive sono placeholder
- ⏳ In attesa di configurazione
