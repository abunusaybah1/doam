import SignUpForm from "@/components/auth/SignUpForm";

export default function SignUpPage() {
  return (
    <main className="min-h-screen bg-bark flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        <div className="mb-8">
          <h1 className="font-lora text-3xl text-parch mb-2">
            Join the movement
          </h1>
          <p className="font-barlow text-[.85rem] tracking-wide text-umber">
            Report problems, track solutions, and make your community count.
          </p>
        </div>

        <SignUpForm />
      </div>
    </main>
  );
}
