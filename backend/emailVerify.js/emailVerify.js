import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config(); 

const createTransporter = (port, secure, user, pass) =>
  nodemailer.createTransport({
    host: "smtp.gmail.com",
    port,
    secure,
    auth: { user, pass },
    requireTLS: !secure,
  });
 
export const emailVerify = async (token, email) => {
  const URL = process.env.FRONTEND_URL || process.env.CLIENT_URL || "http://localhost:5173";
  try {
   const mailUser = (process.env.MAIL_USER_EMAIL || "").trim();
   const mailPass = (process.env.MAIL_USER_PASS || "").trim();

   if (!mailUser || !mailPass) {
    throw new Error("Missing MAIL_USER_EMAIL or MAIL_USER_PASS in environment");
   }

    const mailOptions = {
      from: `HotDrop <${mailUser}>`,
      to: email,
      subject: "Email Verification for HotDrop",
      text: `Please verify your email by clicking on the link: ${URL}/verify-email/${token}`,
    };

    let transporter = createTransporter(465, true, mailUser, mailPass);

    try {
      await transporter.verify();
    } catch (primaryError) {
      console.warn("⚠️ SMTP 465 failed, retrying with 587:", primaryError.message);
      transporter = createTransporter(587, false, mailUser, mailPass);
      await transporter.verify();
    }

    await transporter.sendMail(mailOptions);
    console.log("✅ Verification email sent to", email);

  } catch (error) {
    console.error("❌ Email sending failed:", error.message);
    throw error; 
  }
};
