import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

export async function sendEmail({
  to,
  subject,
  html,
  replyTo,
}: {
  to: string;
  subject: string;
  html: string;
  replyTo?: string;
}) {
  try {
    await transporter.sendMail({
      from: `"Do-am" <${process.env.GMAIL_USER}>`,
      to,
      replyTo,
      subject,
      html,
    });
    return { success: true };
  } catch (error) {
    console.error("sendEmail error:", error);
    return { success: false };
  }
}