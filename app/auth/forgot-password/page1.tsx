import { Suspense } from "react";
import ForgotPasswordClient from "./page";

export default function ForgotPasswordPage() {
  return (
    <Suspense>
      <ForgotPasswordClient />
    </Suspense>
  );
}
