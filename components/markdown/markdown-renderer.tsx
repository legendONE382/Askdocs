"use client";

type MarkdownRendererProps = {
  content: string;
  className?: string;
};

export function MarkdownRenderer({ content, className }: MarkdownRendererProps) {
  const html = formatMarkdown(content);

  return (
    <div
      className={className}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

function formatMarkdown(text: string): string {
  const lines = text.split("\n");

  const htmlLines = lines.map((line) => {
    const trimmed = line.trim();

    if (!trimmed) {
      return "<br />";
    }

    if (trimmed.startsWith("# ")) {
      return `<h1>${escapeHtml(trimmed.slice(2))}</h1>`;
    }

    if (trimmed.startsWith("## ")) {
      return `<h2>${escapeHtml(trimmed.slice(3))}</h2>`;
    }

    if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
      return `<li>${formatInline(escapeHtml(trimmed.slice(2)))}</li>`;
    }

    return `<p>${formatInline(escapeHtml(trimmed))}</p>`;
  });

  return htmlLines.join("");
}

function formatInline(html: string): string {
  return html
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/`(.+?)`/g, "<code>$1</code>");
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
