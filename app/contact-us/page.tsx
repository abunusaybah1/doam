import {
  // FaEnvelope,
  FaWhatsapp,
} from "react-icons/fa";
import ContactForm from "@/components/contact/ContactForm";

// const CONTACT_EMAIL = "ayobamidolapo419@gmail.com";
const WHATSAPP_NUMBER = "2348164758649";

export default function ContactUsPage() {
  return (
    <main className="min-h-screen bg-bark">
      <div className="px-6 md:px-10 py-16 max-w-xl mx-auto">
        <div className="text-center mb-12">
          <h1
            className="font-black leading-[.95] text-orange"
            style={{ fontSize: "clamp(2rem,4vw,3.2rem)" }}
          >
            Contact us
          </h1>
          <p className="mt-5 text-parch/70 text-[0.95rem] leading-relaxed max-w-md mx-auto">
            Questions, feedback, or something not working right? Send us a
            message and we&apos;ll get back to you.
          </p>
        </div>

        <div className="bg-surface border border-border px-6 py-8">
          <ContactForm />
        </div>

        <div className="mt-8 flex flex-col gap-3">
          {/* <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="flex-1 flex items-center justify-center gap-2 border border-border px-5 py-3 text-parch/70 hover:border-orange/50 hover:text-parch transition-colors text-[0.8rem]"
          >
            <FaEnvelope className="text-orange" />
            {CONTACT_EMAIL}
          </a> */}
          <p className="text-sm text-parch/70">
            ALternatively, reach out to us on WhatsApp:
          </p>
          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-2 border border-border px-5 py-3 text-parch/70 hover:border-orange/50 hover:text-parch transition-colors text-[0.8rem]"
          >
            <FaWhatsapp className="text-orange" />
            WhatsApp
          </a>
        </div>
      </div>
    </main>
  );
}
