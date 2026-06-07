import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import LoginForm from "@/components/login-form";
import { getCookieName, verifySessionToken } from "@/lib/auth-server";

export default function LoginPage() {
  const token = cookies().get(getCookieName())?.value;
  const session = verifySessionToken(token);

  if (session.valid) {
    redirect("/workspace");
  }

  return <LoginForm />;
}
