import { cookies } from "next/headers";
import { getCookieName, verifySessionToken } from "@/lib/auth-server";
import LandingPage from "@/components/landing-page";

export const dynamic = "force-dynamic";

export default function HomePage() {
  const token = cookies().get(getCookieName())?.value;
  const session = verifySessionToken(token);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            name: "AskDocs",
            applicationCategory: "BusinessApplication",
            operatingSystem: "Web",
            description:
              "Upload documents and ask questions. Get answers grounded in your files with source citations.",
            url: "https://askdocs-nine.vercel.app",
            offers: {
              "@type": "Offer",
              price: "0",
              priceCurrency: "USD"
            }
          })
        }}
      />
      <LandingPage isLoggedIn={session.valid} />
    </>
  );
}
