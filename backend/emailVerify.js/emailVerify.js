import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const createTransporter = (port, secure, user, pass) =>
  nodemailer.createTransport({
    host: "smtp.gmail.com",
    port,
    secure,
    auth: { user, pass },
    // 🔥 Render/Cloud fix: IPv4 force karna aur TLS errors ignore karna
    family: 4, 
    tls: {
      rejectUnauthorized: false,
      minVersion: "TLSv1.2"
    },
    connectionTimeout: 10000, // 10 seconds timeout
  });

export const emailVerify = async (token, email) => {
  const URL = process.env.FRONTEND_URL || "http://localhost:5173";
  
  try {
    const mailUser = (process.env.MAIL_USER_EMAIL || "").trim();
    const mailPass = (process.env.MAIL_USER_PASS || "").trim();

    if (!mailUser || !mailPass) {
      throw new Error("Missing MAIL_USER_EMAIL or MAIL_USER_PASS in environment");
    }

    const mailOptions = {
      from: `"HotDrop" <${mailUser}>`,
      to: email,
      subject: "Email Verification for HotDrop",
      // HTML format zyada professional lagta hai aur link clickable hota hai
      html: `
        <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
          <h2 style="color: #2563eb;">Welcome to HotDrop!</h2>
          <p>Please verify your email to activate your account.</p>
          <a href="${URL}/verify-email/${token}" 
             style="background: #2563eb; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block; margin-top: 10px;">
            Verify Email
          </a>
          <p style="margin-top: 20px; font-size: 12px; color: #666;">
            If the button doesn't work, copy-paste this link: <br> ${URL}/verify-email/${token}
          </p>
        </div>
      `,
    };

    let transporter;
    
    // Render par Port 587 zyada stable hai, isliye pehle usey try karte hain
    try {
      console.log("⏳ Attempting SMTP on Port 587...");
      transporter = createTransporter(587, false, mailUser, mailPass);
      await transporter.verify();
    } catch (err) {
      console.warn("⚠️ Port 587 failed, trying 465:", err.message);
      transporter = createTransporter(465, true, mailUser, mailPass);
      await transporter.verify();
    }

    await transporter.sendMail(mailOptions);
    console.log("✅ Verification email sent to", email);

  } catch (error) {
    console.error("❌ Email sending failed:", error.message);
    // Detail error message taaki frontend par "Profile not created" ki wajah dikhe
    throw new Error(`Email Service Error: ${error.message}`); 
  }
};