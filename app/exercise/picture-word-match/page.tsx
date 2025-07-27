"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Star, Trophy, Volume2 } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"

interface PictureWord {
  image: string
  word: string
}

const pictureWords: PictureWord[] = [
  { image: "/images/cup.png", word: "cup" },
  { image: "/images/apple.png", word: "apple" },
  { image: "/images/cat.png", word: "cat" },
  { image: "/images/axe.png", word: "axe" },
  { image: "/images/cake.png", word: "cake" },
  { image: "/images/chair.png", word: "chair" },
  { image: "/images/ant.png", word: "ant" },
  { image: "/images/cap.png", word: "cap" },
  { image: "/images/bird.png", word: "bird" },
  { image: "/images/ball.png", word: "ball" },
  { image: "/images/book.png", word: "book" },
  { image: "/images/bee.png", word: "bee" },
  { image: "/images/cow.png", word: "cow" },
  { image: "/images/bag.png", word: "bag" },
]

// Speech synthesis function
const speakText = (text: string, rate = 0.8) => {
  if ("speechSynthesis" in window) {
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.rate = rate
    utterance.pitch = 1.2
    utterance.volume = 0.8
    speechSynthesis.speak(utterance)
  }
}

// Utility to shuffle an array
const shuffleArray = (array: any[]) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[array[i], array[j]] = [array[j], array[i]]
  }
  return array
}

