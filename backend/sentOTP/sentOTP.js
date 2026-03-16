import nodemailer from "nodemailer";
import "dotenv/config";
import dns from "dns";

const forceIPv4Lookup = (hostname, options, callback) => {
  dns.lookup(hostname, { family: 4, all: false }, callback);
};

 
export const sentOtpMail = async ( email,otp) => {
  try {
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

    let transporter = createTransporter(smtpPort, smtpSecure);
    try {
      await transporter.verify();
    } catch (primaryError) {
      const fallbackPort = smtpPort === 587 ? 465 : 587;
      const fallbackSecure = fallbackPort === 465;
      transporter = createTransporter(fallbackPort, fallbackSecure);
      await transporter.verify();
    }

    const mailOptions = {
      from: `"HotDrop Support" <${mailUser}>`,
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
