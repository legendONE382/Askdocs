import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextResponse } from "next/server";

import { POST as loginPost } from "@/app/api/auth/login/route";
import { POST as signupPost } from "@/app/api/auth/signup/route";

function makeRequest(body: unknown): Request {
  return new Request("http://localhost/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });
}

describe("POST /api/auth/login", () => {
  beforeEach(() => {
    process.env.APP_AUTH_SECRET = "test-secret";
  });

  it("rejects missing username or password", async () => {
    const res = await loginPost(makeRequest({ username: "", password: "" }));
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.ok).toBe(false);
  });

  it("rejects short username", async () => {
    const res = await loginPost(makeRequest({ username: "ab", password: "securePass123" }));
    expect(res.status).toBe(400);
  });

  it("rejects weak password", async () => {
    const res = await loginPost(makeRequest({ username: "alice", password: "short" }));
    expect(res.status).toBe(400);
  });

  it("accepts valid credentials and sets session cookie", async () => {
    const res = await loginPost(makeRequest({ username: "alice", password: "securePass123" }));
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.ok).toBe(true);
    expect(data.user.username).toBe("alice");

    const cookieHeader = res.headers.get("set-cookie");
    expect(cookieHeader).toBeTruthy();
    expect(cookieHeader).toContain("askdocs_session");
    expect(cookieHeader).toContain("HttpOnly");
  });
});

describe("POST /api/auth/signup", () => {
  beforeEach(() => {
    process.env.APP_AUTH_SECRET = "test-secret";
  });

  it("rejects short username", async () => {
    const res = await signupPost(makeRequest({ username: "ab", password: "securePass123" }));
    expect(res.status).toBe(400);
  });

  it("rejects weak password", async () => {
    const res = await signupPost(makeRequest({ username: "alice", password: "short" }));
    expect(res.status).toBe(400);
  });

  it("returns 201 with session on successful signup", async () => {
    const res = await signupPost(makeRequest({ username: "newuser", password: "securePass123" }));
    expect(res.status).toBe(201);
    const data = await res.json();
    expect(data.ok).toBe(true);
    expect(data.user.username).toBe("newuser");
  });
});
