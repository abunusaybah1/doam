import LoginForm from "@/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-bark flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        <div className="mb-8">
          <h1 className="font-lora text-3xl text-parch mb-2">Welcome back</h1>
          <p className="font-barlow text-[.85rem] tracking-wide text-umber">
            Sign in to your account to continue.
          </p>
        </div>

        <LoginForm />
      </div>
    </main>
  );
}
