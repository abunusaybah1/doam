"use server";

import { sendEmail } from "@/lib/email";
import { createServiceClient } from "@/lib/supabase/service"; // adjust to your actual import path

export async function sendContactMessage(formData: FormData) {
  // honeypot — a hidden field real users never fill in
  const honeypot = formData.get("company_website") as string;
  if (honeypot) {
    return { success: true };
  }

  const name = (formData.get("name") as string)?.trim();
  const email = (formData.get("email") as string)?.trim();
  const whatsapp = (formData.get("whatsapp") as string)?.trim();
  const subject = (formData.get("subject") as string)?.trim();
  const message = (formData.get("message") as string)?.trim();

  if (!name || !email || !whatsapp || !subject || !message) {
    return { error: "Please fill in all fields." };
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email)) {
    return { error: "Please enter a valid email address." };
  }

  const whatsappPattern = /^\+?[0-9]{11,15}$/;
  if (!whatsappPattern.test(whatsapp)) {
    return { error: "Please enter a valid WhatsApp number." };
  }

  if (message.length > 5000) {
    return { error: "Message is too long." };
  }

  const supabase = await createServiceClient();
  const { error: dbError } = await supabase.from("contact_submissions").insert({
    name,
    email,
    whatsapp,
    subject,
    message,
  });

  if (dbError) {
    console.error("Contact DB insert failed:", dbError);
    return {
      error: "Could not save your message right now. Please try again shortly.",
    };
  }

  const result = await sendEmail({
    to: process.env.GMAIL_USER as string,
    replyTo: email,
    subject: `Contact: ${subject}`,
    html: `
      <p>From ${name} (${email})</p>
      
      <p>${message.replace(/\n/g, "<br />")}</p>
    `,
  });

  if (!result.success) {
    return {
      error: "Could not send your message right now. Please try again shortly.",
    };
  }

  return { success: true };
}
