import nodemailer from "nodemailer";

// Configure Nodemailer transporter using environment variables
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || "smtp.example.com",
  port: Number(process.env.EMAIL_PORT) || 587,
  secure: String(process.env.EMAIL_PORT) === "465",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Optional verify
transporter.verify((err, success) => {
  if (err) {
    console.warn(
      "Nodemailer transporter verify failed. Check EMAIL_* env vars."
    );
  } else {
    console.log("Nodemailer transporter ready.");
  }
});

export { transporter };