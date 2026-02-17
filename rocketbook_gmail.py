#!/usr/bin/env python3
"""
Rocketbook-Gmail Full Integration
Usa Gmail API per recuperare scansioni PDF e aggiornare la dashboard.
Richiede: pip install google-auth google-auth-oauthlib google-auth-httplib2 google-api-python-client
"""

import os
import sys
import json
import base64
import re
from datetime import datetime, timedelta
from pathlib import Path

# Configurazione
DASHBOARD_DIR = Path("/tmp/daily-brief-ghpages")
INDEX_FILE = DASHBOARD_DIR / "index.html"
DATA_FILE = DASHBOARD_DIR / "rocketbook_data.json"
CREDENTIALS_FILE = DASHBOARD_DIR / "credentials.json"
TOKEN_FILE = DASHBOARD_DIR / "token.json"
ROCKETBOOK_SENDER = "notes@email.getrocketbook.com"

def get_gmail_service():
    """Autentica e restituisci servizio Gmail API."""
    try:
        from google.auth.transport.requests import Request
        from google.oauth2.credentials import Credentials
        from google_auth_oauthlib.flow import InstalledAppFlow
        from googleapiclient.discovery import build
        
        SCOPES = ['https://www.googleapis.com/auth/gmail.readonly']
        creds = None
        
        # Carica token esistente
        if TOKEN_FILE.exists():
            creds = Credentials.from_authorized_user_file(str(TOKEN_FILE), SCOPES)
        
        # Se non ci sono credenziali valide, fai login
        if not creds or not creds.valid:
            if creds and creds.expired and creds.refresh_token:
                creds.refresh(Request())
            elif CREDENTIALS_FILE.exists():
                flow = InstalledAppFlow.from_client_secrets_file(str(CREDENTIALS_FILE), SCOPES)
                creds = flow.run_local_server(port=0)
            else:
                print("❌ File credentials.json non trovato")
                print("📋 Scarica le credenziali da Google Cloud Console:")
                print("   https://console.cloud.google.com/apis/credentials")
                return None
            
            # Salva token
            with open(TOKEN_FILE, 'w') as token:
                token.write(creds.to_json())
        
        return build('gmail', 'v1', credentials=creds)
    
    except ImportError as e:
        print(f"❌ Modulo mancante: {e}")
        print("📦 Installa con: pip install google-auth google-auth-oauthlib google-auth-httplib2 google-api-python-client")
        return None

def fetch_rocketbook_emails(service):
    """Recupera email da Rocketbook."""
    if not service:
        return []
    
    print("🔍 Ricerca email da Rocketbook...")
    
    # Query: email da Rocketbook con allegati PDF negli ultimi 30 giorni
    query = f"from:{ROCKETBOOK_SENDER} newer_than:30d has:attachment filename:pdf"
    
    results = service.users().messages().list(userId='me', q=query, maxResults=10).execute()
    messages = results.get('messages', [])
    
    print(f"📧 Trovate {len(messages)} email")
    
    notes = []
    for msg in messages:
        note = parse_email(service, msg['id'])
        if note:
            notes.append(note)
    
    return notes

def parse_email(service, msg_id):
    """Estrai informazioni da un'email."""
    try:
        msg = service.users().messages().get(userId='me', id=msg_id, format='full').execute()
        
        headers = msg['payload']['headers']
        header_dict = {h['name']: h['value'] for h in headers}
        
        subject = header_dict.get('Subject', 'Nota Rocketbook')
        date_str = header_dict.get('Date', '')
        
        # Parse data
        date = parse_date(date_str)
        
        # Cerca allegati PDF
        attachments = []
        parts = msg['payload'].get('parts', [])
        
        for part in parts:
            filename = part.get('filename', '')
            if filename.endswith('.pdf'):
                attachment_id = part['body'].get('attachmentId')
                if attachment_id:
                    attachments.append({
                        'id': attachment_id,
                        'filename': filename,
                        'message_id': msg_id
                    })
        
        return {
            'id': msg_id,
            'title': clean_subject(subject),
            'date': date.strftime('%d %b %Y'),
            'date_iso': date.isoformat(),
            'attachments': attachments,
            'url': None  # Da popolare con link Drive
        }
    
    except Exception as e:
        print(f"⚠️ Errore parsing email {msg_id}: {e}")
        return None

