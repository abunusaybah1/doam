import Link from "next/link";

export default function CtaBand() {
  return (
    <section className="bg-orange px-5 py-16 md:px-10 md:py-20 text-center">
      <h2 className="font-playfair text-[2rem] sm:text-[2.5rem] md:text-[3rem] font-black text-parch leading-[1.1] mb-4">
        Something wrong in your community or you want to explore reported
        problems?
      </h2>
      <p className="font-serif-body font-light text-[0.95rem] text-parch leading-[1.8] mb-8 max-w-lg mx-auto">
        Join Do&minus;am and be part of the solution. Become a part of the
        movement, and see real change happen in the local communities.
      </p>
      <Link
        href="/auth/login"
        className="inline-block bg-bark text-[#f5f5dc] text-[0.75rem] uppercase tracking-widest px-8 py-4 hover:bg-surface transition-colors"
      >
        Get Started!
      </Link>
    </section>
  );
}
