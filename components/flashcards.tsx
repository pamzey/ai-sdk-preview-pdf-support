"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence, Transition, Variants } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChevronLeft, ChevronRight, RotateCw } from "lucide-react";

interface FlashcardsProps {
  cards: Array<{ front: string; back: string }>;
}

export default function Flashcards({ cards }: FlashcardsProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const handleNext = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev + 1) % cards.length);
  };

  const handlePrevious = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev - 1 + cards.length) % cards.length);
  };

  const handleFlip = () => {
    setIsFlipped((prev) => !prev);
  };

  const flashingVariants: Variants = {
    idle: { 
      scale: 1,
      boxShadow: "0 0 0 0 rgba(59, 130, 246, 0)"
    },
    flash: {
      scale: [1, 1.05, 1],
      boxShadow: [
        "0 0 0 0 rgba(59, 130, 246, 0)",
        "0 0 15px 5px rgba(59, 130, 246, 0.5)",
        "0 0 0 0 rgba(59, 130, 246, 0)"
      ],
      transition: {
        duration: 1,
        times: [0, 0.5, 1],
        repeat: Infinity,
        repeatType: "loop",
        ease: "easeInOut"
      }
    }
  };

  const cardTransition: Transition = {
    duration: 0.5,
    type: "tween"
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">
          Flashcard {currentIndex + 1} of {cards.length}
        </h2>
      </div>

      <div className="relative w-full h-[300px] flex items-center justify-center perspective-1000">
        <AnimatePresence mode="wait">
          <motion.div
            key={`card-${currentIndex}-${isFlipped ? 'flipped' : 'unflipped'}`}
            className="absolute w-full max-w-md h-full"
            initial="idle"
            animate="flash"
            variants={flashingVariants}
            transition={cardTransition}
            exit={{ 
              opacity: 0,
              scale: 0.9,
              transition: { duration: 0.3 }
            }}
          >
            <Card 
              className="w-full h-full flex items-center justify-center p-8 cursor-pointer text-center text-lg font-medium backface-hidden"
              onClick={handleFlip}
            >
              <motion.div
                key={`content-${currentIndex}`}
                initial={{ rotateY: 0 }}
                animate={{ rotateY: isFlipped ? 180 : 0 }}
                transition={cardTransition}
                className="w-full h-full flex items-center justify-center"
              >
                {!isFlipped ? cards[currentIndex].front : cards[currentIndex].back}
              </motion.div>
            </Card>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex justify-center space-x-4">
        <Button
          variant="outline"
          size="icon"
          onClick={handlePrevious}
          disabled={currentIndex === 0}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="icon" onClick={handleFlip}>
          <RotateCw className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={handleNext}
          disabled={currentIndex === cards.length - 1}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
