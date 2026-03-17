import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

export const emailVerify = async (token, email) => {
  const URL = process.env.FRONTEND_URL || "http://localhost:5173";
  const apiKey = process.env.BREVO_API_KEY || process.env.SMTP_PASS;

  if (!apiKey) {
    throw new Error("Brevo API Key is missing in environment variables.");
  }

  const verificationLink = `${URL}/verify-email/${token}`;

  const data = {
    sender: { 
      name: "HotDrop Support", 
      email: process.env.BREVO_USER_EMAIL || "hotdrop1229@gmail.com" 
    },
    to: [{ email: email.trim().toLowerCase() }],
    subject: "Verify Your HotDrop Account 🚀",
    htmlContent: `
      <div style="font-family: sans-serif; text-align: center; padding: 20px; border: 1px solid #eee; border-radius: 10px; max-width: 500px; margin: auto;">
        <h2 style="color: #2563eb;">Welcome to HotDrop!</h2>
        <p>Please Click at Verify My Account:</p>
        <div style="margin: 30px 0;">
          <a href="${verificationLink}" 
             style="background: #2563eb; color: white; padding: 12px 25px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
            Verify My Account
          </a>
        </div>
        <p style="font-size: 12px; color: #666;">Link will expire in 60min.</p>
      </div>
    `
  };

  try {
    console.log(`⏳ Sending via Brevo HTTP API to: ${email}...`);
    
    const response = await axios.post('https://api.brevo.com/v3/smtp/email', data, {
      headers: {
        'api-key': apiKey,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });

    console.log("✅ API SUCCESS! Email Sent. ID:", response.data.messageId);
    return response.data;
  } catch (error) {
    const errorMsg = error.response ? JSON.stringify(error.response.data) : error.message;
    console.error("❌ BREVO HTTP ERROR:", errorMsg);
    throw new Error(`Email API failed: ${error.message}`);
  }
};