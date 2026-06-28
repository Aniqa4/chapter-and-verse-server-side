const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT || 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

async function sendVerificationEmail(email, token) {
  const verifyUrl = `${process.env.SERVER_URL}/verify-email/${token}`;

  await transporter.sendMail({
    from: `"Chapter & Verse" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Verify your Chapter & Verse account',
    html: `
      <h2>Welcome to Chapter &amp; Verse!</h2>
      <p>Click the link below to verify your email address. This link expires in 24 hours.</p>
      <a href="${verifyUrl}" style="background:#4f46e5;color:#fff;padding:10px 20px;border-radius:4px;text-decoration:none;">
        Verify Email
      </a>
      <p>Or copy this URL: ${verifyUrl}</p>
    `,
  });
}

module.exports = { sendVerificationEmail };
