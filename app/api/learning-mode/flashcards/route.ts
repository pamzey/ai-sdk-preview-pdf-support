import { NextResponse } from 'next/server';

const flashcardData = [
  { question: "What is the capital of France?", answer: "Paris" },
  { question: "What is 2 + 2?", answer: "4" },
];

export async function GET(request: Request) {
  return NextResponse.json(flashcardData);
}
