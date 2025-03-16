"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, XCircle, Trophy } from "lucide-react";
import confetti from "canvas-confetti";

interface QuizProps {
  questions: Array<{
    question: string;
    options: string[];
    correctIndex: number;
  }>;
  title: string;
}

export default function Quiz({ questions, title }: QuizProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  const handleAnswer = (index: number) => {
    if (isAnswered) return;

    setSelectedAnswer(index);
    setIsAnswered(true);

    if (index === questions[currentQuestion].correctIndex) {
      setScore((prev) => prev + 1);
    }

    if (currentQuestion === questions.length - 1) {
      setIsComplete(true);
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    }
  };

  const handleNext = () => {
    setCurrentQuestion((prev) => prev + 1);
    setSelectedAnswer(null);
    setIsAnswered(false);
  };

  const handleRestart = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setIsAnswered(false);
    setScore(0);
    setIsComplete(false);
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">{title}</h2>
        <div className="text-sm text-muted-foreground">
          Question {currentQuestion + 1} of {questions.length}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestion}
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -20, opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="p-6 space-y-6">
            <h3 className="text-lg font-medium">
              {questions[currentQuestion].question}
            </h3>
            <div className="grid gap-4">
              {questions[currentQuestion].options.map((option, index) => (
                <Button
                  key={index}
                  variant={
                    isAnswered
                      ? index === questions[currentQuestion].correctIndex
                        ? "default"
                        : index === selectedAnswer
                        ? "destructive"
                        : "outline"
                      : selectedAnswer === index
                      ? "default"
                      : "outline"
                  }
                  className="justify-start h-auto p-4 text-left"
                  onClick={() => handleAnswer(index)}
                  disabled={isAnswered}
                >
                  <div className="flex items-center gap-4">
                    {isAnswered && (
                      <>
                        {index === questions[currentQuestion].correctIndex ? (
                          <CheckCircle className="h-5 w-5 text-primary-foreground" />
                        ) : index === selectedAnswer ? (
                          <XCircle className="h-5 w-5" />
                        ) : null}
                      </>
                    )}
                    {option}
                  </div>
                </Button>
              ))}
            </div>
          </Card>
        </motion.div>
      </AnimatePresence>

      {isAnswered && !isComplete && (
        <div className="flex justify-end">
          <Button onClick={handleNext}>Next Question</Button>
        </div>
      )}

      {isComplete && (
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="flex flex-col items-center justify-center space-y-4 p-8 bg-primary/10 rounded-lg"
        >
          <Trophy className="h-12 w-12 text-primary" />
          <h3 className="text-xl font-bold">Quiz Complete!</h3>
          <p className="text-muted-foreground">
            You scored {score} out of {questions.length}!
          </p>
          <Button onClick={handleRestart}>Try Again</Button>
        </motion.div>
      )}
    </div>
  );
}
