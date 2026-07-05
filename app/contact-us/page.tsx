import { FaEnvelope, FaTwitter, FaWhatsapp } from "react-icons/fa";
import { FaLinkedin } from "react-icons/fa6";

const CONTACT_EMAIL = "ayobamidolapo419@gmail.com";
const WHATSAPP_NUMBER = "2348164758649";

export default function ContactUsPage() {
  return (
    <main className="min-h-screen bg-bark">
      <div className="px-6 md:px-10 py-16 max-w-2xl mx-auto text-center">
        <p className="font-bold text-[.7rem] tracking-[.2em] uppercase text-ember mb-3">
          Get in touch
        </p>
        <h1
          className="font-black leading-[.95] text-cream"
          style={{ fontSize: "clamp(2rem,4vw,3.2rem)" }}
        >
          Contact us
        </h1>
        <p className="mt-5 text-parch/70 text-[0.95rem] leading-relaxed max-w-md mx-auto">
          Questions, feedback, or something not working right? Reach us directly
          through any of these.
        </p>

        <div className="mt-14 flex flex-col gap-4 max-w-sm mx-auto">
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="flex items-center justify-center gap-3 bg-surface border border-border px-6 py-4 text-parch hover:border-orange/50 transition-colors"
          >
            <FaEnvelope className="text-orange" />
            {CONTACT_EMAIL}
          </a>
          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-3 bg-surface border border-border px-6 py-4 text-parch hover:border-orange/50 transition-colors"
          >
            <FaWhatsapp className="text-orange" />
            Chat on WhatsApp
          </a>
        </div>

        <div className="mt-12 flex justify-center gap-6">
          <a
            href="#"
            className="text-parch/60 hover:text-orange transition-colors text-xl"
          >
            <FaTwitter />
          </a>
          <a
            href="#"
            className="text-parch/60 hover:text-orange transition-colors text-xl"
          >
            <FaLinkedin />
          </a>
        </div>
      </div>
    </main>
  );
}
