import ForgotPasswordForm from "@/components/auth/ForgotPasswordForm";

type PageProps = {
  searchParams: Promise<{
    error?: string;
  }>;
};

export default async function ForgotPasswordPage({ searchParams }: PageProps) {
  const { error } = await searchParams;

  return <ForgotPasswordForm urlError={error} />;
}
