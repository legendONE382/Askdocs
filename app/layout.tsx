import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AskDocs",
  description: "Analyze documents with Mistral-powered RAG and ask grounded questions."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
