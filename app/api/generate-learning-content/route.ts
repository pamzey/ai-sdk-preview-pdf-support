import { questionsSchema } from "@/lib/schemas";
import { google } from "@ai-sdk/google";
import { streamObject } from "ai";

export const maxDuration = 60;

export async function POST(req: Request) {
  const { files } = await req.json();
  const firstFile = files[0].data;

  const result = streamObject({
    model: google("gemini-1.5-pro-latest"),
    messages: [
      {
        role: "system",
        content: `You are an expert educator. Your task is to analyze a document and create a multiple-choice quiz with 4 questions.
Each question should:
1. Focus on important concepts from the document
2. Have exactly 4 options
3. Have one correct answer
4. Be engaging and educational

Format each question with:
- A clear question statement
- 4 possible answers (only one correct)
- The index (0-3) of the correct answer`,
      },
      {
        role: "user",
        content: [
          {
            type: "text",
            text: "Create a quiz based on this document.",
          },
          {
            type: "file",
            data: firstFile,
            mimeType: "application/pdf",
          },
        ],
      },
    ],
    schema: questionsSchema,
  });

  return result.toTextStreamResponse();
}
