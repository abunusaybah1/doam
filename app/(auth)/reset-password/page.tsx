import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import ResetPasswordForm from "@/components/auth/ResetPasswordForm";

export default async function ResetPasswordPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/forgot-password?error=invalid_link");

  return (
    <main className="min-h-screen bg-bark flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <h1 className=" text-3xl md:text-4xl text-parch mb-2">
          Set new password
        </h1>
        <p className="text-parch/50 text-sm mb-8">
          Choose a strong password for your account.
        </p>
        <ResetPasswordForm />
      </div>
    </main>
  );
}
