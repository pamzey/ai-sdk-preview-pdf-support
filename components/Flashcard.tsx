import React, { useState, useEffect } from 'react';

interface FlashcardProps {
  question: string;
  answer: string;
}

const Flashcard: React.FC<FlashcardProps> = ({ question, answer }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleClick = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <div
      onClick={handleClick}
      className={`w-64 h-40 bg-white rounded-lg shadow-md p-4 flex items-center justify-center cursor-pointer transition-transform duration-500 ${
        isFlipped ? 'transform rotate-y-180' : ''
      }`}
    >
      <div className="absolute inset-0">
        <div className={`w-full h-full flex items-center justify-center ${isFlipped ? 'hidden' : ''}`}>
          <p className="text-lg font-semibold text-gray-800">{question}</p>
        </div>
        <div className={`w-full h-full flex items-center justify-center transform rotate-y-180 ${!isFlipped ? 'hidden' : ''}`}>
          <p className="text-lg font-semibold text-gray-800">{answer}</p>
        </div>
      </div>
    </div>
  );
};

export default function Flashcards() {
  const [flashcards, setFlashcards] = useState<FlashcardProps[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFlashcards() {
      try {
        const response = await fetch('/api/learning-mode/flashcards');
        const data = await response.json();
        setFlashcards(data);
      } catch (error) {
        console.error('Error fetching flashcards:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchFlashcards();
  }, []);

  if (loading) {
    return <p>Loading flashcards...</p>;
  }

  return (
    <div>
      {flashcards.map((flashcard, index) => (
        <Flashcard key={index} question={flashcard.question} answer={flashcard.answer} />
      ))}
    </div>
  );
}
