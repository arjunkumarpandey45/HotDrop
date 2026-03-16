import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

export const emailVerify = async (token, email) => {
  const URL = process.env.FRONTEND_URL || "http://localhost:5173";
  const mailUser = (process.env.MAIL_USER_EMAIL || "").trim();
  const mailPass = (process.env.MAIL_USER_PASS || "").trim();

  if (!mailUser || !mailPass) {
    throw new Error("Missing MAIL_USER_EMAIL or MAIL_USER_PASS in environment");
  }

  // 🔥 Render specific Fix: Standard Configuration for Gmail
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465, // Direct secure port is usually more reliable on Render
    secure: true, 
    service: 'gmail', // Force Gmail settings
    auth: {
      user: mailUser,
      pass: mailPass, // 16-digit App Password
    },
    family: 4, // 🛑 Force IPv4 to stop ENETUNREACH error
    tls: {
      rejectUnauthorized: false
    }
  });

  const mailOptions = {
    from: `"HotDrop" <${mailUser}>`,
    to: email.trim(), // Trim spaces from email
    subject: "Email Verification for HotDrop",
    html: `
      <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px; max-width: 500px; margin: auto;">
        <h2 style="color: #2563eb; text-align: center;">Welcome to HotDrop!</h2>
        <p style="color: #444;">Bhai, your account is almost ready. Just click the button below to verify your email.</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${URL}/verify-email/${token}" 
             style="background: #2563eb; color: white; padding: 12px 25px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
            Verify My Account
          </a>
        </div>
        <p style="font-size: 12px; color: #888; text-align: center;">
          If the button doesn't work, copy-paste this link: <br> 
          <span style="color: #2563eb;">${URL}/verify-email/${token}</span>
        </p>
      </div>
    `,
  };

  try {
    console.log(`⏳ Attempting to send email to ${email}...`);
    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Verification email sent successfully:", info.messageId);
    return info;
  } catch (error) {
    console.error("❌ Nodemailer Error:", error.message);
    throw new Error(`Email Service Error: ${error.message}`);
  }
};