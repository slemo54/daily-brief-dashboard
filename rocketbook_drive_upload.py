#!/usr/bin/env python3
"""
Rocketbook → Google Drive Upload via Zapier MCP
Carica i PDF delle scansioni Rocketbook su Google Drive
"""

import os
import sys
import json
import base64
import re
import subprocess
import tempfile
from datetime import datetime
from pathlib import Path
from urllib.parse import quote

# Configurazione
DASHBOARD_DIR = Path("/tmp/daily-brief-ghpages")
ROCKETBOOK_NOTES_FILE = DASHBOARD_DIR / "rocketbook_notes.json"
ROCKETBOOK_SENDER = "notes@email.getrocketbook.com"
GMAIL_USER = "anselmoacquah@gmail.com"

# Google Drive folder ID per "Rocketbook Scans"
# Questo va ottenuto da Zapier MCP o configurato
ROCKETBOOK_DRIVE_FOLDER = "Rocketbook Scans"

def get_gmail_service():
    """Autentica e restituisci servizio Gmail API."""
    try:
        from google.auth.transport.requests import Request
        from google.oauth2.credentials import Credentials
        from google_auth_oauthlib.flow import InstalledAppFlow
        from googleapiclient.discovery import build
        
        SCOPES = ['https://www.googleapis.com/auth/gmail.readonly']
        creds = None
        
        token_file = DASHBOARD_DIR / "token.json"
        credentials_file = DASHBOARD_DIR / "credentials.json"
        
        # Carica token esistente
        if token_file.exists():
            creds = Credentials.from_authorized_user_file(str(token_file), SCOPES)
        
        # Se non ci sono credenziali valide, fai login
        if not creds or not creds.valid:
            if creds and creds.expired and creds.refresh_token:
                creds.refresh(Request())
            elif credentials_file.exists():
                flow = InstalledAppFlow.from_client_secrets_file(str(credentials_file), SCOPES)
                creds = flow.run_local_server(port=0)
            else:
                print("❌ File credentials.json non trovato")
                return None
            
            # Salva token
            with open(token_file, 'w') as token:
                token.write(creds.to_json())
        
        return build('gmail', 'v1', credentials=creds)
    
    except ImportError as e:
        print(f"❌ Modulo mancante: {e}")
        print("📦 Installa con: pip install google-auth google-auth-oauthlib google-auth-httplib2 google-api-python-client")
        return None

def search_rocketbook_emails(service, max_results=7):
    """Cerca email da Rocketbook con allegati PDF."""
    if not service:
        return []
    
    print(f"🔍 Ricerca email da Rocketbook (max {max_results})...")
    
    # Query: email da Rocketbook con allegati PDF
    query = f"from:{ROCKETBOOK_SENDER} has:attachment filename:pdf"
    
    results = service.users().messages().list(
        userId='me', 
        q=query, 
        maxResults=max_results
    ).execute()
    
    messages = results.get('messages', [])
    print(f"📧 Trovate {len(messages)} email")
    
    return messages

def parse_email(service, msg_id):
    """Estrai informazioni da un'email."""
    try:
        msg = service.users().messages().get(
            userId='me', 
            id=msg_id, 
            format='full'
        ).execute()
        
        headers = msg['payload']['headers']
        header_dict = {h['name']: h['value'] for h in headers}
        
        subject = header_dict.get('Subject', 'Rocketbook Scan')
        date_str = header_dict.get('Date', '')
        
        # Parse data
        date = parse_email_date(date_str)
        
        # Cerca allegati PDF
        attachments = []
        parts = msg['payload'].get('parts', [])
        
        for part in parts:
            filename = part.get('filename', '')
            if filename.endswith('.pdf'):
                attachment_id = part['body'].get('attachmentId')
                size = part['body'].get('size', 0)
                if attachment_id:
                    attachments.append({
                        'id': attachment_id,
                        'filename': filename,
                        'size': size,
                        'message_id': msg_id
                    })
        
        return {
            'message_id': msg_id,
            'title': clean_subject(subject),
            'date': date.strftime('%d %b %Y'),
            'date_iso': date.strftime('%Y-%m-%d'),
            'attachments': attachments,
            'subject': subject
        }
    
    except Exception as e:
        print(f"⚠️ Errore parsing email {msg_id}: {e}")
        return None

def parse_email_date(date_str):
    """Parse data da header email."""
    # Pattern comuni: "Wed, 15 Feb 2026 14:30:00 +0000"
    months = {
        'jan': 1, 'feb': 2, 'mar': 3, 'apr': 4, 'may': 5, 'jun': 6,
        'jul': 7, 'aug': 8, 'sep': 9, 'oct': 10, 'nov': 11, 'dec': 12,
        'gen': 1, 'mag': 5, 'giu': 6, 'lug': 7, 'ago': 8, 'set': 9, 
        'ott': 10, 'dic': 12
    }
    
    # Estrai giorno, mese, anno
    pattern = r'(\d{1,2})\s+(\w{3})\s+(\d{4})'
    match = re.search(pattern, date_str, re.IGNORECASE)
    
    if match:
        try:
            day, month_str, year = match.groups()
            month = months.get(month_str.lower(), 1)
            return datetime(int(year), month, int(day))
        except:
            pass
    
    return datetime.now()

