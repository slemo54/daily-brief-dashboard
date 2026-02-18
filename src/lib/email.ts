import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.GMAIL_ADDRESS || 'anselmo.acquah54@gmail.com',
    pass: process.env.GMAIL_APP_PASSWORD?.replace(/\s/g, '') || 'hpakkprdzynomqjo',
  },
});

export interface DailyBriefData {
  date: string;
  weather: {
    temp: number;
    condition: string;
    humidity: number;
    wind: number;
  };
  tasks: string[];
  rocketbookNotes: number;
  lifeQuestsProgress: number;
  githubActivity: string[];
  aiNews: string[];
}

export async function sendDailyBriefEmail(to: string, data: DailyBriefData): Promise<boolean> {
  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: 'Segoe UI', Arial, sans-serif; background: #0a0a0f; color: #f0f0f5; margin: 0; padding: 20px; }
    .container { max-width: 600px; margin: 0 auto; background: #12121a; border-radius: 16px; overflow: hidden; }
    .header { background: linear-gradient(135deg, #6366f1, #8b5cf6); padding: 30px; text-align: center; }
    .header h1 { margin: 0; font-size: 28px; }
    .header p { margin: 10px 0 0; opacity: 0.9; }
    .content { padding: 30px; }
    .section { margin-bottom: 25px; }
    .section h2 { color: #6366f1; font-size: 18px; margin-bottom: 12px; border-bottom: 1px solid #2a2a3a; padding-bottom: 8px; }
    .weather-box { background: #1a1a25; padding: 20px; border-radius: 12px; display: flex; align-items: center; gap: 20px; }
    .weather-temp { font-size: 48px; font-weight: bold; }
    .weather-info { flex: 1; }
    .task-list { list-style: none; padding: 0; }
    .task-list li { background: #1a1a25; padding: 12px 16px; margin-bottom: 8px; border-radius: 8px; border-left: 3px solid #6366f1; }
    .progress-bar { background: #2a2a3a; height: 20px; border-radius: 10px; overflow: hidden; }
    .progress-fill { background: linear-gradient(90deg, #22c55e, #6366f1); height: 100%; border-radius: 10px; }
    .stats-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; }
    .stat-card { background: #1a1a25; padding: 20px; border-radius: 12px; text-align: center; }
    .stat-value { font-size: 32px; font-weight: bold; color: #6366f1; }
    .stat-label { color: #a0a0b0; font-size: 14px; margin-top: 5px; }
    .footer { background: #0a0a0f; padding: 20px; text-align: center; color: #606070; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>📊 Daily Brief</h1>
      <p>${data.date}</p>
    </div>
    <div class="content">
      <div class="section">
        <h2>🌤️ Meteo Verona</h2>
        <div class="weather-box">
          <div class="weather-temp">${data.weather.temp}°C</div>
          <div class="weather-info">
            <div><strong>${data.weather.condition}</strong></div>
            <div>💧 Umidità: ${data.weather.humidity}% | 💨 Vento: ${data.weather.wind} km/h</div>
          </div>
        </div>
      </div>
      
      <div class="section">
        <h2>📋 Task Prioritari</h2>
        <ul class="task-list">
          ${data.tasks.map(task => `<li>${task}</li>`).join('')}
        </ul>
      </div>
      
      <div class="section">
        <h2>📈 Progresso Life Quests</h2>
        <div class="progress-bar">
          <div class="progress-fill" style="width: ${data.lifeQuestsProgress}%"></div>
        </div>
        <p style="text-align: center; margin-top: 10px;">${data.lifeQuestsProgress}% completato</p>
      </div>
      
      <div class="section">
        <h2>📊 Statistiche</h2>
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-value">${data.rocketbookNotes}</div>
            <div class="stat-label">Note Rocketbook</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">${data.githubActivity.length}</div>
            <div class="stat-label">Attività GitHub</div>
          </div>
        </div>
      </div>
      
      <div class="section">
        <h2>🤖 AI News</h2>
        <ul class="task-list">
          ${data.aiNews.map(news => `<li>${news}</li>`).join('')}
        </ul>
      </div>
    </div>
    <div class="footer">
      <p>Generato automaticamente da Anselmo's Dashboard</p>
    </div>
  </div>
</body>
</html>
  `;

  try {
    await transporter.sendMail({
      from: `"Anselmo's Dashboard" <${process.env.GMAIL_ADDRESS || 'anselmo.acquah54@gmail.com'}>`,
      to,
      subject: `📊 Daily Brief - ${data.date}`,
      html: htmlContent,
    });
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
}
