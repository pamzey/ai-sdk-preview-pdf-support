import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";
import { questionsSchema } from "@/lib/schemas";

// Configure the runtime to use edge for better performance
export const runtime = "edge";

interface FileData {
  data: string;
  name: string;
  type: string;
}

interface RequestBody {
  files: FileData[];
}

export async function POST(req: Request) {
  console.log("Starting PDF content generation process");

  try {
    // Parse the request body
    const body = await req.json() as RequestBody;
    console.log("Request body received:", JSON.stringify(body, null, 2));

    const files = body.files;

    if (!files || !files.length) {
      console.error("No files provided in the request");
      return new Response(JSON.stringify({
        error: "No files provided"
      }), { 
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    const file = files[0];
    console.log("First file details:", JSON.stringify(file, null, 2));

    if (!file.data || !file.data.includes("base64,")) {
      console.error("Invalid file data format");
      return new Response(JSON.stringify({
        error: "Invalid file data"
      }), { 
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    // Extract base64 data
    const base64Data = file.data.split("base64,")[1];
    console.log(`Base64 data length: ${base64Data.length} characters`);

    let pdfContent;
    try {
      pdfContent = atob(base64Data);
      console.log(`Decoded PDF content length: ${pdfContent.length} characters`);
    } catch (decodeError) {
      console.error("Failed to decode base64 data:", decodeError);
      return new Response(JSON.stringify({
        error: "Failed to decode file data",
        details: decodeError instanceof Error ? decodeError.message : "Unknown decoding error"
      }), { 
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    // Validate API key
    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
    if (!apiKey) {
      console.error("Missing Google API key in environment variables");
      return new Response(JSON.stringify({
        error: "Missing Google API key",
        details: "No API key found in environment variables"
      }), { 
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }

    // Initialize Google AI
    let genAI;
    try {
      genAI = new GoogleGenerativeAI(apiKey);
      console.log("Google AI client initialized successfully");
    } catch (initError) {
      console.error("Failed to initialize GoogleGenerativeAI:", initError);
      return new Response(JSON.stringify({
        error: "Failed to initialize Google AI",
        details: initError instanceof Error ? initError.message : "Unknown initialization error"
      }), { 
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }

    // Get the model
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-pro-latest",
      safetySettings: [
        {
          category: HarmCategory.HARM_CATEGORY_HARASSMENT,
          threshold: HarmBlockThreshold.BLOCK_NONE
        },
        {
          category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
          threshold: HarmBlockThreshold.BLOCK_NONE
        },
        {
          category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
          threshold: HarmBlockThreshold.BLOCK_NONE
        },
        {
          category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
          threshold: HarmBlockThreshold.BLOCK_NONE
        }
      ]
    });

    // Prepare the prompt with clear instructions
    const prompt = `You are an educational content creator. Based on the following PDF content, create 4 multiple-choice questions that test deep understanding of key concepts. 

Content: ${pdfContent.slice(0, 5000)}

Requirements for each question:
- Clear, concise question that tests comprehension
- 4 distinct answer options
- Clearly indicate the correct answer index (0-3)
- Format strictly as JSON array of objects

JSON Format Example:
[
  {
    "question": "What is the main concept?",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctIndex": 1
  },
  ...
]

Please generate the questions. IMPORTANT: Respond ONLY with the JSON array, nothing else.`;

    try {
      // Generate content with comprehensive error handling
      console.log("Attempting to generate content with prompt");
      const result = await model.generateContent(prompt);
      console.log("Content generation completed");

      const response = result.response;
      const text = response.text();
      console.log("Generated text:", text);

      // Remove any markdown code block formatting and extra whitespace
      const cleanedText = text.replace(/```(json)?/g, '').trim();
      console.log("Cleaned text:", cleanedText);

      // Validate the response
      let parsed;
      try {
        parsed = questionsSchema.parse(JSON.parse(cleanedText));
        console.log("Successfully parsed questions:", JSON.stringify(parsed, null, 2));
      } catch (parseError) {
        console.error("Failed to parse generated questions:", parseError);
        return new Response(JSON.stringify({
          error: "Failed to parse generated questions",
          details: parseError instanceof Error ? parseError.message : "Unknown parsing error",
          rawResponse: cleanedText
        }), { 
          status: 500,
          headers: { "Content-Type": "application/json" }
        });
      }
      
      return new Response(JSON.stringify(parsed), {
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-cache, no-transform",
        },
      });
    } catch (error) {
      console.error("Unexpected error in content generation:", error);
      return new Response(
        JSON.stringify({
          error: "Unexpected error in content generation",
          details: error instanceof Error ? error.message : "Unknown error",
        }),
        {
          status: 500,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }
  } catch (error) {
    console.error("Error processing request:", error);
    return new Response(
      JSON.stringify({
        error: "Failed to process the request",
        details: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}
