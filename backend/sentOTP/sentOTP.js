import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

export const sentOtpMail = async (email, otp) => {
  const apiKey = (process.env.BREVO_API_KEY || process.env.SMTP_PASS || "").trim();
  const senderEmail = (process.env.BREVO_USER_EMAIL || process.env.SMTP_USER || "hotdrop1229@gmail.com").trim();

  if (!apiKey) {
    throw new Error("Brevo API Key is missing for OTP service.");
  }

  const data = {
    sender: { 
      name: "HotDrop Support", 
      email: senderEmail 
    },
    to: [{ email: email.trim().toLowerCase() }],
    subject: "OTP Verification for Your HotDrop Account",
    htmlContent: `
      <div style="font-family: sans-serif; text-align: center; padding: 20px; border: 1px solid #eee; border-radius: 12px; max-width: 450px; margin: auto; background-color: #ffffff;">
        <h2 style="color: #2563eb; margin-bottom: 10px;">HotDrop Verification</h2>
        <p style="color: #4b5563; font-size: 16px;">Your OTP :</p>
        <div style="margin: 25px 0;">
          <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #1e293b; background: #f3f4f6; padding: 10px 20px; border-radius: 8px; border: 1px dashed #cbd5e1;">
            ${otp}
          </span>
        </div>
        <p style="font-size: 14px; color: #94a3b8;">OTP will expire in 10 min.Don't share this with anyone.</p>
        <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0;">
        <p style="font-size: 12px; color: #cbd5e1;">&copy; 2026 HotDrop Devs</p>
      </div>
    `
  };

  try {
    console.log(`⏳ Sending OTP via Brevo API to: ${email}...`);
    
    const response = await axios.post('https://api.brevo.com/v3/smtp/email', data, {
      headers: {
        'api-key': apiKey,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });

    console.log("✅ OTP API SUCCESS! Sent to:", email, "ID:", response.data.messageId);
    return response.data;
  } catch (error) {
    const errorMsg = error.response ? JSON.stringify(error.response.data) : error.message;
    console.error("❌ OTP API ERROR:", errorMsg);
    throw new Error(`OTP sending failed: ${error.message}`);
  }
};