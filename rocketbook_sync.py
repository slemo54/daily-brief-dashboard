#!/usr/bin/env python3
"""
Rocketbook-Gmail Integration Script per Daily Brief Dashboard
Recupera scansioni Rocketbook da Gmail e aggiorna la dashboard.
"""

import os
import base64
import json
import re
import subprocess
from datetime import datetime, timedelta
from pathlib import Path
from urllib.parse import quote

# Configurazione
GMAIL_USER = "anselmoacquah@gmail.com"
ROCKETBOOK_SENDER = "notes@email.getrocketbook.com"
DASHBOARD_DIR = Path("/tmp/daily-brief-ghpages")
INDEX_FILE = DASHBOARD_DIR / "index.html"
DATA_FILE = DASHBOARD_DIR / "rocketbook_data.json"
GITHUB_REPO = "slemo54/daily-brief-dashboard"
GITHUB_TOKEN = os.environ.get("GITHUB_TOKEN", "")

def run_gmail_search():
    """Cerca email da Rocketbook usando gcloud CLI o Gmail API via MCP."""
    print("🔍 Ricerca email da Rocketbook...")
    
    # Usa gcloud per autenticazione Gmail se disponibile
    # Altrimenti usa curl con Gmail API
    
    # Query Gmail: da notes@email.getrocketbook.com negli ultimi 30 giorni
    query = f"from:{ROCKETBOOK_SENDER} newer_than:30d has:attachment filename:pdf"
    
    # Per ora simuliamo con una ricerca via curl se possibile
    # In produzione, questo richiederebbe OAuth2 setup
    
    # Tenta di usare gcloud per ottenere access token
    try:
        result = subprocess.run(
            ["gcloud", "auth", "print-access-token"],
            capture_output=True, text=True, timeout=30
        )
        if result.returncode == 0:
            access_token = result.stdout.strip()
            return fetch_gmail_messages(access_token, query)
    except (subprocess.TimeoutExpired, FileNotFoundError):
        pass
    
    # Fallback: leggi da file locale se esiste
    if DATA_FILE.exists():
        with open(DATA_FILE) as f:
            return json.load(f)
    
    return []

def fetch_gmail_messages(access_token, query):
    """Fetch messaggi Gmail usando l'API."""
    import urllib.request
    import urllib.parse
    
    encoded_query = urllib.parse.quote(query)
    url = f"https://gmail.googleapis.com/gmail/v1/users/me/messages?q={encoded_query}"
    
    req = urllib.request.Request(
        url,
        headers={"Authorization": f"Bearer {access_token}"}
    )
    
    try:
        with urllib.request.urlopen(req, timeout=30) as response:
            data = json.loads(response.read().decode())
            messages = data.get("messages", [])
            
            notes = []
            for msg in messages[:10]:  # Max 10 note recenti
                note = fetch_message_details(access_token, msg["id"])
                if note:
                    notes.append(note)
            
            return notes
    except Exception as e:
        print(f"⚠️ Errore fetch Gmail: {e}")
        return []

def fetch_message_details(access_token, msg_id):
    """Recupera dettagli di un messaggio specifico."""
    import urllib.request
    
    url = f"https://gmail.googleapis.com/gmail/v1/users/me/messages/{msg_id}"
    
    req = urllib.request.Request(
        url,
        headers={"Authorization": f"Bearer {access_token}"}
    )
    
    try:
        with urllib.request.urlopen(req, timeout=30) as response:
            data = json.loads(response.read().decode())
            
            # Estrai headers
            headers = {h["name"]: h["value"] for h in data["payload"]["headers"]}
            subject = headers.get("Subject", "Nota Rocketbook")
            date_str = headers.get("Date", "")
            
            # Parse date
            try:
                date = parse_gmail_date(date_str)
            except:
                date = datetime.now()
            
            # Cerca allegati PDF
            attachments = []
            parts = data["payload"].get("parts", [])
            
            for part in parts:
                if part.get("filename", "").endswith(".pdf"):
                    attachment_id = part["body"].get("attachmentId")
                    if attachment_id:
                        attachments.append({
                            "id": attachment_id,
                            "filename": part["filename"],
                            "size": part["body"].get("size", 0)
                        })
            
            return {
                "id": msg_id,
                "title": clean_subject(subject),
                "date": date.strftime("%d %b %Y"),
                "date_iso": date.isoformat(),
                "attachments": attachments,
                "pdfUrl": None  # Sarà popolato dopo upload su Drive
            }
    except Exception as e:
        print(f"⚠️ Errore dettagli messaggio {msg_id}: {e}")
        return None

def parse_gmail_date(date_str):
    """Parse date string da Gmail."""
    # Formato tipico: "Wed, 15 Feb 2026 14:30:00 +0000"
    patterns = [
        r"\d{1,2}\s+\w{3}\s+\d{4}",
        r"\w{3},\s+(\d{1,2}\s+\w{3}\s+\d{4})"
    ]
    
    for pattern in patterns:
        match = re.search(pattern, date_str)
        if match:
            try:
                return datetime.strptime(match.group(1) if match.groups() else match.group(0), "%d %b %Y")
            except:
                pass
    
    return datetime.now()

def clean_subject(subject):
    """Pulisci il subject per usarlo come titolo."""
    # Rimuovi prefissi tipo "Fwd:", "Re:"
    subject = re.sub(r"^(Fwd:|Re:|FW:|RE:)\s*", "", subject, flags=re.IGNORECASE)
    # Rimuovi riferimenti a Rocketbook
    subject = re.sub(r"\s*-\s*Rocketbook\s*$", "", subject, flags=re.IGNORECASE)
    subject = re.sub(r"^Rocketbook\s*-\s*", "", subject, flags=re.IGNORECASE)
    return subject.strip() or "Nota Rocketbook"

