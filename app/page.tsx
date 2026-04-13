export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col items-center justify-center gap-6 p-6 text-center">
      <h1 className="text-4xl font-semibold">AskDocs</h1>
      <p className="text-slate-300">
        Rebuilt as a clean slate with no authentication and no API routes.
      </p>
      <section className="panel w-full max-w-xl p-6 text-left">
        <h2 className="mb-3 text-lg font-semibold">What changed</h2>
        <ul className="list-disc space-y-2 pl-5 text-sm text-slate-300">
          <li>Removed all login and signup logic.</li>
          <li>Removed the previous app and API route implementations.</li>
          <li>Kept a single, simple homepage to start rebuilding from scratch.</li>
        </ul>
      </section>
    </main>
  );
}
