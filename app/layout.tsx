import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AskDocs | AI Document Answers",
  description: "AskDocs by Estech Solutions turns uploaded documents into fast, grounded AI answers for teams."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
