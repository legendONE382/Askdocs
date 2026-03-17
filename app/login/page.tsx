import LoginForm from "./LoginForm";

export default function LoginPage({
  searchParams
}: {
  searchParams?: { next?: string | string[] };
}) {
  const next = Array.isArray(searchParams?.next)
    ? searchParams?.next[0]
    : searchParams?.next;
  const nextPath = typeof next === "string" && next.startsWith("/") ? next : "/";

  return <LoginForm nextPath={nextPath} />;
}