def parse_date(date_str):
    """Parse data da header email."""
    # Pattern comuni
    patterns = [
        r'(\d{1,2})\s+(\w{3})\s+(\d{4})',
        r'(\w{3}),\s+(\d{1,2})\s+(\w{3})\s+(\d{4})'
    ]
    
    months = {
        'jan': 1, 'feb': 2, 'mar': 3, 'apr': 4, 'may': 5, 'jun': 6,
        'jul': 7, 'aug': 8, 'sep': 9, 'oct': 10, 'nov': 11, 'dec': 12,
        'gen': 1, 'feb': 2, 'mar': 3, 'apr': 4, 'mag': 5, 'giu': 6,
        'lug': 7, 'ago': 8, 'set': 9, 'ott': 10, 'nov': 11, 'dic': 12
    }
    
    for pattern in patterns:
        match = re.search(pattern, date_str, re.IGNORECASE)
        if match:
            try:
                groups = match.groups()
                if len(groups) == 3:
                    day, month_str, year = groups
                else:
                    _, day, month_str, year = groups
                
                month = months.get(month_str.lower(), 1)
                return datetime(int(year), month, int(day))
            except:
                pass
    
    return datetime.now()

def clean_subject(subject):
    """Pulisci subject email."""
    subject = re.sub(r'^(Fwd:|Re:|FW:|RE:)\s*', '', subject, flags=re.IGNORECASE)
    subject = re.sub(r'\s*-\s*Rocketbook\s*$', '', subject, flags=re.IGNORECASE)
    subject = re.sub(r'^Rocketbook\s*-\s*', '', subject, flags=re.IGNORECASE)
    return subject.strip() or 'Nota Rocketbook'

def download_attachment(service, message_id, attachment_id, filename):
    """Scarica allegato da Gmail."""
    try:
        attachment = service.users().messages().attachments().get(
            userId='me', messageId=message_id, id=attachment_id
        ).execute()
        
        data = base64.urlsafe_b64decode(attachment['data'])
        
        # Salva in directory locale
        pdf_dir = DASHBOARD_DIR / 'rocketbook_pdfs'
        pdf_dir.mkdir(exist_ok=True)
        
        filepath = pdf_dir / filename
        with open(filepath, 'wb') as f:
            f.write(data)
        
        return str(filepath)
    except Exception as e:
        print(f"⚠️ Errore download {filename}: {e}")
        return None

