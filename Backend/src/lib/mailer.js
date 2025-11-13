import nodemailer from "nodemailer";

// Configure Nodemailer transporter using environment variables
export const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || "smtp.example.com",
  port: Number(process.env.EMAIL_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Optional verify
transporter.verify((err, success) => {
  if (err) {
    console.log("Nodemailer transporter verification failed:", err);
  } else {
    console.log("Nodemailer transporter ready.");
  }
});