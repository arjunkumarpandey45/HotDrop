import nodemailer from "nodemailer";
import "dotenv/config";

 
export const sentOtpMail = async ( email,otp) => {
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
      subject: "OTP Verification for Your HotDrop Account",
      html:`<p>Your OTP is : <b>${otp}</b></p>`
    };


    await transporter.sendMail(mailOptions);
    console.log("✅ OTP sent to", email);

  } catch (error) {
    console.error("❌ OTP sending failed:", error.message);
    throw error; 
  }
};