def update_dashboard(notes):
    """Aggiorna HTML dashboard."""
    if not INDEX_FILE.exists():
        print(f"❌ File {INDEX_FILE} non trovato")
        return False
    
    with open(INDEX_FILE, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Genera HTML
    if notes:
        html = generate_notes_html(notes)
    else:
        html = generate_empty_html()
    
    # Sostituisci contenuto
    import re
    
    pattern = r'(<div id="rocketbook-container">)(.*?)(</div>\s*</div>\s*</div>\s*<footer>)'
    replacement = f'\\1\n{html}\n\\3'
    content = re.sub(pattern, replacement, content, flags=re.DOTALL)
    
    # Aggiorna contatore
    content = re.sub(
        r'(<div class="kpi-value" id="rocketbook-count">)\d+(</div>)',
        f'\\g<1>{len(notes)}\\g<2>',
        content
    )
    
    # Aggiorna timestamp
    now = datetime.now().strftime('%d/%m/%Y %H:%M')
    content = re.sub(
        r'(<span id="last-updated">).*?(</span>)',
        f'\\g<1>{now}\\g<2>',
        content
    )
    
    with open(INDEX_FILE, 'w', encoding='utf-8') as f:
        f.write(content)
    
    # Salva dati
    with open(DATA_FILE, 'w') as f:
        json.dump(notes, f, indent=2)
    
    print(f"✅ Dashboard aggiornata: {len(notes)} note")
    return True

def generate_notes_html(notes):
    """Genera HTML griglia note."""
    items = []
    for note in notes[:6]:
        url = note.get('url') or f"https://mail.google.com/mail/u/0/#all/{note['id']}"
        items.append(f'''            <a href="{url}" target="_blank" class="rocketbook-item">
                <div class="rocketbook-thumb">📝</div>
                <div class="rocketbook-info">
                    <div class="rocketbook-title">{note['title']}</div>
                    <div class="rocketbook-date">{note['date']}</div>
                </div>
            </a>''')
    
    return f'''            <div class="rocketbook-grid">
{'\n'.join(items)}
            </div>'''

def generate_empty_html():
    """Genera HTML stato vuoto."""
    return '''            <div class="rocketbook-empty">
                <div class="rocketbook-empty-icon">📭</div>
                <div>Nessuna scansione recente</div>
                <div style="font-size: 0.8rem; margin-top: 8px;">Le note da Anselmo Acquah via Rocketbook appariranno qui</div>
            </div>'''

def push_to_github():
    """Pusha su GitHub."""
    import subprocess
    
    os.chdir(DASHBOARD_DIR)
    
    # Configura git
    subprocess.run(['git', 'config', 'user.email', 'bot@dailybrief.local'], 
                   capture_output=True, check=False)
    subprocess.run(['git', 'config', 'user.name', 'Daily Brief Bot'], 
                   capture_output=True, check=False)
    
    # Stage
    subprocess.run(['git', 'add', '-A'], capture_output=True)
    
    # Commit
    result = subprocess.run(
        ['git', 'commit', '-m', f'🔄 Aggiornamento Rocketbook - {datetime.now().strftime("%Y-%m-%d %H:%M")}'],
        capture_output=True, text=True
    )
    
    if result.returncode != 0 and 'nothing to commit' not in result.stderr.lower():
        print(f"⚠️ Commit: {result.stderr}")
    
    # Push
    env = os.environ.copy()
    env['GIT_ASKPASS'] = 'echo'
    env['GIT_USERNAME'] = 'x-access-token'
    env['GIT_PASSWORD'] = os.environ.get('GITHUB_TOKEN', '')
    
    if not env['GIT_PASSWORD']:
        print('❌ GITHUB_TOKEN non impostato')
        return False
    
    result = subprocess.run(
        ['git', 'push', 'origin', 'main'],
        capture_output=True, text=True, env=env
    )
    
    if result.returncode == 0:
        print('✅ Push su GitHub completato')
        return True
    else:
        print(f'❌ Push fallito: {result.stderr}')
        return False

def main():
    """Funzione principale."""
    print('🚀 Rocketbook-Gmail Full Integration')
    print('=' * 50)
    
    DASHBOARD_DIR.mkdir(parents=True, exist_ok=True)
    
    # Ottieni servizio Gmail
    service = get_gmail_service()
    
    if service:
        # Recupera email
        notes = fetch_rocketbook_emails(service)
        
        # Scarica allegati (opzionale)
        for note in notes:
            for att in note.get('attachments', []):
                filepath = download_attachment(service, att['message_id'], att['id'], att['filename'])
                if filepath:
                    print(f"📥 Scaricato: {att['filename']}")
    else:
        # Fallback: carica dati esistenti
        if DATA_FILE.exists():
            with open(DATA_FILE) as f:
                notes = json.load(f)
        else:
            notes = []
    
    # Aggiorna dashboard
    if update_dashboard(notes):
        push_to_github()
    
    print('=' * 50)

if __name__ == '__main__':
    main()
