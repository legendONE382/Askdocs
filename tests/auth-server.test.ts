import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  createSession,
  getCookieName,
  validatePasswordStrength,
  validateUsername,
  verifySessionToken
} from "@/lib/auth-server";

const TEST_SECRET = "test-secret-for-unit-tests-only";

beforeEach(() => {
  process.env.APP_AUTH_SECRET = TEST_SECRET;
});

describe("validateUsername", () => {
  it("normalizes and accepts valid usernames", () => {
    expect(validateUsername("  Alice  ")).toBe(true);
    expect(validateUsername("BOB")).toBe(true);
    expect(validateUsername("a")).toBe(false); // too short
    expect(validateUsername("  ")).toBe(false); // empty after trim
  });
});

describe("validatePasswordStrength", () => {
  it("rejects weak passwords", () => {
    expect(validatePasswordStrength("short")).toBe(false);
    expect(validatePasswordStrength("alllowercase1")).toBe(true);
    expect(validatePasswordStrength("ALLUPPERCASE1")).toBe(true);
    expect(validatePasswordStrength("NoNumbers!")).toBe(false);
    expect(validatePasswordStrength("")).toBe(false);
  });

  it("accepts passwords with letters, numbers, and minimum length", () => {
    expect(validatePasswordStrength("securePass123")).toBe(true);
    expect(validatePasswordStrength("aB1")).toBe(false);
  });
});

describe("createSession", () => {
  it("creates a token with normalized username", () => {
    const session = createSession({ username: "  Alice  " });
    expect(session.username).toBe("alice");
    expect(session.token).toContain(".");
    expect(session.expiresAt).toBeGreaterThan(Date.now());
  });

  it("returns consistent cookie name", () => {
    expect(getCookieName()).toBe("askdocs_session");
  });
});

describe("verifySessionToken", () => {
  it("rejects missing token", () => {
    const result = verifySessionToken(undefined);
    expect(result.valid).toBe(false);
  });

  it("rejects tampered token", () => {
    const session = createSession({ username: "alice" });
    const tampered = session.token.slice(0, -1) + "x";
    const result = verifySessionToken(tampered);
    expect(result.valid).toBe(false);
  });

  it("accepts a valid token and returns session payload", () => {
    const session = createSession({ username: "alice" });
    const result = verifySessionToken(session.token);
    expect(result.valid).toBe(true);
    if (result.valid) {
      expect(result.session.username).toBe("alice");
      expect(result.session.userId).toBe("alice");
    }
  });

  it("rejects expired tokens", () => {
    vi.useFakeTimers();
    const session = createSession({ username: "alice" });

    // Fast-forward past TTL (12 hours)
    vi.advanceTimersByTime(1000 * 60 * 60 * 12 + 1000);

    const result = verifySessionToken(session.token);
    expect(result.valid).toBe(false);
    vi.useRealTimers();
  });

  it("rejects tokens signed with a different secret", () => {
    // Save current secret, change it, then try to verify a token created with old secret
    const session = createSession({ username: "alice" });
    process.env.APP_AUTH_SECRET = "a-completely-different-secret";
    const result = verifySessionToken(session.token);
    expect(result.valid).toBe(false);
    // Restore
    process.env.APP_AUTH_SECRET = TEST_SECRET;
  });

  it("rejects malformed token strings", () => {
    expect(verifySessionToken("not-a-valid-token")).toEqual({ valid: false });
    expect(verifySessionToken("only-one-part")).toEqual({ valid: false });
    expect(verifySessionToken("")).toEqual({ valid: false });
  });
});
