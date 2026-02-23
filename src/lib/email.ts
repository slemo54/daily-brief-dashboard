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

export interface YouTubeDigestData {
  date: string;
  videos: {
    channel: string;
    handle: string;
    title: string;
    link: string;
    publishedDate: string;
    duration?: string;
    views?: string;
    takeaways: string[];
    actionableInsights: string[];
  }[];
  themes: string[];
  watchlistPriority: {
    title: string;
    creator: string;
    reason: string;
    link: string;
  }[];
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

export interface LifeQuestsReminderData {
  date: string;
  habits: {
    id: string;
    name: string;
    time: string;
    category: string;
    duration?: string;
    description?: string;
    emoji: string;
    color: string;
  }[];
  habitsByCategory: Record<string, {
    id: string;
    name: string;
    time: string;
    category: string;
    duration?: string;
    description?: string;
    emoji: string;
    color: string;
  }[]>;
  totalHabits: number;
  categoryEmoji: Record<string, string>;
  weeklyStats: {
    name: string;
    frequency: number;
    category: string;
  }[];
}

export async function sendLifeQuestsReminderEmail(
  to: string,
  data: LifeQuestsReminderData
): Promise<boolean> {
  const categoryLabels: Record<string, string> = {
    fitness: 'Fitness',
    learning: 'Apprendimento',
    work: 'Lavoro',
    wellness: 'Benessere',
    creative: 'Creatività',
  };

  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: 'Segoe UI', Arial, sans-serif; background: #0a0a0f; color: #f0f0f5; margin: 0; padding: 20px; }
    .container { max-width: 600px; margin: 0 auto; background: #12121a; border-radius: 16px; overflow: hidden; }
    .header { background: linear-gradient(135deg, #22c55e, #6366f1); padding: 30px; text-align: center; }
    .header h1 { margin: 0; font-size: 28px; }
    .header p { margin: 10px 0 0; opacity: 0.9; }
    .content { padding: 30px; }
    .section { margin-bottom: 25px; }
    .section h2 { color: #22c55e; font-size: 18px; margin-bottom: 12px; border-bottom: 1px solid #2a2a3a; padding-bottom: 8px; }
    .habit-card { background: #1a1a25; padding: 16px; margin-bottom: 12px; border-radius: 12px; border-left: 4px solid; display: flex; align-items: center; gap: 15px; }
    .habit-emoji { font-size: 28px; }
    .habit-info { flex: 1; }
    .habit-name { font-size: 16px; font-weight: bold; margin: 0 0 4px 0; }
    .habit-meta { color: #a0a0b0; font-size: 13px; }
    .habit-time { font-size: 20px; font-weight: bold; color: #6366f1; font-family: 'JetBrains Mono', monospace; }
    .stats-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-bottom: 20px; }
    .stat-card { background: #1a1a25; padding: 16px; border-radius: 10px; text-align: center; }
    .stat-value { font-size: 24px; font-weight: bold; color: #22c55e; }
    .stat-label { color: #a0a0b0; font-size: 12px; margin-top: 5px; }
    .category-section { margin-bottom: 20px; }
    .category-header { display: flex; align-items: center; gap: 8px; margin-bottom: 12px; color: #a0a0b0; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; }
    .footer { background: #0a0a0f; padding: 20px; text-align: center; color: #606070; font-size: 12px; }
    .quote { background: #1a1a25; padding: 20px; border-radius: 10px; border-left: 3px solid #6366f1; font-style: italic; color: #c0c0d0; margin: 20px 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>⚡ Life Quests - Oggi</h1>
      <p>${data.date}</p>
    </div>
    <div class="content">
      
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-value">${data.totalHabits}</div>
          <div class="stat-label">Abitudini Oggi</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">${Object.keys(data.habitsByCategory).length}</div>
          <div class="stat-label">Categorie</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">${data.weeklyStats.reduce((acc, h) => acc + h.frequency, 0)}</div>
          <div class="stat-label">Sessioni/Sett</div>
        </div>
      </div>

      <div class="section">
        <h2>📋 Programma di Oggi</h2>
        ${data.habits.map(habit => `
          <div class="habit-card" style="border-left-color: ${habit.color};">
            <div class="habit-emoji">${habit.emoji}</div>
            <div class="habit-info">
              <div class="habit-name">${habit.name}</div>
              <div class="habit-meta">${habit.description || ''} ${habit.duration ? `• ${habit.duration}` : ''}</div>
            </div>
            <div class="habit-time">${habit.time}</div>
          </div>
        `).join('')}
      </div>

      <div class="quote">
        "La routine è ciò che separa i professionisti dagli amatori. Ogni abitudine è un voto per il tipo di persona che vuoi diventare."
      </div>

    </div>
    <div class="footer">
      <p>Generato automaticamente da Anselmo's Dashboard</p>
      <p style="margin-top: 5px;">Tech Lead mode: ON ⚡</p>
    </div>
  </div>
</body>
</html>
  `;

  try {
    await transporter.sendMail({
      from: `"Anselmo's Dashboard - Life Quests" <${process.env.GMAIL_ADDRESS || 'anselmo.acquah54@gmail.com'}>`,
      to,
      subject: `⚡ Life Quests - ${data.date}`,
      html: htmlContent,
    });
    return true;
  } catch (error) {
    console.error('Error sending Life Quests reminder email:', error);
    return false;
  }
}

export async function sendYouTubeDigestEmail(to: string, data: YouTubeDigestData): Promise<boolean> {
  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: 'Segoe UI', Arial, sans-serif; background: #0a0a0f; color: #f0f0f5; margin: 0; padding: 20px; }
    .container { max-width: 700px; margin: 0 auto; background: #12121a; border-radius: 16px; overflow: hidden; }
    .header { background: linear-gradient(135deg, #ef4444, #f97316); padding: 30px; text-align: center; }
    .header h1 { margin: 0; font-size: 28px; }
    .header p { margin: 10px 0 0; opacity: 0.9; }
    .content { padding: 30px; }
    .section { margin-bottom: 30px; }
    .section h2 { color: #ef4444; font-size: 20px; margin-bottom: 15px; border-bottom: 1px solid #2a2a3a; padding-bottom: 10px; }
    .video-card { background: #1a1a25; padding: 20px; border-radius: 12px; margin-bottom: 20px; border-left: 4px solid #ef4444; }
    .video-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px; }
    .video-title { font-size: 18px; font-weight: bold; color: #fff; margin: 0 0 8px 0; }
    .video-meta { color: #a0a0b0; font-size: 13px; }
    .video-link { display: inline-block; background: #ef4444; color: #fff; padding: 8px 16px; border-radius: 6px; text-decoration: none; font-size: 13px; margin-top: 10px; }
    .video-link:hover { background: #dc2626; }
    .takeaways { margin: 15px 0; }
    .takeaways h4 { color: #f97316; margin: 0 0 10px 0; font-size: 14px; }
    .takeaways ul { margin: 0; padding-left: 20px; }
    .takeaways li { color: #c0c0d0; margin-bottom: 6px; font-size: 14px; }
    .insights { background: #252535; padding: 15px; border-radius: 8px; margin-top: 15px; }
    .insights h4 { color: #22c55e; margin: 0 0 10px 0; font-size: 14px; }
    .insights ol { margin: 0; padding-left: 20px; }
    .insights li { color: #c0c0d0; margin-bottom: 8px; font-size: 14px; }
    .themes { display: flex; flex-wrap: wrap; gap: 10px; margin: 15px 0; }
    .theme-tag { background: #2a2a3a; padding: 6px 12px; border-radius: 20px; font-size: 12px; color: #a0a0b0; }
    .priority-card { background: linear-gradient(135deg, #1a1a25, #252535); padding: 15px; border-radius: 10px; margin-bottom: 12px; border: 1px solid #3a3a4a; }
    .priority-title { font-weight: bold; color: #fff; margin-bottom: 5px; }
    .priority-creator { color: #f97316; font-size: 13px; margin-bottom: 5px; }
    .priority-reason { color: #a0a0b0; font-size: 13px; }
    .footer { background: #0a0a0f; padding: 20px; text-align: center; color: #606070; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🎬 YouTube AI Daily Digest</h1>
      <p>${data.date}</p>
    </div>
    <div class="content">
      
      <div class="section">
        <h2>🎯 Temi del Giorno</h2>
        <div class="themes">
          ${data.themes.map(theme => `<span class="theme-tag">${theme}</span>`).join('')}
        </div>
      </div>
      
      <div class="section">
        <h2>🎥 Video Recenti</h2>
        ${data.videos.map(video => `
          <div class="video-card">
            <div class="video-header">
              <div>
                <div class="video-title">${video.title}</div>
                <div class="video-meta">👤 ${video.channel} (@${video.handle}) • 📅 ${video.publishedDate}${video.duration ? ` • ⏱️ ${video.duration}` : ''}${video.views ? ` • 👁️ ${video.views}` : ''}</div>
              </div>
            </div>
            <div class="takeaways">
              <h4>📝 Key Takeaways</h4>
              <ul>
                ${video.takeaways.map(t => `<li>${t}</li>`).join('')}
              </ul>
            </div>
            <div class="insights">
              <h4>✅ 3 Actionable Insights</h4>
              <ol>
                ${video.actionableInsights.map(i => `<li>${i}</li>`).join('')}
              </ol>
            </div>
            <a href="${video.link}" class="video-link" target="_blank">▶️ Guarda su YouTube</a>
          </div>
        `).join('')}
      </div>
      
      <div class="section">
        <h2>⭐ Watchlist Prioritaria</h2>
        <p style="color: #a0a0b0; margin-bottom: 15px;">Se hai tempo solo per 3 video oggi, guarda questi:</p>
        ${data.watchlistPriority.map((item, idx) => `
          <div class="priority-card">
            <div class="priority-title">${idx + 1}. ${item.title}</div>
            <div class="priority-creator">👤 ${item.creator}</div>
            <div class="priority-reason">💡 ${item.reason}</div>
            <a href="${item.link}" class="video-link" target="_blank" style="margin-top: 10px;">▶️ Guarda</a>
          </div>
        `).join('')}
      </div>
      
    </div>
    <div class="footer">
      <p>Digest generato automaticamente da Kimi Claw per Anselmo</p>
      <p style="margin-top: 5px;">📧 anselmo.acquah54@gmail.com</p>
    </div>
  </div>
</body>
</html>
  `;

  try {
    await transporter.sendMail({
      from: `"Kimi Claw - YouTube Digest" <${process.env.GMAIL_ADDRESS || 'anselmo.acquah54@gmail.com'}>`,
      to,
      subject: `🎬 YouTube AI Digest - ${data.date}`,
      html: htmlContent,
    });
    return true;
  } catch (error) {
    console.error('Error sending YouTube digest email:', error);
    return false;
  }
}
