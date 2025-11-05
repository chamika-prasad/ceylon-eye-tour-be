import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT) || 587,
  secure: process.env.EMAIL_SECURE === "true", // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// optional: verify connection configuration at startup (logs error but doesn't exit)
transporter.verify().catch((err) => {
  // silent catch to avoid throwing during import; adjust logging as needed
  console.error("Email transporter verify failed:", err.message || err);
});

export default transporter;
