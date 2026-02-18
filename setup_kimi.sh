#!/bin/bash
# Setup Kimi Code CLI per Anselmo
# Questo script configura Kimi Code con GitHub e MCP

echo "🚀 Setup Kimi Code CLI"
echo ""

# Verifica se kimi è già installato
if command -v kimi &> /dev/null; then
    echo "✅ Kimi Code già installato"
    kimi --version
else
    echo "📦 Installazione Kimi Code..."
    
    # Metodo 1: Prova con pipx
    if command -v pipx &> /dev/null; then
        pipx install kimi-cli
    else
        # Metodo 2: Installa pipx prima
        apt update && apt install -y pipx
        pipx ensurepath
        pipx install kimi-cli
    fi
    
    # Verifica installazione
    if command -v kimi &> /dev/null; then
        echo "✅ Kimi Code installato con successo!"
    else
        echo "❌ Installazione fallita. Prova manualmente:"
        echo "   pipx install kimi-cli"
        exit 1
    fi
fi

echo ""
echo "🔧 Configurazione Kimi Code..."

# Crea directory config
mkdir -p ~/.config/kimi

# Configurazione MCP
cat > ~/.config/kimi/mcp.json << 'EOF'
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "${GITHUB_TOKEN}"
      }
    },
    "zapier": {
      "command": "npx",
      "args": ["-y", "@zapier/mcp"],
      "env": {
        "ZAPIER_MCP_TOKEN": "${ZAPIER_MCP_TOKEN}"
      }
    }
  }
}
EOF

echo "✅ Configurazione MCP creata"
echo ""
echo "📋 Prossimi passi:"
echo "1. Esegui: kimi"
echo "2. Invia: /login per autenticarti"
echo "3. Configura GitHub token: export GITHUB_TOKEN=ghp_..."
echo "4. Configura Zapier token: export ZAPIER_MCP_TOKEN=..."
echo ""
echo "🎯 Per usare Kimi con i tuoi progetti:"
echo "   cd /tuo/progetto && kimi"
echo "   Poi descrivi cosa vuoi fare!"
