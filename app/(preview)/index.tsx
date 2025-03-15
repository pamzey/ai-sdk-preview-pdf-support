"use client";
import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function Home() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-8">Welcome to the Learning Platform</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <Link href="/quiz">
          <div className="p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300 bg-gray-100 dark:bg-gray-800">
            <h2 className="text-xl font-semibold mb-2">Quiz</h2>
            <p className="text-gray-700 dark:text-gray-300">Test your knowledge with quizzes.</p>
            <Button className="mt-4" variant="default">Start Quiz</Button>
          </div>
        </Link>

        <Link href="/flashcards">
          <div className="p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300 bg-gray-100 dark:bg-gray-800">
            <h2 className="text-xl font-semibold mb-2">Flashcards</h2>
            <p className="text-gray-700 dark:text-gray-300">Learn with interactive flashcards.</p>
            <Button className="mt-4" variant="default">View Flashcards</Button>
          </div>
        </Link>

        <Link href="/matching">
          <div className="p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300 bg-gray-100 dark:bg-gray-800">
            <h2 className="text-xl font-semibold mb-2">Matching</h2>
            <p className="text-gray-700 dark:text-gray-300">Match terms and definitions.</p>
            <Button className="mt-4" variant="default">Start Matching</Button>
          </div>
        </Link>

        <Link href="/(preview)">
          <div className="p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300 bg-gray-100 dark:bg-gray-800">
            <h2 className="text-xl font-semibold mb-2">Generate Quiz</h2>
            <p className="text-gray-700 dark:text-gray-300">Generate a quiz from a PDF.</p>
            <Button className="mt-4" variant="default">Generate</Button>
          </div>
        </Link>
      </div>
    </div>
  );
}
