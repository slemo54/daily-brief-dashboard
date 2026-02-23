import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

// Configurazione Gmail
const GMAIL_ADDRESS = process.env.GMAIL_ADDRESS || 'anselmo.acquah54@gmail.com';
const GMAIL_APP_PASSWORD = process.env.GMAIL_APP_PASSWORD || '';

// Pattern per categorizzazione
const PATTERNS = {
  vinitaly: /vinitaly|veronafiere|wine.*fair|expo.*vino|stand.*vinitaly|biglietto.*vinitaly/i,
  rocketbook: /rocketbook|smart.*notebook|cloud.*notebook|scan.*rocketbook/i,
  invoices: /fattura|invoice|payment|pagamento|ricevuta|receipt|bolletta|bill|fattura.*elettronica|sdI/i,
  clients: /cliente|client|ordine|order|preventivo|quote|progetto|project|commessa|lavorazione/i,
  newsletters: /newsletter|unsubscribe|promo|offerta|marketing|noreply|no-reply|mailing.*list/i,
  urgent: /urgente|urgent|asap|immediately|immediatamente|importante|important|scadenza|deadline|oggi|today|entro.*domani/i
};

interface EmailData {
  id: string;
  subject: string;
  from: string;
  date: string;
  body?: string;
}

interface CategorizedEmail extends EmailData {
  categories: string[];
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  snippet?: string;
  suggestedDraft?: {
    subject: string;
    body: string;
  };
}

interface EmailReport {
  timestamp: string;
  generatedAt: string;
  account: string;
  summary: {
    total: number;
    categories: Record<string, number>;
    urgent: CategorizedEmail[];
    drafts: Array<{
      id: string;
      subject: string;
      category: string;
      draft: { subject: string; body: string };
    }>;
    byPriority: {
      HIGH: CategorizedEmail[];
      MEDIUM: CategorizedEmail[];
      LOW: CategorizedEmail[];
    };
  };
  details: CategorizedEmail[];
  actions: {
    toReply: CategorizedEmail[];
    toArchive: CategorizedEmail[];
    toReview: CategorizedEmail[];
  };
}

function categorizeEmail(subject: string, from: string, body: string = ''): string[] {
  const text = `${subject} ${from} ${body}`.toLowerCase();
  const categories: string[] = [];
  
  if (PATTERNS.vinitaly.test(text)) categories.push('VINITALY');
  if (PATTERNS.rocketbook.test(text)) categories.push('ROCKETBOOK');
  if (PATTERNS.invoices.test(text)) categories.push('INVOICES');
  if (PATTERNS.clients.test(text)) categories.push('CLIENTS');
  if (PATTERNS.newsletters.test(text)) categories.push('NEWSLETTER');
  if (PATTERNS.urgent.test(text)) categories.push('URGENT');
  
  return categories;
}

function calculatePriority(email: EmailData): 'HIGH' | 'MEDIUM' | 'LOW' {
  const text = `${email.subject} ${email.from} ${email.body || ''}`.toLowerCase();
  
  const priorityKeywords = {
    high: ['urgente', 'scadenza', 'fattura', 'pagamento', 'cliente', 'ordine', 'preventivo'],
    medium: ['vinitaly', 'rocketbook', 'progetto', 'appuntamento'],
    low: ['newsletter', 'promo', 'marketing']
  };
  
  let score = 0;
  
  priorityKeywords.high.forEach(kw => {
    if (text.includes(kw)) score += 3;
  });
  
  priorityKeywords.medium.forEach(kw => {
    if (text.includes(kw)) score += 2;
  });
  
  priorityKeywords.low.forEach(kw => {
    if (text.includes(kw)) score -= 1;
  });
  
  if (score >= 3) return 'HIGH';
  if (score >= 1) return 'MEDIUM';
  return 'LOW';
}

