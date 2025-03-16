"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { Trophy } from "lucide-react";

interface MatchingProps {
  pairs: Array<{ term: string; definition: string }>;
}

interface MatchingCard {
  id: number;
  content: string;
  type: "term" | "definition";
  isFlipped: boolean;
  isMatched: boolean;
  pairId: number;
}

export default function Matching({ pairs }: MatchingProps) {
  const [cards, setCards] = useState<MatchingCard[]>([]);
  const [flippedCards, setFlippedCards] = useState<MatchingCard[]>([]);
  const [isComplete, setIsComplete] = useState(false);
  const [moves, setMoves] = useState(0);

  useEffect(() => {
    const initializeCards = () => {
      const shuffledCards: MatchingCard[] = pairs.flatMap((pair, index) => [
        {
          id: index * 2,
          content: pair.term,
          type: "term",
          isFlipped: false,
          isMatched: false,
          pairId: index,
        },
        {
          id: index * 2 + 1,
          content: pair.definition,
          type: "definition",
          isFlipped: false,
          isMatched: false,
          pairId: index,
        },
      ]);

      // Fisher-Yates shuffle
      for (let i = shuffledCards.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledCards[i], shuffledCards[j]] = [shuffledCards[j], shuffledCards[i]];
      }

      setCards(shuffledCards);
      setFlippedCards([]);
      setIsComplete(false);
      setMoves(0);
    };

    if (pairs.length) {
      initializeCards();
    }
  }, [pairs]);

  const handleCardClick = (clickedCard: MatchingCard) => {
    if (
      clickedCard.isMatched ||
      clickedCard.isFlipped ||
      flippedCards.length === 2
    ) {
      return;
    }

    const newCards = cards.map((card) =>
      card.id === clickedCard.id ? { ...card, isFlipped: true } : card
    );
    setCards(newCards);

    const newFlippedCards = [...flippedCards, clickedCard];
    setFlippedCards(newFlippedCards);

    if (newFlippedCards.length === 2) {
      setMoves((prev) => prev + 1);
      const [firstCard, secondCard] = newFlippedCards;

      if (firstCard.pairId === secondCard.pairId) {
        // Match found
        setTimeout(() => {
          setCards((prevCards) =>
            prevCards.map((card) =>
              card.id === firstCard.id || card.id === secondCard.id
                ? { ...card, isMatched: true }
                : card
            )
          );
          setFlippedCards([]);

          // Check if game is complete
          const allMatched = newCards.every((card) =>
            card.id === firstCard.id || card.id === secondCard.id || card.isMatched
          );

          if (allMatched) {
            setIsComplete(true);
            confetti({
              particleCount: 100,
              spread: 70,
              origin: { y: 0.6 },
            });
          }
        }, 500);
      } else {
        // No match
        setTimeout(() => {
          setCards((prevCards) =>
            prevCards.map((card) =>
              card.id === firstCard.id || card.id === secondCard.id
                ? { ...card, isFlipped: false }
                : card
            )
          );
          setFlippedCards([]);
        }, 1000);
      }
    }
  };

  const resetGame = () => {
    const shuffledCards: MatchingCard[] = pairs.flatMap((pair, index) => [
      {
        id: index * 2,
        content: pair.term,
        type: "term",
        isFlipped: false,
        isMatched: false,
        pairId: index,
      },
      {
        id: index * 2 + 1,
        content: pair.definition,
        type: "definition",
        isFlipped: false,
        isMatched: false,
        pairId: index,
      },
    ]);

    // Fisher-Yates shuffle
    for (let i = shuffledCards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledCards[i], shuffledCards[j]] = [shuffledCards[j], shuffledCards[i]];
    }

    setCards(shuffledCards);
    setFlippedCards([]);
    setIsComplete(false);
    setMoves(0);
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Matching Game</h2>
        <div className="text-sm text-muted-foreground">Moves: {moves}</div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <AnimatePresence>
          {cards.map((card) => (
            <motion.div
              key={card.id}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Card
                className={`h-32 p-4 cursor-pointer flex items-center justify-center text-center transition-colors ${
                  card.isMatched
                    ? "bg-primary/10 border-primary"
                    : card.isFlipped
                    ? "bg-muted"
                    : "hover:bg-muted/50"
                }`}
                onClick={() => handleCardClick(card)}
              >
                {card.isFlipped || card.isMatched ? (
                  <div className="text-sm font-medium">{card.content}</div>
                ) : (
                  <div className="text-sm text-muted-foreground">Click to reveal</div>
                )}
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {isComplete && (
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="flex flex-col items-center justify-center space-y-4 p-8 bg-primary/10 rounded-lg"
        >
          <Trophy className="h-12 w-12 text-primary" />
          <h3 className="text-xl font-bold">Congratulations!</h3>
          <p className="text-muted-foreground">
            You completed the matching game in {moves} moves!
          </p>
          <Button onClick={resetGame}>Play Again</Button>
        </motion.div>
      )}
    </div>
  );
}
