const nodemailer = require('nodemailer');
const fs = require('fs');

const report = fs.readFileSync('/tmp/bug-tracker-report-slemo54.md', 'utf8');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_ADDRESS || 'anselmo.acquah54@gmail.com',
    pass: process.env.GMAIL_APP_PASSWORD
  }
});

const mailOptions = {
  from: 'Bug Tracker AI <anselmo.acquah54@gmail.com>',
  to: 'anselmo.acquah54@gmail.com',
  subject: '🐛 Bug Tracker AI Report - Repository slemo54 - 18 Feb 2026',
  text: report,
  html: `<pre style="font-family: monospace; white-space: pre-wrap;">${report.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</pre>`
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
