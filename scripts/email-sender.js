const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.GMAIL_ADDRESS || 'anselmo.acquah54@gmail.com',
    pass: process.env.GMAIL_APP_PASSWORD?.replace(/\s/g, '') || 'hpakkprdzynomqjo',
  },
});

async function sendYouTubeDigestEmail(to, data) {
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

module.exports = { sendYouTubeDigestEmail };