def clean_subject(subject):
    """Pulisci subject email per usarlo come titolo."""
    # Rimuovi prefissi
    subject = re.sub(r'^(Fwd:|Re:|FW:|RE:)\s*', '', subject, flags=re.IGNORECASE)
    # Rimuovi riferimenti a Rocketbook
    subject = re.sub(r'\s*-\s*Rocketbook\s*$', '', subject, flags=re.IGNORECASE)
    subject = re.sub(r'^Rocketbook\s*-\s*', '', subject, flags=re.IGNORECASE)
    return subject.strip() or 'Rocketbook Scan'

def download_attachment(service, message_id, attachment_id, filename):
    """Scarica allegato da Gmail e restituisci path locale."""
    try:
        attachment = service.users().messages().attachments().get(
            userId='me', 
            messageId=message_id, 
            id=attachment_id
        ).execute()
        
        data = base64.urlsafe_b64decode(attachment['data'])
        
        # Salva in directory temporanea
        temp_dir = Path(tempfile.gettempdir()) / "rocketbook_pdfs"
        temp_dir.mkdir(exist_ok=True)
        
        # Sanitizza filename
        safe_filename = re.sub(r'[^\w\-\.]', '_', filename)
        filepath = temp_dir / safe_filename
        
        with open(filepath, 'wb') as f:
            f.write(data)
        
        print(f"📥 Scaricato: {filename} ({len(data)} bytes)")
        return str(filepath)
    
    except Exception as e:
        print(f"⚠️ Errore download {filename}: {e}")
        return None

def upload_to_drive_via_zapier(filepath, filename, folder_name="Rocketbook Scans"):
    """
    Upload file su Google Drive usando Zapier MCP.
    Restituisce il link condivisibile del file.
    """
    print(f"📤 Upload su Google Drive: {filename}")
    
    # Per implementare l'upload via Zapier MCP, utilizziamo un approccio
    # che simula l'interazione con Zapier. In produzione, questo richiederebbe:
    # 1. Una Zapier webhook URL configurata
    # 2. OPPURE l'uso di Google Drive API direttamente
    
    # Per ora, implementiamo usando Google Drive API direttamente
    # che è più affidabile per questo use case
    
    try:
        from google.auth.transport.requests import Request
        from google.oauth2.credentials import Credentials
        from google_auth_oauthlib.flow import InstalledAppFlow
        from googleapiclient.discovery import build
        from googleapiclient.http import MediaFileUpload
        
        SCOPES = ['https://www.googleapis.com/auth/drive']
        creds = None
        
        token_file = DASHBOARD_DIR / "drive_token.json"
        credentials_file = DASHBOARD_DIR / "credentials.json"
        
        # Carica token esistente
        if token_file.exists():
            creds = Credentials.from_authorized_user_file(str(token_file), SCOPES)
        
        # Se non ci sono credenziali valide
        if not creds or not creds.valid:
            if creds and creds.expired and creds.refresh_token:
                creds.refresh(Request())
            elif credentials_file.exists():
                flow = InstalledAppFlow.from_client_secrets_file(str(credentials_file), SCOPES)
                creds = flow.run_local_server(port=0)
            else:
                print("❌ File credentials.json non trovato per Drive API")
                return None
            
            # Salva token
            with open(token_file, 'w') as token:
                token.write(creds.to_json())
        
        service = build('drive', 'v3', credentials=creds)
        
        # Cerca o crea la cartella
        folder_id = get_or_create_folder(service, folder_name)
        if not folder_id:
            print(f"❌ Impossibile trovare/creare cartella: {folder_name}")
            return None
        
        # Verifica se il file esiste già
        existing_file = find_file_in_folder(service, filename, folder_id)
        if existing_file:
            print(f"ℹ️ File già esistente: {filename}")
            file_id = existing_file['id']
        else:
            # Upload del file
            file_metadata = {
                'name': filename,
                'parents': [folder_id]
            }
            
            media = MediaFileUpload(
                filepath,
                mimetype='application/pdf',
                resumable=True
            )
            
            file = service.files().create(
                body=file_metadata,
                media_body=media,
                fields='id, name, webViewLink'
            ).execute()
            
            file_id = file.get('id')
            print(f"✅ Upload completato: {file.get('name')} (ID: {file_id})")
        
        # Rendi il file condivisibile
        make_file_shareable(service, file_id)
        
        # Ottieni il link condivisibile
        file_info = service.files().get(
            fileId=file_id, 
            fields='webViewLink, webContentLink'
        ).execute()
        
        share_link = file_info.get('webViewLink')
        print(f"🔗 Link condivisibile: {share_link}")
        
        return share_link
    
    except Exception as e:
        print(f"❌ Errore upload Drive: {e}")
        import traceback
        traceback.print_exc()
        return None