export default function PictureWordMatchExercise() {
  const [shuffledWords, setShuffledWords] = useState<PictureWord[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedWord, setSelectedWord] = useState<string | null>(null)
  const [score, setScore] = useState(0)
  const [attempts, setAttempts] = useState(0)
  const [showCelebration, setShowCelebration] = useState(false)
  const [gameComplete, setGameComplete] = useState(false)
  const [options, setOptions] = useState<string[]>([])

  const router = useRouter()
  const searchParams = useSearchParams()
  const childId = searchParams.get("childId")

  const currentItem = shuffledWords[currentIndex]

  const generateOptions = useCallback(() => {
    if (!currentItem) return []
    const correctWord = currentItem.word
    const otherWords = pictureWords.map((item) => item.word).filter((word) => word !== correctWord)
    const shuffledOtherWords = shuffleArray(otherWords).slice(0, 3) // Get 3 random incorrect options
    const newOptions = shuffleArray([...shuffledOtherWords, correctWord])
    setOptions(newOptions)
  }, [currentItem])

  useEffect(() => {
    // Initialize game
    const initialShuffledWords = shuffleArray([...pictureWords])
    setShuffledWords(initialShuffledWords)
    setCurrentIndex(0)
    setScore(0)
    setAttempts(0)
    setGameComplete(false)
    setSelectedWord(null)
  }, [])

  useEffect(() => {
    if (shuffledWords.length > 0 && currentIndex < shuffledWords.length) {
      generateOptions()
      speakText(`What is this?`)
    } else if (shuffledWords.length > 0 && currentIndex === shuffledWords.length && !gameComplete) {
      setGameComplete(true)
      speakText("Wonderful! You completed all the pictures!", 1.0)
      saveScore()
    }
  }, [currentIndex, shuffledWords, gameComplete, generateOptions])

  const handleWordSelect = (word: string) => {
    setSelectedWord(word)
    setAttempts((prev) => prev + 1)
    speakText(`${word}`, 0.8)

    const isCorrect = word === currentItem.word

    if (isCorrect) {
      setScore((prev) => prev + 1)
      setShowCelebration(true)
      speakText("Great job!", 1.0)
      setTimeout(() => setShowCelebration(false), 1500)
    } else {
      speakText(`Not quite! It's ${currentItem.word}.`, 1.0)
    }

    setTimeout(() => {
      setSelectedWord(null)
      setCurrentIndex((prev) => prev + 1)
    }, 2000) // Give time for feedback and speech
  }

  const saveScore = () => {
    if (!childId) return

    const children = JSON.parse(localStorage.getItem("children") || "[]")
    const updatedChildren = children.map((child: any) => {
      if (child.id === childId) {
        const percentage = Math.round((score / pictureWords.length) * 100)
        return {
          ...child,
          scores: {
            ...child.scores,
            pictureWordMatch: Math.max(child.scores.pictureWordMatch || 0, percentage), // Initialize if not exists
          },
        }
      }
      return child
    })
    localStorage.setItem("children", JSON.stringify(updatedChildren))
  }

  const resetGame = () => {
    const initialShuffledWords = shuffleArray([...pictureWords])
    setShuffledWords(initialShuffledWords)
    setCurrentIndex(0)
    setSelectedWord(null)
    setScore(0)
    setAttempts(0)
    setGameComplete(false)
    setShowCelebration(false)
  }

  if (shuffledWords.length === 0 || !currentItem) {
    return null // Or a loading spinner
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-400 to-red-400 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button
            onClick={() => router.push(`/child-dashboard?childId=${childId}`)}
            variant="outline"
            className="bg-white/20 border-white/30 text-white hover:bg-white/30"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Exercises
          </Button>
          <div className="flex items-center space-x-4 text-white">
            <div className="flex items-center">
              <Star className="w-5 h-5 mr-1" />
              <span className="font-bold">
                Score: {score}/{pictureWords.length}
              </span>
            </div>
            <div className="flex items-center">
              <Trophy className="w-5 h-5 mr-1" />
              <span className="font-bold">
                Question: {currentIndex + 1}/{pictureWords.length}
              </span>
            </div>
          </div>
        </div>

        {/* Game Title */}
        <Card className="mb-6 bg-white/95 backdrop-blur">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              🖼️ Picture Word Match 📝 <Volume2 className="inline w-6 h-6 ml-2" />
            </CardTitle>
            <p className="text-gray-600">🔊 Look at the picture and choose the correct word!</p>
          </CardHeader>
        </Card>

        {/* Game Complete Modal */}
        {gameComplete && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <Card className="bg-white p-8 text-center max-w-md mx-4">
              <CardContent>
                <div className="text-6xl mb-4">🎉</div>
                <h2 className="text-2xl font-bold mb-2">Great Job!</h2>
                <p className="text-gray-600 mb-4">
                  You got {score} out of {pictureWords.length} correct!
                </p>
                <div className="flex space-x-3">
                  <Button onClick={resetGame} className="flex-1 bg-gradient-to-r from-pink-500 to-purple-500">
                    Play Again
                  </Button>
                  <Button
                    onClick={() => router.push(`/child-dashboard?childId=${childId}`)}
                    variant="outline"
                    className="flex-1"
                  >
                    Back to Exercises
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Celebration Animation */}
        {showCelebration && (
          <div className="fixed inset-0 pointer-events-none flex items-center justify-center z-40">
            <div className="text-8xl animate-bounce">👏</div>
          </div>
        )}

        {/* Current Picture */}
        <Card className="mb-6 bg-white/95 backdrop-blur">
          <CardContent className="text-center py-8">
            <img
              src={currentItem.image || "/placeholder.svg"}
              alt={currentItem.word}
              width={150}
              height={150}
              className="mx-auto mb-4"
            />
            <Button
              onClick={() => speakText(currentItem.word, 0.9)}
              variant="outline"
              className="mb-4 bg-blue-100 hover:bg-blue-200"
            >
              <Volume2 className="w-4 h-4 mr-2" />
              Hear the Word
            </Button>
            <p className="text-gray-600 mb-4">Which word matches this picture?</p>
            {selectedWord && (
              <div
                className={`text-xl font-bold ${selectedWord === currentItem.word ? "text-green-600" : "text-red-600"}`}
              >
                {selectedWord === currentItem.word
                  ? `✅ Correct! It's "${currentItem.word}"`
                  : `❌ Not quite! It's "${currentItem.word}"`}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Word Options */}
        <Card className="bg-white/95 backdrop-blur">
          <CardHeader>
            <CardTitle className="text-center text-lg font-bold text-purple-600">Choose the Word</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {options.map((word) => (
                <Button
                  key={word}
                  onClick={() => handleWordSelect(word)}
                  disabled={selectedWord !== null}
                  className={`h-16 text-lg font-bold transition-all duration-300 ${
                    selectedWord === word
                      ? selectedWord === currentItem.word
                        ? "bg-green-500 text-white"
                        : "bg-red-500 text-white"
                      : selectedWord && word === currentItem.word
                        ? "bg-green-500 text-white"
                        : "bg-gradient-to-r from-blue-400 to-purple-400 text-white hover:scale-105"
                  }`}
                >
                  {word}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Progress Bar */}
        <Card className="mt-6 bg-white/95 backdrop-blur">
          <CardContent className="py-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">Progress</span>
              <span className="text-sm font-medium">
                {currentIndex + 1}/{pictureWords.length}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-pink-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentIndex + 1) / pictureWords.length) * 100}%` }}
              ></div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
