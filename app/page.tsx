import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { getCookieName, verifySessionToken } from "@/lib/auth-server";

export default function HomePage() {
  const token = cookies().get(getCookieName())?.value;
  const session = verifySessionToken(token);

  if (session.valid) {
    redirect("/workspace");
  }

  redirect("/login");
}
