import SignUpForm from "@/components/auth/SignUpForm";

export default function SignUpPage() {
  return (
    <main className="min-h-screen bg-fog flex items-center justify-center px-6 mt-4">
      <div className="w-full max-w-md">
        
        <h1 className="font-playfair font-black text-[2.8rem] leading-[.92] text-bark mb-2">
          Join the
          <br />
          <span className="text-[#F97316] italic">movement.</span>
        </h1>
        <p className="font-lora italic text-umber text-[.95rem] leading-relaxed mb-8">
          Create your account and start solving problems across Nigeria.
        </p>

        <SignUpForm />

        <p className="font-barlow text-[.78rem] tracking-wide text-umber mt-6 mb-6 text-center">
          Already have an account?{" "}
          <a href="/login" className="text-orange font-bold underline">
            Sign in
          </a>
        </p>
      </div>
    </main>
  );
}
