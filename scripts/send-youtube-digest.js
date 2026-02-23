const { sendYouTubeDigestEmail } = require('./email-sender');
const fs = require('fs');

/**
 * Script per inviare l'email del YouTube AI Digest
 * Usage: node scripts/send-youtube-digest.js [path-to-markdown-file] [email]
 */

async function main() {
  const digestPath = process.argv[2] || '/tmp/daily-brief-ghpages/reports/youtube/youtube-ai-digest-2026-02-18.md';
  
  if (!fs.existsSync(digestPath)) {
    console.error(`❌ File non trovato: ${digestPath}`);
    process.exit(1);
  }

  const markdownContent = fs.readFileSync(digestPath, 'utf-8');
  const dateMatch = markdownContent.match(/\*Generated on: (.+?)\*/);
  const date = dateMatch ? dateMatch[1].split('—')[0].trim() : new Date().toLocaleDateString('it-IT');

  // Parse video data from markdown
  const videos = [];
  const videoBlocks = markdownContent.split(/### \d+\./).slice(1);
  
  for (const block of videoBlocks) {
    const titleMatch = block.match(/\*\*"(.+?)"\*\*/);
    const channelMatch = block.match(/\*\*([^*]+)\*\*\s*\(@([^)]+)\)/);
    const linkMatch = block.match(/🔗 Link:\s*(.+?)(?:\n|$)/);
    const dateMatch = block.match(/📅 Pubblicato:\s*(.+?)(?:\n|$)/);
    const durationMatch = block.match(/⏱️ Durata:\s*(.+?)(?:\n|$)/);
    const viewsMatch = block.match(/👁️ Views:\s*(.+?)(?:\n|$)/);
    
    if (titleMatch && channelMatch) {
      const takeaways = [];
      const actionableInsights = [];
      
      // Extract takeaways
      const takeawaysMatch = block.match(/📝 \*\*Key Takeaways:\*\*\s*([\s\S]*?)(?=✅|$)/);
      if (takeawaysMatch) {
        const lines = takeawaysMatch[1].split('\n').filter(l => l.trim().startsWith('-'));
        takeaways.push(...lines.map(l => l.replace(/^\s*-\s*/, '').trim()));
      }
      
      // Extract actionable insights
      const insightsMatch = block.match(/✅ \*\*3 Actionable Insights:\*\*\s*([\s\S]*?)(?=---|$)/);
      if (insightsMatch) {
        const lines = insightsMatch[1].split('\n').filter(l => l.trim().match(/^\d+\./));
        actionableInsights.push(...lines.map(l => l.replace(/^\s*\d+\.\s*/, '').trim()));
      }
      
      videos.push({
        channel: channelMatch[1].trim(),
        handle: channelMatch[2].trim(),
        title: titleMatch[1].trim(),
        link: linkMatch ? linkMatch[1].trim() : '#',
        publishedDate: dateMatch ? dateMatch[1].trim() : 'Recente',
        duration: durationMatch ? durationMatch[1].trim() : undefined,
        views: viewsMatch ? viewsMatch[1].trim() : undefined,
        takeaways: takeaways.length > 0 ? takeaways : ['Contenuto AI rilevante'],
        actionableInsights: actionableInsights.length > 0 ? actionableInsights : ['Guarda il video per dettagli'],
      });
    }
  }

  // Extract themes
  const themesMatch = markdownContent.match(/## 🎯 Temi Ricorrenti Oggi\s*([\s\S]*?)(?=##|$)/);
  const themes = themesMatch 
    ? themesMatch[1].split('\n').filter(l => l.trim().match(/^\d+\./)).map(l => l.replace(/^\s*\d+\.\s*/, '').trim())
    : ['AI Development', 'Business Models', 'Automation'];

  // Extract watchlist
  const watchlist = [];
  const watchlistMatch = markdownContent.match(/## 📋 Watchlist Prioritaria\s*([\s\S]*?)(?=##|$)/);
  if (watchlistMatch) {
    const items = watchlistMatch[1].match(/\d+\.\s*\*\*"(.+?)"\*\*\s*-\s*([^\(]+)\s*\(([^)]+)\)/g);
    if (items) {
      for (const item of items) {
        const match = item.match(/\d+\.\s*\*\*"(.+?)"\*\*\s*-\s*([^\(]+)\s*\(([^)]+)\)/);
        if (match) {
          watchlist.push({
            title: match[1].trim(),
            creator: match[2].trim(),
            reason: match[3].trim(),
            link: '#',
          });
        }
      }
    }
  }

  const digestData = {
    date,
    videos: videos.length > 0 ? videos : [{
      channel: 'The AI Advantage',
      handle: 'aiadvantage',
      title: 'Claude Opus 4.6 First Impressions',
      link: 'https://www.youtube.com/watch?v=qYhL95iRkOY',
      publishedDate: 'February 6, 2026',
      takeaways: ['Analisi approfondita di Claude Opus 4.6', 'Confronto con versioni precedenti', 'Aggiornamenti sulle novità AI'],
      actionableInsights: ['Valuta Claude Opus 4.6 per i tuoi workflow', 'Esplora le funzionalità di reasoning', 'Considera l\'upgrade per progetti complessi'],
    }],
    themes: themes.length > 0 ? themes : ['AI Development', 'Business Models', 'Automation'],
    watchlistPriority: watchlist.length > 0 ? watchlist : [
      { title: 'Claude Code is crazy good in 2026', creator: 'David Ondrej', reason: 'per skill tecniche', link: 'https://www.youtube.com/watch?v=smMC1W-Mjt4' },
      { title: 'If I Had to Make $1M From $0', creator: 'Sabrina Ramonov', reason: 'per strategia business', link: 'https://www.youtube.com/watch?v=WvsWbgE_kWg' },
      { title: 'Everyone Will Be Training AI Agents', creator: 'Corbin Brown', reason: 'per trend futuri', link: 'https://www.youtube.com/watch?v=OyFumlnZUmk' },
    ],
  };

  const email = process.argv[3] || 'anselmo.acquah54@gmail.com';
  
  console.log(`📧 Invio YouTube AI Digest a ${email}...`);
  console.log(`📊 Video trovati: ${digestData.videos.length}`);
  
  const success = await sendYouTubeDigestEmail(email, digestData);
  
  if (success) {
    console.log('✅ Email inviata con successo!');
  } else {
    console.error('❌ Errore nell\'invio dell\'email');
    process.exit(1);
  }
}

main().catch(console.error);
