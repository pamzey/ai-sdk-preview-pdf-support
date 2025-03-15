"use client";
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function QuizPage() {
  const [pdfUrl, setPdfUrl] = useState('');
  const [quizData, setQuizData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handlePdfUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPdfUrl(e.target.value);
  };

  const handleGenerateQuiz = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/generate-quiz', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ pdfUrl }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setQuizData(data);
    } catch (err: any) {
      setError(err.message || 'An error occurred while generating the quiz.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Quiz</h1>

      <Card>
        <CardHeader>
          <CardTitle>Generate Quiz from PDF</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <label htmlFor="pdfUrl" className="block text-sm font-medium text-gray-700">
              PDF URL:
            </label>
            <Input
              type="text"
              id="pdfUrl"
              value={pdfUrl}
              onChange={handlePdfUrlChange}
              placeholder="Enter PDF URL"
            />
          </div>

          <Button onClick={handleGenerateQuiz} disabled={loading}>
            {loading ? 'Generating...' : 'Generate Quiz'}
          </Button>

          {error && <p className="text-red-500 mt-2">Error: {error}</p>}

          {quizData && (
            <div>
              <h2 className="text-xl font-semibold mt-4 mb-2">Quiz Generated</h2>
              {/* Display quiz data here */}
              <pre>{JSON.stringify(quizData, null, 2)}</pre>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
