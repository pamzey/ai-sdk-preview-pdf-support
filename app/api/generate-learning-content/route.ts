import { questionsSchema } from "@/lib/schemas";
import { google } from "@ai-sdk/google";
import { streamObject } from "ai";

// Configure route segment config for larger files and longer timeouts
export const runtime = 'edge'; // Use edge runtime for better performance
export const maxDuration = 300; // Set maximum duration to 5 minutes
export const dynamic = 'force-dynamic'; // Ensure route is not cached

// Configure bodyParser to handle larger files
export const fetchCache = 'force-no-store';
export const preferredRegion = 'auto';

export async function POST(req: Request) {
  try {
    const { files } = await req.json();
    
    if (!files || !files[0] || !files[0].data) {
      return new Response(JSON.stringify({ error: 'No file data provided' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

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
  } catch (error) {
    console.error('API Error:', error);
    return new Response(JSON.stringify({ error: 'Failed to process request' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}
