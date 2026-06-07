const PROJECT_REGEX = /^[a-zA-Z0-9_-]{1,64}$/;

export const LIMITS = {
  maxFiles: 8,
  maxFileBytes: 8 * 1024 * 1024,
  maxChunksPerRequest: 300,
  maxQuestionLength: 1500,
  maxContextChars: 12000
};

export class AppError extends Error {
  status: number;
  expose: boolean;

  constructor(message: string, status = 400, expose = true) {
    super(message);
    this.status = status;
    this.expose = expose;
  }
}

export function sanitizeProject(input: unknown): string {
  const value = String(input || "default").trim() || "default";
  if (!PROJECT_REGEX.test(value)) {
    throw new AppError(
      "Invalid project name. Use 1-64 chars: letters, numbers, underscore, hyphen.",
      400,
      true
    );
  }
  return value;
}

export function sanitizeFileName(name: string): string {
  return name.replace(/[^a-zA-Z0-9._-]/g, "_").slice(0, 120);
}

export function safeErrorMessage(error: unknown): { status: number; message: string } {
  if (error instanceof AppError) {
    return {
      status: error.status,
      message: error.expose ? error.message : "Request failed."
    };
  }

  console.error("Unhandled API error", error);
  return { status: 500, message: "An unexpected server error occurred." };
}