function generateDraft(subject: string, category: string): { subject: string; body: string } {
  const templates: Record<string, { subject: string; body: string }> = {
    VINITALY: {
      subject: `Re: ${subject}`,
      body: `Gentile Team Vinitaly,\n\nGrazie per la vostra comunicazione riguardante l'evento.\n\nResto a disposizione per ulteriori informazioni.\n\nCordiali saluti,\nAnselmo Acquah`
    },
    CLIENTS: {
      subject: `Re: ${subject}`,
      body: `Gentile Cliente,\n\nGrazie per averci contattato. Ho preso nota della sua richiesta e le risponderò nel dettaglio al più presto.\n\nResto a disposizione per qualsiasi chiarimento.\n\nCordiali saluti,\nAnselmo Acquah`
    },
    INVOICES: {
      subject: `Re: ${subject}`,
      body: `Gentile Ufficio Amministrazione,\n\nGrazie per l'invio della documentazione. Procederò con la verifica e le eventuali azioni necessarie.\n\nCordiali saluti,\nAnselmo Acquah`
    },
    ROCKETBOOK: {
      subject: `Re: ${subject}`,
      body: `Gentile Supporto Rocketbook,\n\nGrazie per il vostro messaggio.\n\nCordiali saluti,\nAnselmo Acquah`
    },
    DEFAULT: {
      subject: `Re: ${subject}`,
      body: `Gentile Mittente,\n\nGrazie per la vostra email.\n\nCordiali saluti,\nAnselmo Acquah`
    }
  };
  
  return templates[category] || templates.DEFAULT;
}

function generateReport(emails: EmailData[]): EmailReport {
  const report: EmailReport = {
    timestamp: new Date().toISOString(),
    generatedAt: new Date().toLocaleString('it-IT', { timeZone: 'Europe/Rome' }),
    account: GMAIL_ADDRESS,
    summary: {
      total: emails.length,
      categories: {},
      urgent: [],
      drafts: [],
      byPriority: {
        HIGH: [],
        MEDIUM: [],
        LOW: []
      }
    },
    details: [],
    actions: {
      toReply: [],
      toArchive: [],
      toReview: []
    }
  };

  for (const email of emails) {
    const categories = categorizeEmail(email.subject, email.from, email.body);
    const priority = calculatePriority(email);
    
    categories.forEach(cat => {
      report.summary.categories[cat] = (report.summary.categories[cat] || 0) + 1;
    });

    const emailData: CategorizedEmail = {
      ...email,
      categories,
      priority,
      snippet: email.body ? email.body.substring(0, 200) + '...' : ''
    };

    // Genera draft per email che richiedono risposta
    const replyCategories = ['VINITALY', 'CLIENTS', 'INVOICES', 'ROCKETBOOK'];
    const mainCategory = categories.find(c => replyCategories.includes(c));
    
    if (mainCategory && !categories.includes('NEWSLETTER')) {
      emailData.suggestedDraft = generateDraft(email.subject, mainCategory);
      report.summary.drafts.push({
        id: emailData.id,
        subject: email.subject,
        category: mainCategory,
        draft: emailData.suggestedDraft
      });
      report.actions.toReply.push(emailData);
    }

    // Traccia email urgenti
    if (categories.includes('URGENT') || priority === 'HIGH') {
      report.summary.urgent.push(emailData);
    }

    // Categorizza per priorità
    report.summary.byPriority[priority].push(emailData);

    // Suggerisci azioni
    if (categories.includes('NEWSLETTER') && priority === 'LOW') {
      report.actions.toArchive.push(emailData);
    } else if (categories.includes('INVOICES')) {
      report.actions.toReview.push(emailData);
    }

    report.details.push(emailData);
  }

  return report;
}

