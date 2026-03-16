import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config(); 
 
export const emailVerify = async (token, email) => {
  const URL = process.env.FRONTEND_URL || process.env.CLIENT_URL || "http://localhost:5173";
  try {
   if (!process.env.MAIL_USER_EMAIL || !process.env.MAIL_USER_PASS) {
    throw new Error("Missing MAIL_USER_EMAIL or MAIL_USER_PASS in environment");
   }

   const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465, 
  secure: true, 
  auth: {
    user: process.env.MAIL_USER_EMAIL, 
    pass: process.env.MAIL_USER_PASS,  
  },
});
    // console.log("EMAIL:", process.env.MAIL_USER_EMAIL);
    // console.log("PASS:", process.env.MAIL_USER_PASS);
    const mailOptions = {
      from: process.env.MAIL_USER_EMAIL,
      to: email,
      subject: "Email Verification for HotDrop",
      text: `Please verify your email by clicking on the link: ${URL}/verify-email/${token}`,
    };


    await transporter.sendMail(mailOptions);
    console.log("✅ Verification email sent to", email);

  } catch (error) {
    console.error("❌ Email sending failed:", error.message);
    throw error; 
  }
};
