import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import MainApp from "@/components/main-app";
import { getCookieName, verifySessionToken } from "@/lib/auth-server";

export default function WorkspacePage() {
  const token = cookies().get(getCookieName())?.value;
  const session = verifySessionToken(token);

  if (!session.valid) {
    redirect("/login?reason=session-expired");
  }

  return <MainApp username={session.session.username} />;
}
