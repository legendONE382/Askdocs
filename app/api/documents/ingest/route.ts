import { NextResponse } from "next/server";

import { buildChunks } from "@/lib/documents";

const MAX_FILES = 5;
const MAX_FILE_SIZE_BYTES = 8 * 1024 * 1024;

export async function POST(request: Request) {
  const formData = await request.formData();
  const files = formData.getAll("files").filter((item): item is File => item instanceof File);

  if (!files.length) {
    return NextResponse.json({ ok: false, error: "Upload at least one document." }, { status: 400 });
  }

  if (files.length > MAX_FILES) {
    return NextResponse.json({ ok: false, error: `Upload ${MAX_FILES} files or fewer at once.` }, { status: 400 });
  }

  const oversizedFile = files.find((file) => file.size > MAX_FILE_SIZE_BYTES);
  if (oversizedFile) {
    return NextResponse.json({ ok: false, error: `${oversizedFile.name} is larger than 8 MB.` }, { status: 400 });
  }

  try {
    const result = await buildChunks(files);

    if (!result.chunks.length) {
      return NextResponse.json(
        { ok: false, error: "No readable text was found in the uploaded document(s)." },
        { status: 400 }
      );
    }

    return NextResponse.json({ ok: true, ...result });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to index documents.";
    return NextResponse.json({ ok: false, error: message }, { status: 400 });
  }
}
