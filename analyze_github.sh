#!/bin/bash
# GitHub Repo Analyzer - Analisi giornaliera repository
# Esegue scan dei repo GitHub e genera report task prioritari

cd /tmp/daily-brief-ghpages

# Configurazione
GITHUB_TOKEN="${GITHUB_TOKEN:-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}"
GITHUB_USER="slemo54"
REPORT_FILE="github_analysis_$(date +%Y-%m-%d).md"
EMAIL_TO="${EMAIL_TO:-anselmo.acquah54@gmail.com}"

# Colori per output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🔍 GitHub Repo Analyzer - $(date)${NC}"
echo "================================"

# Ottieni lista repo
echo -e "\n${YELLOW}📁 Recupero repository...${NC}"
REPOS=$(curl -s -H "Authorization: Bearer $GITHUB_TOKEN" \
  "https://api.github.com/user/repos?sort=updated&direction=desc&per_page=20" | \
  jq -r '.[] | select(.owner.login == "'$GITHUB_USER'") | "\(.name)|\(.html_url)|\(.updated_at)|\(.open_issues_count)|\(.description)"')

# Inizializza report
cat > "$REPORT_FILE" << EOF
# 📊 GitHub Daily Analysis - $(date +"%d %B %Y")

Generato da Kimi Claw per Anselmo Acquah

## 📈 Riepilogo

EOF

TOTAL_REPOS=$(echo "$REPOS" | wc -l)
TOTAL_ISSUES=0
TODO_COUNT=0

echo -e "\n${GREEN}✓ Trovati $TOTAL_REPOS repository${NC}"

# Analisi per ogni repo
echo -e "\n${YELLOW}🔎 Analisi repository...${NC}"

while IFS='|' read -r REPO_NAME REPO_URL UPDATED_AT ISSUES_COUNT DESCRIPTION; do
    [ -z "$REPO_NAME" ] && continue
    
    echo -e "  ${BLUE}→ $REPO_NAME${NC}"
    
    # Aggiorna contatori
    TOTAL_ISSUES=$((TOTAL_ISSUES + ISSUES_COUNT))
    
    # Cerca TODO nel codice (se repo è clonato localmente)
    TODO_IN_REPO=0
    if [ -d "/tmp/repos/$REPO_NAME" ]; then
        TODO_IN_REPO=$(grep -r "TODO\|FIXME\|XXX" /tmp/repos/$REPO_NAME --include="*.js" --include="*.ts" --include="*.py" --include="*.md" 2>/dev/null | wc -l)
    fi
    TODO_COUNT=$((TODO_COUNT + TODO_IN_REPO))
    
done <<< "$REPOS"

# Aggiungi riepilogo al report
cat >> "$REPORT_FILE" << EOF
- **Repository totali:** $TOTAL_REPOS
- **Issue aperti:** $TOTAL_ISSUES
- **TODO trovati:** $TODO_COUNT

---

## 🚨 Task Prioritari

EOF

# Identifica repo con issue
echo -e "\n${YELLOW}📝 Generazione task prioritari...${NC}"

PRIORITY_COUNT=0
while IFS='|' read -r REPO_NAME REPO_URL UPDATED_AT ISSUES_COUNT DESCRIPTION; do
    [ -z "$REPO_NAME" ] && continue
    
    # Salta repo senza issue o aggiornati oggi
    [ "$ISSUES_COUNT" -eq 0 ] 2>/dev/null && continue
    
    # Formatta data
    UPDATED_DATE=$(echo "$UPDATED_AT" | cut -d'T' -f1)
    DAYS_AGO=$(( ($(date +%s) - $(date -d "$UPDATED_DATE" +%s 2>/dev/null || echo $(date +%s))) / 86400 ))
    
    # Aggiungi a report se ha issue o non aggiornato da 7+ giorni
    if [ "$ISSUES_COUNT" -gt 0 ] 2>/dev/null || [ "$DAYS_AGO" -gt 7 ] 2>/dev/null; then
        PRIORITY_COUNT=$((PRIORITY_COUNT + 1))
        
        cat >> "$REPORT_FILE" << EOF
### $PRIORITY_COUNT. [$REPO_NAME]($REPO_URL)

**Descrizione:** ${DESCRIPTION:-N/A}  
**Issue aperti:** $ISSUES_COUNT  
**Ultimo aggiornamento:** $UPDATED_DATE ($DAYS_AGO giorni fa)

**Azioni suggerite:**
EOF
        
        if [ "$ISSUES_COUNT" -gt 0 ] 2>/dev/null; then
            echo "- [ ] Controllare e risolvere $ISSUES_COUNT issue aperti" >> "$REPORT_FILE"
        fi
        
        if [ "$DAYS_AGO" -gt 7 ] 2>/dev/null; then
            echo "- [ ] Aggiornare documentazione/dependencies" >> "$REPORT_FILE"
        fi
        
        echo "" >> "$REPORT_FILE"
    fi
    
done <<< "$REPOS"

# Sezione repo recenti
cat >> "$REPORT_FILE" << EOF

---

## 🔄 Repository Aggiornati di Recente

EOF

echo "$REPOS" | head -5 | while IFS='|' read -r REPO_NAME REPO_URL UPDATED_AT ISSUES_COUNT DESCRIPTION; do
    [ -z "$REPO_NAME" ] && continue
    UPDATED_DATE=$(echo "$UPDATED_AT" | cut -d'T' -f1)
    echo "- **[$REPO_NAME]($REPO_URL)** - $UPDATED_DATE" >> "$REPORT_FILE"
done

# Footer
cat >> "$REPORT_FILE" << EOF

---

*Report generato automaticamente da Kimi Claw*  
*Per domande o configurazioni: rispondi a questa email*
EOF

echo -e "\n${GREEN}✓ Report generato: $REPORT_FILE${NC}"
echo -e "${GREEN}✓ Task prioritari identificati: $PRIORITY_COUNT${NC}"

# Invia email via Zapier MCP (simulato)
echo -e "\n${YELLOW}📧 Invio email...${NC}"

# Converti report in formato email
EMAIL_SUBJECT="📊 GitHub Daily Analysis - $(date +"%d %B %Y")"
EMAIL_BODY=$(cat "$REPORT_FILE")

echo "To: $EMAIL_TO"
echo "Subject: $EMAIL_SUBJECT"
echo ""
echo "Report pronto per l'invio!"

# Salva report nella cronologia
mkdir -p reports
cp "$REPORT_FILE" "reports/"

echo -e "\n${GREEN}🎉 Analisi completata!${NC}"
