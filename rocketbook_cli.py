#!/usr/bin/env python3
"""
Rocketbook-Gmail Integration via Gmail API
Versione semplificata che usa OAuth2 o Service Account
"""

import os
import json
import pickle
from datetime import datetime
from pathlib import Path

# Configurazione
DASHBOARD_DIR = Path("/tmp/daily-brief-ghpages")
INDEX_FILE = DASHBOARD_DIR / "index.html"
DATA_FILE = DASHBOARD_DIR / "rocketbook_data.json"
CREDENTIALS_FILE = DASHBOARD_DIR / "gmail_credentials.json"
TOKEN_FILE = DASHBOARD_DIR / "gmail_token.pickle"

def load_rocketbook_data():
    """Carica dati Rocketbook salvati o crea struttura vuota."""
    if DATA_FILE.exists():
        with open(DATA_FILE, 'r') as f:
            return json.load(f)
    return []

def save_rocketbook_data(notes):
    """Salva dati Rocketbook."""
    with open(DATA_FILE, 'w') as f:
        json.dump(notes, f, indent=2)

def update_dashboard_html(notes):
    """Aggiorna il file HTML della dashboard."""
    if not INDEX_FILE.exists():
        print(f"❌ File {INDEX_FILE} non trovato")
        return False
    
    with open(INDEX_FILE, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Genera HTML note
    if notes:
        html = generate_notes_grid(notes)
    else:
        html = generate_empty_state()
    
    # Sostituisci sezione rocketbook-container
    import re
    
    # Pattern per trovare il contenuto del div rocketbook-container
    pattern = r'(<div id="rocketbook-container">)(.*?)(</div>\s*</div>\s*</div>\s*<footer>)'
    
    # Nuovo contenuto - nota: manteniamo il div di chiusura corretto
    new_section = f'''\1
{html}
\3'''
    
    content = re.sub(pattern, new_section, content, flags=re.DOTALL)
    
    # Aggiorna contatore
    content = re.sub(
        r'(<div class="kpi-value" id="rocketbook-count">)\d+(</div>)',
        r'\g<1>' + str(len(notes)) + r'\g<2>',
        content
    )

    # Aggiorna timestamp
    now = datetime.now().strftime("%d/%m/%Y %H:%M")
    content = re.sub(
        r'(<span id="last-updated">).*?(</span>)',
        r'\g<1>' + now + r'\g<2>',
        content
    )
    
    with open(INDEX_FILE, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print(f"✅ Dashboard aggiornata con {len(notes)} note")
    return True

def generate_notes_grid(notes):
    """Genera griglia HTML per le note."""
    items = []
    for note in notes[:6]:  # Max 6 note
        url = note.get('url', '#')
        title = note.get('title', 'Nota senza titolo')
        date = note.get('date', 'Data sconosciuta')
        
        items.append(f'''            <a href="{url}" target="_blank" class="rocketbook-item">
                <div class="rocketbook-thumb">📝</div>
                <div class="rocketbook-info">
                    <div class="rocketbook-title">{title}</div>
                    <div class="rocketbook-date">{date}</div>
                </div>
            </a>''')
    
    return f'''            <div class="rocketbook-grid">
{'\n'.join(items)}
            </div>'''

def generate_empty_state():
    """Genera stato vuoto."""
    return '''            <div class="rocketbook-empty">
                <div class="rocketbook-empty-icon">📭</div>
                <div>Nessuna scansione recente</div>
                <div style="font-size: 0.8rem; margin-top: 8px;">Le note da Anselmo Acquah via Rocketbook appariranno qui</div>
            </div>'''

def add_note(title, date=None, url=None):
    """Aggiungi una nota manualmente."""
    notes = load_rocketbook_data()
    
    if date is None:
        date = datetime.now().strftime("%d %b %Y")
    
    note = {
        "title": title,
        "date": date,
        "url": url or "#",
        "added": datetime.now().isoformat()
    }
    
    # Evita duplicati
    for existing in notes:
        if existing["title"] == title and existing["date"] == date:
            print(f"⚠️ Nota '{title}' già esistente")
            return
    
    notes.insert(0, note)  # Aggiungi in cima
    notes = notes[:10]  # Mantieni solo ultime 10
    
    save_rocketbook_data(notes)
    update_dashboard_html(notes)
    print(f"✅ Aggiunta nota: {title}")

def sync_from_gmail():
    """Sincronizza da Gmail (placeholder per futura implementazione API)."""
    print("🔄 Sincronizzazione da Gmail...")
    print("⚠️ Richiede configurazione OAuth2 Gmail API")
    print("📧 Cercare email da: notes@email.getrocketbook.com")
    
    # Placeholder: in produzione, implementare chiamata API Gmail
    # Per ora usa i dati esistenti
    notes = load_rocketbook_data()
    update_dashboard_html(notes)
    return notes

def push_to_github():
    """Pusha modifiche su GitHub."""
    import subprocess
    
    os.chdir(DASHBOARD_DIR)
    
    # Configura git
    subprocess.run(["git", "config", "user.email", "bot@dailybrief.local"], 
                   capture_output=True, check=False)
    subprocess.run(["git", "config", "user.name", "Daily Brief Bot"], 
                   capture_output=True, check=False)
    
    # Stage
    result = subprocess.run(["git", "add", "-A"], capture_output=True, text=True)
    
    # Commit
    result = subprocess.run(
        ["git", "commit", "-m", f"🔄 Aggiornamento Rocketbook - {datetime.now().strftime('%Y-%m-%d %H:%M')}"],
        capture_output=True, text=True
    )
    
    if result.returncode != 0 and "nothing to commit" not in result.stderr.lower():
        print(f"⚠️ Commit: {result.stderr}")
        return False
    
    # Push con token da variabile d'ambiente
    env = os.environ.copy()
    env["GIT_ASKPASS"] = "echo"
    env["GIT_USERNAME"] = "x-access-token"
    env["GIT_PASSWORD"] = os.environ.get("GITHUB_TOKEN", "")
    
    if not env["GIT_PASSWORD"]:
        print("❌ GITHUB_TOKEN non impostato")
        return False
    
    result = subprocess.run(
        ["git", "push", "origin", "main"],
        capture_output=True, text=True, env=env
    )
    
    if result.returncode == 0:
        print("✅ Push su GitHub completato")
        return True
    else:
        print(f"❌ Push fallito: {result.stderr}")
        return False

def main():
    """Funzione principale."""
    import sys
    
    print("🚀 Rocketbook Sync Tool")
    print("=" * 50)
    
    if len(sys.argv) > 1:
        cmd = sys.argv[1]
        
        if cmd == "add" and len(sys.argv) >= 3:
            # Aggiungi nota: python rocketbook_cli.py add "Titolo Nota" ["data"] [url]
            title = sys.argv[2]
            date = sys.argv[3] if len(sys.argv) > 3 else None
            url = sys.argv[4] if len(sys.argv) > 4 else None
            add_note(title, date, url)
            push_to_github()
            
        elif cmd == "sync":
            # Sincronizza da Gmail
            sync_from_gmail()
            push_to_github()
            
        elif cmd == "push":
            # Solo push
            push_to_github()
            
        elif cmd == "list":
            # Lista note
            notes = load_rocketbook_data()
            print(f"\n📓 Note Rocketbook ({len(notes)}):")
            for i, note in enumerate(notes, 1):
                print(f"  {i}. {note['title']} ({note['date']})")
        else:
            print("Comandi disponibili:")
            print("  add 'Titolo' [data] [url]  - Aggiungi nota")
            print("  sync                       - Sincronizza da Gmail")
            print("  push                       - Push su GitHub")
            print("  list                       - Lista note")
    else:
        # Default: sync + push
        sync_from_gmail()
        push_to_github()
    
    print("=" * 50)

if __name__ == "__main__":
    main()
