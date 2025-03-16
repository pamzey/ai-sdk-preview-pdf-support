import { z } from "zod";

export const questionSchema = z.object({
  question: z.string(),
  options: z
    .array(z.string())
    .length(4)
    .describe(
      "Four possible answers to the question. Only one should be correct. They should all be of equal lengths.",
    ),
  correctIndex: z
    .number()
    .min(0)
    .max(3)
    .describe(
      "The index of the correct answer in the options array (0-3)",
    ),
});

export type Question = z.infer<typeof questionSchema>;

export const questionsSchema = z.array(questionSchema).length(4);

export const flashcardSchema = z.object({
  front: z.string(),
  back: z.string(),
});

export type Flashcard = z.infer<typeof flashcardSchema>;

export const flashcardsSchema = z.array(flashcardSchema).length(4);

export const matchingSchema = z.object({
  term: z.string(),
  definition: z.string(),
});

export type Matching = z.infer<typeof matchingSchema>;

export const matchingSchemaArray = z.array(matchingSchema).length(4);

export const learningContentSchema = z.object({
  quiz: questionsSchema,
  flashcards: flashcardsSchema,
  matching: matchingSchemaArray,
});
