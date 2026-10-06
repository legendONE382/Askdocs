import { type ReactNode } from "react";
import Link from "next/link";

type AuthPageShellProps = {
  title: string;
  subtitle: string;
  footer: {
    text: string;
    linkText: string;
    href: string;
  };
  children: ReactNode;
};

export default function AuthPageShell({
  title,
  subtitle,
  footer,
  children
}: AuthPageShellProps) {
  return (
    <main className="mx-auto flex min-h-screen max-w-md items-center justify-center px-4 py-10 sm:px-6">
      <div className="w-full">
        <div className="mb-8 text-center">
          <Link href="/" className="text-xl font-semibold text-slate-50">
            AskDocs
          </Link>
        </div>
        <div className="panel w-full p-6 sm:p-8">
          <div className="mb-6">
            <h1 className="mb-1 text-2xl font-semibold text-slate-50">
              {title}
            </h1>
            <p className="text-sm text-slate-300">{subtitle}</p>
          </div>
          {children}
        </div>
        <p className="mt-4 text-center text-sm text-slate-400">
          {footer.text}{" "}
          <Link href={footer.href} className="font-medium text-accent underline underline-offset-2">
            {footer.linkText}
          </Link>
        </p>
      </div>
    </main>
  );
}
