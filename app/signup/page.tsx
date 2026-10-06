import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import AuthPageShell from "@/components/auth-page-shell";
import SignupForm from "@/components/signup-form";
import { getCookieName, verifySessionToken } from "@/lib/auth-server";

export default function SignupPage() {
  const token = cookies().get(getCookieName())?.value;
  const session = verifySessionToken(token);

  if (session.valid) {
    redirect("/workspace");
  }

  return (
    <AuthPageShell
      title="Create your account"
      subtitle="Start a workspace and upload documents in minutes."
      footer={{
        text: "Already have an account?",
        linkText: "Sign in",
        href: "/login"
      }}
    >
      <SignupForm />
    </AuthPageShell>
  );
}
