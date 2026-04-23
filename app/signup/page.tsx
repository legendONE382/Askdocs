import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import SignupForm from "@/components/signup-form";
import { getCookieName, verifySessionToken } from "@/lib/auth-server";

export default function SignupPage() {
  const token = cookies().get(getCookieName())?.value;
  const session = verifySessionToken(token);

  if (session.valid) {
    redirect("/workspace");
  }

  return <SignupForm />;
}