def upload_to_drive(access_token, attachment_data, filename):
    """Upload PDF su Google Drive e restituisci link."""
    # Questa funzione richiede setup Google Drive API
    # Per ora restituisce un placeholder
    print(f"📤 Upload {filename} su Google Drive...")
    
    # In produzione, implementare upload vero
    # Per ora simuliamo con link placeholder
    return f"https://drive.google.com/file/d/placeholder/view"

def update_dashboard(notes):
    """Aggiorna il file index.html con le note Rocketbook."""
    print(f"📝 Aggiornamento dashboard con {len(notes)} note...")
    
    if not INDEX_FILE.exists():
        print(f"❌ File {INDEX_FILE} non trovato")
        return False
    
    with open(INDEX_FILE, "r", encoding="utf-8") as f:
        content = f.read()
    
    # Genera HTML per le note
    if notes:
        notes_html = generate_rocketbook_html(notes)
    else:
        notes_html = generate_empty_rocketbook_html()
    
    # Sostituisci il contenuto del container Rocketbook
    pattern = r'(<div id="rocketbook-container">)(.*?)(</div>)'
    replacement = f'\\1\n{notes_html}\n\\3'
    
    import re
    new_content = re.sub(pattern, replacement, content, flags=re.DOTALL)
    
    # Aggiorna anche il contatore
    count_pattern = r'(<div class="kpi-value" id="rocketbook-count">)(\d+)(</div>)'
    count_replacement = f'\\1{len(notes)}\\3'
    new_content = re.sub(count_pattern, count_replacement, new_content)
    
    # Aggiorna data ultimo aggiornamento
    now = datetime.now().strftime("%d/%m/%Y %H:%M")
    date_pattern = r'(<span id="last-updated">)(.*?)(</span>)'
    date_replacement = f'\\1{now}\\3'
    new_content = re.sub(date_pattern, date_replacement, new_content)
    
    with open(INDEX_FILE, "w", encoding="utf-8") as f:
        f.write(new_content)
    
    # Salva anche i dati JSON per riferimento
    with open(DATA_FILE, "w", encoding="utf-8") as f:
        json.dump(notes, f, indent=2)
    
    print(f"✅ Dashboard aggiornata: {len(notes)} note")
    return True

def generate_rocketbook_html(notes):
    """Genera HTML per le note Rocketbook."""
    items = []
    for note in notes[:6]:  # Max 6 note visibili
        pdf_url = note.get("pdfUrl") or "#"
        items.append(f'''                <a href="{pdf_url}" target="_blank" class="rocketbook-item">
                    <div class="rocketbook-thumb">📝</div>
                    <div class="rocketbook-info">
                        <div class="rocketbook-title">{note["title"]}</div>
                        <div class="rocketbook-date">{note["date"]}</div>
                    </div>
                </a>''')
    
    return '''            <div class="rocketbook-grid">
''' + '\n'.join(items) + '''
            </div>'''

def generate_empty_rocketbook_html():
    """Genera HTML per stato vuoto."""
    return '''            <div class="rocketbook-empty">
                <div class="rocketbook-empty-icon">📭</div>
                <div>Nessuna scansione recente</div>
                <div style="font-size: 0.8rem; margin-top: 8px;">Le note da Anselmo Acquah via Rocketbook appariranno qui</div>
            </div>'''

def push_to_github():
    """Pusha le modifiche su GitHub."""
    print("🚀 Push su GitHub...")
    
    os.chdir(DASHBOARD_DIR)
    
    # Configura git se necessario
    subprocess.run(["git", "config", "user.email", "bot@dailybrief.local"], check=False)
    subprocess.run(["git", "config", "user.name", "Daily Brief Bot"], check=False)
    
    # Aggiungi e committa
    result = subprocess.run(["git", "add", "-A"], capture_output=True, text=True)
    if result.returncode != 0:
        print(f"⚠️ git add: {result.stderr}")
    
    result = subprocess.run(
        ["git", "commit", "-m", f"Aggiornamento Rocketbook - {datetime.now().strftime('%Y-%m-%d %H:%M')}"],
        capture_output=True, text=True
    )
    
    if result.returncode != 0 and "nothing to commit" not in result.stderr.lower():
        print(f"⚠️ git commit: {result.stderr}")
        return False
    
    # Push
    result = subprocess.run(
        ["git", "push", "origin", "main"],
        capture_output=True, text=True,
        env={**os.environ, "GIT_ASKPASS": "echo", "GIT_USERNAME": "x-access-token", "GIT_PASSWORD": GITHUB_TOKEN}
    )
    
    if result.returncode == 0:
        print("✅ Push completato")
        return True
    else:
        print(f"⚠️ git push: {result.stderr}")
        return False

def main():
    """Funzione principale."""
    print("🚀 Rocketbook-Gmail Integration")
    print("=" * 50)
    
    # Verifica directory
    DASHBOARD_DIR.mkdir(parents=True, exist_ok=True)
    
    # Recupera note da Gmail
    notes = run_gmail_search()
    
    # Aggiorna dashboard
    if update_dashboard(notes):
        # Push su GitHub
        push_to_github()
    
    print("=" * 50)
    print("✅ Completato!")

if __name__ == "__main__":
    main()
