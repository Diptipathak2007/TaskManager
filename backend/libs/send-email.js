import axios from "axios";
import dotenv from "dotenv";
import { clerkClient } from "@clerk/clerk-sdk-node";

dotenv.config();

const MAILERSEND_API_KEY = process.env.MAILERSEND_API_KEY;
const FROM_EMAIL = process.env.FROM_EMAIL;

/**
 * Send a custom transactional email (e.g., welcome, notification, etc.)
 * @param {string} userId - Clerk user ID
 * @param {string} subject - Email subject
 * @param {string} html - Email HTML body
 */
export const sendEmail = async (userId, subject, html) => {
  try {
    // 🔹 Fetch user details from Clerk
    const user = await clerkClient.users.getUser(userId);
    const to = user.emailAddresses[0].emailAddress;

    // 🔹 Create MailerSend message
    const msg = {
      from: { email: FROM_EMAIL, name: "TaskHub" },
      to: [{ email: to }],
      subject,
      html,
      text: html.replace(/<[^>]+>/g, ""), // plain-text fallback
    };

    // 🔹 Send email
    const response = await axios.post("https://api.mailersend.com/v1/email", msg, {
      headers: {
        Authorization: `Bearer ${MAILERSEND_API_KEY}`,
        "Content-Type": "application/json",
      },
    });

    console.log(`✅ Email sent successfully to ${to}:`, response.status);
    return { success: true };
  } catch (error) {
    console.error("❌ Error sending email:", error.response?.data || error.message);
    return { success: false, error: error.message };
  }
};
