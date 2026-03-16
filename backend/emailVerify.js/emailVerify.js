import nodemailer from "nodemailer";
import dotenv from "dotenv";
import dns from "dns";

dotenv.config();

const forceIPv4Lookup = (hostname, options, callback) => {
  dns.lookup(hostname, { family: 4, all: false }, callback);
};

/**
 * Sends a verification email using Gmail SMTP.
 * Optimized for Render's Free Tier networking.
 */
export const emailVerify = async (token, email) => {
  const URL = process.env.FRONTEND_URL || "http://localhost:5173";
  const smtpHost = (process.env.SMTP_HOST || "smtp-relay.brevo.com").trim();
  const smtpPort = Number(process.env.SMTP_PORT || 587);
  const smtpSecure = String(process.env.SMTP_SECURE || "false") === "true";
  const mailUser = (process.env.SMTP_USER || process.env.MAIL_USER_EMAIL || "").trim();
  const mailPass = (process.env.SMTP_PASS || process.env.MAIL_USER_PASS || "").trim();

  if (!mailUser || !mailPass) {
    throw new Error("SMTP credentials not configured on server.");
  }

  const createTransporter = (port, secure) =>
    nodemailer.createTransport({
      host: smtpHost,
      port,
      secure,
      requireTLS: !secure,
      auth: {
        user: mailUser,
        pass: mailPass,
      },
      lookup: forceIPv4Lookup,
      tls: {
        servername: smtpHost,
      },
      connectionTimeout: 20000,
      greetingTimeout: 20000,
      socketTimeout: 30000,
    });

  const verificationLink = `${URL}/verify-email/${token}`;

  const mailOptions = {
    from: `"HotDrop Support" <${mailUser}>`,
    to: email.trim().toLowerCase(),
    subject: "Verify Your HotDrop Account 🚀",
    html: `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: auto; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; background-color: #ffffff;">
        <div style="background-color: #2563eb; padding: 20px; text-align: center;">
          <h1 style="color: #ffffff; margin: 0; font-size: 24px;">Welcome to HotDrop!</h1>
        </div>
        <div style="padding: 30px; color: #1e293b; line-height: 1.6;">
          <p>Bhai, registration ke liye shukriya! Apne account ko activate karne ke liye niche button par click karein:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${verificationLink}" 
               style="background-color: #2563eb; color: #ffffff; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block; box-shadow: 0 4px 6px -1px rgba(37, 99, 235, 0.2);">
               Verify My Account
            </a>
          </div>
          <p style="font-size: 14px; color: #64748b;">Ye link 60 minutes mein expire ho jayega.</p>
          <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0;">
          <p style="font-size: 12px; color: #94a3b8; text-align: center;">
            If the button doesn't work, copy-paste this: <br>
            <a href="${verificationLink}" style="color: #2563eb;">${verificationLink}</a>
          </p>
        </div>
      </div>
    `,
  };

  try {
    console.log(`⏳ Attempting SMTP on ${smtpHost}:${smtpPort}...`);
    let transporter = createTransporter(smtpPort, smtpSecure);

    try {
      await transporter.verify();
    } catch (primaryError) {
      const fallbackPort = smtpPort === 587 ? 465 : 587;
      const fallbackSecure = fallbackPort === 465;
      console.warn(`⚠️ SMTP ${smtpPort} failed, trying ${fallbackPort}: ${primaryError.message}`);
      transporter = createTransporter(fallbackPort, fallbackSecure);
      await transporter.verify();
    }

    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Email sent successfully! MessageID:", info.messageId);
    return info;
  } catch (error) {
    console.error("❌ NODEMAILER ERROR:", error.message);

    throw new Error(`Email failed: ${error.message}`);
  }
};