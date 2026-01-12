const express = require('express');
const fs = require('fs');
const path = require('path');
const nodemailer = require('nodemailer');

const app = express();
const PORT = process.env.PORT || 8000;

app.use(express.json());
app.use(express.static(path.join(__dirname, '..')));

app.post('/contact', async (req, res) => {
  const { name, email, message } = req.body || {};
  if (!name || !email || !message) {
    return res.status(400).json({ ok: false, error: 'Missing fields' });
  }

  const entry = {
    name,
    email,
    message,
    date: new Date().toISOString()
  };

  // Recipient: use RECIPIENT_EMAIL env or the email provided by the user as fallback
  const recipient = process.env.RECIPIENT_EMAIL || 'adriangrau@outlook.com';

  // If SMTP config provided, try to send email. Otherwise fallback to saving to file.
  if (process.env.SMTP_HOST && process.env.SMTP_PORT) {
    try {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT) || 587,
        secure: process.env.SMTP_SECURE === 'true',
        auth: process.env.SMTP_USER ? {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS
        } : undefined
      });

      const mailInfo = await transporter.sendMail({
        from: process.env.FROM_EMAIL || 'no-reply@example.com',
        to: recipient,
        subject: `Nouveau message de ${name}`,
        replyTo: email,
        text: `${message}\n\n— ${name} <${email}>`,
        html: `<p>${message.replace(/\n/g, '<br>')}</p><p>— ${name} &lt;${email}&gt;</p>`
      });

      console.log('Email sent:', mailInfo.messageId);
      return res.json({ ok: true });
    } catch (err) {
      console.error('Failed to send email, falling back to file:', err);
      // fallthrough to file write
    }
  }

  const outPath = path.join(__dirname, '..', 'contact-submissions.jsonl');
  fs.appendFile(outPath, JSON.stringify(entry) + '\n', (err) => {
    if (err) {
      console.error('Failed to write submission', err);
      return res.status(500).json({ ok: false });
    }
    console.log('New contact submission (file):', entry);
    res.json({ ok: true });
  });
});

app.listen(PORT, () => {
  console.log(`Static site + contact server running at http://localhost:${PORT}`);
});
