import nodemailer from "nodemailer";
import dotenv from "dotenv";
import path from "path";

// Ye line manually path set karegi
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

 
export const emailVerify = async (token, email) => {
  const URL = process.env.FRONTEND_URL 
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.MAIL_USER_EMAIL,
        pass: process.env.MAIL_USER_PASS, // Gmail App Password
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