function generateHTMLReport(report: EmailReport): string {
  const categoryColors: Record<string, string> = {
    VINITALY: '#f59e0b',
    ROCKETBOOK: '#3b82f6',
    INVOICES: '#6366f1',
    CLIENTS: '#10b981',
    NEWSLETTER: '#6b7280',
    URGENT: '#ef4444'
  };

  const priorityColors: Record<string, string> = {
    HIGH: '#ef4444',
    MEDIUM: '#f59e0b',
    LOW: '#10b981'
  };

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Email Assistant Report</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { 
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
      line-height: 1.6; 
      color: #1f2937;
      background: #f3f4f6;
      padding: 20px;
    }
    .container { max-width: 900px; margin: 0 auto; }
    .header { 
      background: linear-gradient(135deg, #6366f1, #8b5cf6); 
      color: white; 
      padding: 30px; 
      border-radius: 16px;
      margin-bottom: 24px;
    }
    .header h1 { font-size: 28px; margin-bottom: 8px; }
    .header p { opacity: 0.9; }
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: 16px;
      margin-bottom: 24px;
    }
    .stat-card {
      background: white;
      padding: 20px;
      border-radius: 12px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
      text-align: center;
    }
    .stat-number { font-size: 32px; font-weight: bold; color: #6366f1; }
    .stat-label { color: #6b7280; font-size: 14px; }
    .section { 
      background: white; 
      padding: 24px; 
      border-radius: 12px; 
      margin-bottom: 20px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    }
    .section h2 { 
      font-size: 20px; 
      margin-bottom: 16px; 
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .category-tag { 
      display: inline-block; 
      padding: 4px 12px; 
      margin: 4px; 
      border-radius: 20px; 
      font-size: 12px;
      font-weight: 500;
      color: white;
    }
    .email-item { 
      padding: 16px; 
      margin: 12px 0; 
      background: #f9fafb; 
      border-left: 4px solid #6366f1; 
      border-radius: 8px;
    }
    .email-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 8px;
    }
    .email-subject { font-weight: 600; font-size: 16px; }
    .email-from { color: #6b7280; font-size: 14px; }
    .priority-badge {
      display: inline-block;
      padding: 2px 8px;
      border-radius: 12px;
      font-size: 11px;
      font-weight: 600;
      text-transform: uppercase;
    }
    .draft-box {
      background: #f0fdf4;
      border: 1px solid #86efac;
      padding: 16px;
      border-radius: 8px;
      margin-top: 12px;
      font-family: monospace;
      font-size: 13px;
      white-space: pre-wrap;
    }
    .draft-label {
      font-weight: 600;
      color: #166534;
      margin-bottom: 8px;
      font-family: sans-serif;
    }
    .urgent-item { border-left-color: #ef4444; background: #fef2f2; }
    .action-list { list-style: none; }
    .action-list li {
      padding: 12px;
      margin: 8px 0;
      background: #f3f4f6;
      border-radius: 8px;
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .action-icon { font-size: 20px; }
    .footer {
      text-align: center;
      color: #9ca3af;
      font-size: 12px;
      padding: 20px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>📧 Email Assistant Report</h1>
      <p>Account: ${report.account} | Generato: ${report.generatedAt}</p>
    </div>

    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-number">${report.summary.total}</div>
        <div class="stat-label">Email Analizzate</div>
      </div>
      <div class="stat-card">
        <div class="stat-number">${report.summary.urgent.length}</div>
        <div class="stat-label">Urgenti</div>
      </div>
      <div class="stat-card">
        <div class="stat-number">${report.summary.drafts.length}</div>
        <div class="stat-label">Draft Suggeriti</div>
      </div>
      <div class="stat-card">
        <div class="stat-number">${report.actions.toReply.length}</div>
        <div class="stat-label">Da Rispondere</div>
      </div>
    </div>

    ${report.summary.urgent.length > 0 ? `
    <div class="section">
      <h2>🚨 Email Urgenti</h2>
      ${report.summary.urgent.map(e => `
        <div class="email-item urgent-item">
          <div class="email-header">
            <div>
              <div class="email-subject">${e.subject}</div>
              <div class="email-from">${e.from}</div>
            </div>
            <span class="priority-badge" style="background: ${priorityColors[e.priority]}20; color: ${priorityColors[e.priority]}">${e.priority}</span>
          </div>
          <div>
            ${e.categories.map(c => `<span class="category-tag" style="background: ${categoryColors[c]}">${c}</span>`).join('')}
          </div>
        </div>
      `).join('')}
    </div>
    ` : ''}

    ${report.actions.toReply.length > 0 ? `
    <div class="section">
      <h2>💬 Email che Richiedono Risposta</h2>
      ${report.actions.toReply.map(e => `
        <div class="email-item">
          <div class="email-header">
            <div>
              <div class="email-subject">${e.subject}</div>
              <div class="email-from">${e.from}</div>
            </div>
            <span class="priority-badge" style="background: ${priorityColors[e.priority]}20; color: ${priorityColors[e.priority]}">${e.priority}</span>
          </div>
          <div style="margin: 8px 0;">
            ${e.categories.map(c => `<span class="category-tag" style="background: ${categoryColors[c]}">${c}</span>`).join('')}
          </div>
          ${e.suggestedDraft ? `
          <div class="draft-box">
            <div class="draft-label">💡 Draft suggerito:</div>
            <strong>${e.suggestedDraft.subject}</strong>

${e.suggestedDraft.body}
          </div>
          ` : ''}
        </div>
      `).join('')}
    </div>
    ` : ''}

    <div class="section">
      <h2>📊 Categorie Rilevate</h2>
      <div>
        ${Object.entries(report.summary.categories).map(([cat, count]) => 
          `<span class="category-tag" style="background: ${categoryColors[cat] || '#6b7280'}">${cat}: ${count}</span>`
        ).join('')}
      </div>
    </div>

    ${report.actions.toArchive.length > 0 ? `
    <div class="section">
      <h2>🗑️ Email Suggerite per Archiviazione</h2>
      <ul class="action-list">
        ${report.actions.toArchive.map(e => `
          <li><span class="action-icon">📰</span> ${e.subject} <span style="color: #9ca3af;">(${e.from})</span></li>
        `).join('')}
      </ul>
    </div>
    ` : ''}

    ${report.actions.toReview.length > 0 ? `
    <div class="section">
      <h2>📋 Email da Revisionare</h2>
      <ul class="action-list">
        ${report.actions.toReview.map(e => `
          <li><span class="action-icon">📄</span> ${e.subject} <span style="color: #9ca3af;">(${e.from})</span></li>
        `).join('')}
      </ul>
    </div>
    ` : ''}

    <div class="footer">
      <p>Report generato automaticamente da Email Assistant | Kimi Claw</p>
      <p>Per accedere alle email complete, utilizza il dashboard su https://anselmos-dashboard.vercel.app</p>
    </div>
  </div>
</body>
</html>`;
}

async function sendEmailReport(report: EmailReport): Promise<void> {
  if (!GMAIL_APP_PASSWORD) {
    throw new Error('GMAIL_APP_PASSWORD non configurata');
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: GMAIL_ADDRESS,
      pass: GMAIL_APP_PASSWORD
    }
  });

  const htmlContent = generateHTMLReport(report);

  await transporter.sendMail({
    from: GMAIL_ADDRESS,
    to: GMAIL_ADDRESS,
    subject: `📧 Email Assistant Report - ${new Date().toLocaleDateString('it-IT')}`,
    html: htmlContent
  });
}

// GET - Esegue analisi e invia report
export async function GET(request: NextRequest) {
  try {
    // Verifica cron secret per sicurezza
    const { searchParams } = new URL(request.url);
    const secret = searchParams.get('secret');
    
    if (secret !== process.env.CRON_SECRET) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Email di esempio (in produzione, queste verrebbero da Gmail API)
    const demoEmails: EmailData[] = [
      {
        id: '1',
        subject: 'Conferma partecipazione Vinitaly 2025 - Stand VeronaFiere',
        from: 'eventi@veronafiere.it',
        date: new Date().toISOString(),
        body: 'Gentile Anselmo, confermiamo la sua partecipazione a Vinitaly 2025.'
      },
      {
        id: '2',
        subject: 'Rocketbook: Nuove funzionalità disponibili',
        from: 'support@getrocketbook.com',
        date: new Date().toISOString(),
        body: 'Scopri le nuove funzionalità di Rocketbook.'
      },
      {
        id: '3',
        subject: 'Fattura Elettronica n. 2025/042 - Scadenza pagamento',
        from: 'fatture@fornitore.it',
        date: new Date().toISOString(),
        body: 'In allegato la fattura elettronica con scadenza.'
      },
      {
        id: '4',
        subject: 'Richiesta preventivo per nuovo progetto',
        from: 'cliente@azienda.com',
        date: new Date().toISOString(),
        body: 'Buongiorno, vorremmo ricevere un preventivo.'
      },
      {
        id: '5',
        subject: 'Newsletter settimanale - Offerte speciali',
        from: 'newsletter@negozio.com',
        date: new Date().toISOString(),
        body: 'Scopri le nostre offerte speciali!'
      }
    ];

    // Genera report
    const report = generateReport(demoEmails);

    // Invia email
    await sendEmailReport(report);

    return NextResponse.json({
      success: true,
      message: 'Report inviato con successo',
      summary: {
        total: report.summary.total,
        urgent: report.summary.urgent.length,
        drafts: report.summary.drafts.length,
        categories: report.summary.categories
      }
    });

  } catch (error) {
    console.error('Email Assistant Error:', error);
    return NextResponse.json(
      { error: 'Failed to process emails', details: (error as Error).message },
      { status: 500 }
    );
  }
}

// POST - Analizza email fornite nel body
export async function POST(request: NextRequest) {
  try {
    const { emails } = await request.json();

    if (!Array.isArray(emails)) {
      return NextResponse.json(
        { error: 'Invalid request: emails array required' },
        { status: 400 }
      );
    }

    const report = generateReport(emails);
    
    // Opzionalmente invia report via email
    const { searchParams } = new URL(request.url);
    if (searchParams.get('send') === 'true') {
      await sendEmailReport(report);
    }

    return NextResponse.json(report);

  } catch (error) {
    console.error('Email Assistant Error:', error);
    return NextResponse.json(
      { error: 'Failed to analyze emails', details: (error as Error).message },
      { status: 500 }
    );
  }
}
