const nodemailer = require('nodemailer');
const fs = require('fs');

const htmlReport = fs.readFileSync('/tmp/github-analysis-report.html', 'utf8');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_ADDRESS || 'anselmo.acquah54@gmail.com',
    pass: process.env.GMAIL_APP_PASSWORD
  }
});

const today = new Date().toLocaleDateString('it-IT', { 
  day: 'numeric', 
  month: 'long', 
  year: 'numeric' 
});

const mailOptions = {
  from: 'GitHub Daily Analysis <anselmo.acquah54@gmail.com>',
  to: 'anselmo.acquah54@gmail.com',
  subject: `📊 GitHub Daily Analysis - ${today}`,
  html: htmlReport
};

transporter.sendMail(mailOptions, (error, info) => {
  if (error) {
    console.error('Error sending email:', error);
    process.exit(1);
  } else {
    console.log('Email sent:', info.response);
    process.exit(0);
  }
});