def get_or_create_folder(service, folder_name):
    """Cerca o crea una cartella su Google Drive."""
    try:
        # Cerca la cartella
        query = f"mimeType='application/vnd.google-apps.folder' and name='{folder_name}' and trashed=false"
        results = service.files().list(q=query, spaces='drive', fields='files(id, name)').execute()
        items = results.get('files', [])
        
        if items:
            return items[0]['id']
        
        # Crea la cartella
        file_metadata = {
            'name': folder_name,
            'mimeType': 'application/vnd.google-apps.folder'
        }
        
        folder = service.files().create(body=file_metadata, fields='id').execute()
        print(f"📁 Creata cartella: {folder_name}")
        return folder.get('id')
    
    except Exception as e:
        print(f"❌ Errore gestione cartella: {e}")
        return None

def find_file_in_folder(service, filename, folder_id):
    """Cerca un file nella cartella specificata."""
    try:
        query = f"name='{filename}' and '{folder_id}' in parents and trashed=false"
        results = service.files().list(q=query, spaces='drive', fields='files(id, name)').execute()
        items = results.get('files', [])
        
        return items[0] if items else None
    except Exception as e:
        print(f"⚠️ Errore ricerca file: {e}")
        return None

def make_file_shareable(service, file_id):
    """Rendi un file condivisibile con chiunque abbia il link."""
    try:
        permission = {
            'type': 'anyone',
            'role': 'reader'
        }
        
        service.permissions().create(
            fileId=file_id,
            body=permission
        ).execute()
        
        print(f"🔓 File reso condivisibile")
        return True
    except Exception as e:
        print(f"⚠️ Errore condivisione file: {e}")
        return False

def update_rocketbook_notes(uploaded_files):
    """Aggiorna il file rocketbook_notes.json con i link reali."""
    print(f"\n📝 Aggiornamento {ROCKETBOOK_NOTES_FILE}...")
    
    notes = []
    for file_info in uploaded_files:
        note = {
            "title": file_info['title'],
            "date": file_info['date'],
            "pdfUrl": file_info['drive_url'],
            "tags": ["Rocketbook", "Scan", "PDF"],
            "preview": f"Scansione Rocketbook con allegato {file_info['filename']} ({file_info.get('size', 'N/A')} bytes)"
        }
        notes.append(note)
    
    # Salva il file JSON
    with open(ROCKETBOOK_NOTES_FILE, 'w', encoding='utf-8') as f:
        json.dump(notes, f, indent=2, ensure_ascii=False)
    
    print(f"✅ File aggiornato: {len(notes)} note")
    return notes

def main():
    """Funzione principale."""
    print("🚀 Rocketbook → Google Drive Upload")
    print("=" * 60)
    
    # Verifica directory
    DASHBOARD_DIR.mkdir(parents=True, exist_ok=True)
    
    # Ottieni servizio Gmail
    service = get_gmail_service()
    
    if not service:
        print("❌ Impossibile connettersi a Gmail API")
        print("💡 Verifica che credentials.json esista in:", DASHBOARD_DIR)
        return
    
    # Cerca email
    messages = search_rocketbook_emails(service, max_results=7)
    
    if not messages:
        print("⚠️ Nessuna email trovata")
        return
    
    # Processa ogni email
    uploaded_files = []
    
    for msg in messages:
        email_data = parse_email(service, msg['id'])
        
        if not email_data or not email_data['attachments']:
            continue
        
        print(f"\n📧 {email_data['title']} ({email_data['date']})")
        
        # Scarica e carica ogni allegato
        for att in email_data['attachments']:
            filepath = download_attachment(
                service, 
                att['message_id'], 
                att['id'], 
                att['filename']
            )
            
            if filepath:
                # Upload su Google Drive
                drive_url = upload_to_drive_via_zapier(filepath, att['filename'])
                
                if drive_url:
                    uploaded_files.append({
                        'title': email_data['title'],
                        'date': email_data['date'],
                        'filename': att['filename'],
                        'size': att.get('size', 'N/A'),
                        'drive_url': drive_url
                    })
                
                # Pulisci file temporaneo
                try:
                    os.remove(filepath)
                except:
                    pass
    
    # Aggiorna il file JSON
    if uploaded_files:
        update_rocketbook_notes(uploaded_files)
        
        print("\n" + "=" * 60)
        print("📋 RIEPILOGO FILE CARICATI:")
        print("=" * 60)
        for i, file_info in enumerate(uploaded_files, 1):
            print(f"\n{i}. {file_info['title']}")
            print(f"   Data: {file_info['date']}")
            print(f"   File: {file_info['filename']}")
            print(f"   Link: {file_info['drive_url']}")
    else:
        print("\n⚠️ Nessun file caricato")
    
    print("\n" + "=" * 60)
    print("✅ Completato!")

if __name__ == '__main__':
    main()
