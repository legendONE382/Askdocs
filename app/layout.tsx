import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://askdocs-nine.vercel.app"),
  title: {
    default: "AskDocs — Chat with Your Documents",
    template: "%s · AskDocs"
  },
  description:
    "Upload PDFs, DOCX, TXT, MD, and CSV files. Ask questions against your documents and get grounded answers with source citations.",
  keywords: [
    "AI document Q&A",
    "chat with PDF",
    "document assistant",
    "ask questions from PDF",
    "document research",
    "AI document reader",
    "document analysis",
    "chat with Word documents",
    "document chatbot",
    "grounded answers"
  ],
  authors: [{ name: "AskDocs" }],
  openGraph: {
    title: "AskDocs — Chat with Your Documents",
    description:
      "Upload documents and ask questions. Get answers grounded in your files with source citations.",
    type: "website",
    url: "https://askdocs-nine.vercel.app",
    siteName: "AskDocs",
    locale: "en_US"
  },
  twitter: {
    card: "summary_large_image",
    title: "AskDocs — Chat with Your Documents",
    description:
      "Upload documents and ask questions. Get answers grounded in your files with source citations."
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1
    }
  },
  alternates: {
    canonical: "https://askdocs-nine.vercel.app"
  }
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
