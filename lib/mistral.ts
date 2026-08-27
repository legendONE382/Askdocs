const MISTRAL_BASE_URL = "https://api.mistral.ai/v1";
const MISTRAL_CHAT_MODEL = process.env.MISTRAL_CHAT_MODEL || "open-mistral-nemo";

function getApiKey(): string {
  const key = process.env.MISTRAL_API_KEY;
  if (!key) {
    throw new Error("MISTRAL_API_KEY is not configured.");
  }
  return key;
}

export async function generateAnswer(context: string, question: string): Promise<string> {
  const response = await fetch(`${MISTRAL_BASE_URL}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getApiKey()}`
    },
    body: JSON.stringify({
      model: MISTRAL_CHAT_MODEL,
      messages: [
        {
          role: "system",
          content:
            "You are AskDocs, an AI assistant that answers questions using the user's uploaded documents.\n\nUse the provided document context to answer the user's question.\n\nDo not invent information that is not supported by the document.\n\nIf the answer cannot be found in the provided context, clearly say that the information is not available in the document.\n\nCite evidence with [1], [2], etc. referencing the numbered context passages."
        },
        {
          role: "user",
          content: `DOCUMENT CONTEXT:\n${context}\n\nUSER QUESTION:\n${question}`
        }
      ],
      temperature: 0.2
    })
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => "Unknown error");
    throw new Error(`Mistral chat request failed with status ${response.status}: ${errorText}`);
  }

  const data = (await response.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };

  return data.choices?.[0]?.message?.content?.trim() || "I do not know based on the provided documents.";
}
