import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import AuthPageShell from "@/components/auth-page-shell";
import LoginForm from "@/components/login-form";
import { getCookieName, verifySessionToken } from "@/lib/auth-server";

export default function LoginPage() {
  const token = cookies().get(getCookieName())?.value;
  const session = verifySessionToken(token);

  if (session.valid) {
    redirect("/workspace");
  }

  return (
    <AuthPageShell
      title="Welcome back"
      subtitle="Sign in to access your workspace."
      footer={{
        text: "Don't have an account?",
        linkText: "Create one",
        href: "/signup"
      }}
    >
      <LoginForm />
    </AuthPageShell>
  );
}
