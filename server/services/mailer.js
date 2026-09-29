import nodemailer from 'nodemailer';

let transporter = null;

function getTransporter() {
  if (transporter) return transporter;
  if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      secure: process.env.SMTP_SECURE === 'true',
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
    });
  }
  return transporter;
}

// Forwards a visitor's contact-form message to the portfolio owner's inbox.
// The visitor never sees the owner's email; if SMTP is unconfigured we log instead.
export async function sendContactEmail({ to, ownerName, senderName, senderEmail, message }) {
  const t = getTransporter();
  const subject = `[CodeFolio] New message from ${senderName}`;
  const text = `Hi ${ownerName || 'there'},\n\nYou received a message through your CodeFolio portfolio.\n\nFrom: ${senderName} <${senderEmail}>\n\n${message}\n\n-- Sent via CodeFolio`;

  if (!t) {
    console.log(`[mailer] SMTP not configured - email to ${to} logged instead:\n${text}\n`);
    return { delivered: false, logged: true };
  }

  await t.sendMail({
    from: process.env.MAIL_FROM || '"CodeFolio" <noreply@codefolio.dev>',
    to,
    replyTo: senderEmail,
    subject,
    text
  });
  return { delivered: true, logged: false };
}
