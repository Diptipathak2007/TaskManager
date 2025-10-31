import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const MAILERSEND_API_KEY = process.env.SENDGRID_API;
const FROM_EMAIL = process.env.FROM_EMAIL;

/**
 * Send email using MailerSend API
 * @param {string} to - Receiver email
 * @param {string} subject - Email subject
 * @param {string} html - Email HTML body
 */
export const sendEmail = async (to, subject, html) => {
  const msg = {
    from: {
      email: FROM_EMAIL,
      name: "TaskHub", // same as your SendGrid version
    },
    to: [
      {
        email: to,
      },
    ],
    subject,
    html,
    text: html.replace(/<[^>]+>/g, ""), // fallback text version
  };

  try {
    const response = await axios.post("https://api.mailersend.com/v1/email", msg, {
      headers: {
        Authorization: `Bearer ${MAILERSEND_API_KEY}`,
        "Content-Type": "application/json",
      },
    });

    console.log("✅ Email sent successfully:", response.status);
    return true;
  } catch (error) {
    console.error("❌ Error sending email:", error.response?.data || error.message);
    return false;
  }
};
