import dotenv from "dotenv";
import transporter from "../config/email.js";

dotenv.config();

const sendEmail = async ({ to, subject, text = "", html = "" }) => {

  const mailFrom = process.env.FROM_EMAIL;

  const mailOptions = {
    from: mailFrom,
    to:"chamikap40@gmail.com",
    subject,
    text,
    html,
  };
  
  try {
    const info = await transporter.sendMail(mailOptions);
    return true;
  } catch (err) {
    console.error("Error sending email:", err);
    return {
      success: false,
      error: err.message || err,
    };
  }
};

/**
 * Convenience helper to send a plain-text email.
 */
const sendSimpleMail = async (to, subject, text, from) =>
  await sendEmail({ to, subject, text, html: "", from });

export default {
  sendEmail,
  sendSimpleMail,
};
