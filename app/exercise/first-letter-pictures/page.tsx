"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Star, Trophy, Volume2 } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"

const pictureWords = [
  { word: "Cat", firstLetter: "C", emoji: "🐱", description: "A cute furry pet" },
  { word: "Duck", firstLetter: "D", emoji: "🦆", description: "A water bird that quacks" },
  { word: "Ice Cream", firstLetter: "I", emoji: "🍦", description: "A cold sweet treat" },
  { word: "Knife", firstLetter: "K", emoji: "🔪", description: "A tool for cutting" },
  { word: "Orange", firstLetter: "O", emoji: "🍊", description: "A round citrus fruit" },
  { word: "Leaf", firstLetter: "L", emoji: "🍃", description: "Green part of a plant" },
  { word: "Jug", firstLetter: "J", emoji: "🏺", description: "A container for liquids" },
  { word: "Flower", firstLetter: "F", emoji: "🌸", description: "A colorful bloom" },
  { word: "Tree", firstLetter: "T", emoji: "🌳", description: "A tall plant with branches" },
  { word: "Hat", firstLetter: "H", emoji: "👒", description: "Something you wear on your head" },
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

export default function FirstLetterPicturesExercise() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null)
  const [score, setScore] = useState(0)
  const [attempts, setAttempts] = useState(0)
  const [showCelebration, setShowCelebration] = useState(false)
  const [gameComplete, setGameComplete] = useState(false)
  const [correctAnswers, setCorrectAnswers] = useState<boolean[]>([])

  const router = useRouter()
  const searchParams = useSearchParams()
  const childId = searchParams.get("childId")

  const currentPicture = pictureWords[currentIndex]
  const letterOptions = [
    "A",
    "B",
    "C",
    "D",
    "E",
    "F",
    "G",
    "H",
    "I",
    "J",
    "K",
    "L",
    "M",
    "N",
    "O",
    "P",
    "Q",
    "R",
    "S",
    "T",
    "U",
    "V",
    "W",
    "X",
    "Y",
    "Z",
  ]

  useEffect(() => {
    // Speak the current picture description when it changes
    speakText(`What is the first letter of ${currentPicture.word}?`, 0.9)
  }, [currentIndex])

  const handleLetterSelect = (letter: string) => {
    setSelectedLetter(letter)
    setAttempts((prev) => prev + 1)
    speakText(`${letter}`, 0.8)

    const isCorrect = letter === currentPicture.firstLetter

    if (isCorrect) {
      setScore((prev) => prev + 1)
      setCorrectAnswers((prev) => [...prev, true])
      setShowCelebration(true)
      speakText("Great job!", 1.0)
      setTimeout(() => setShowCelebration(false), 1500)
    } else {
      setCorrectAnswers((prev) => [...prev, false])
      speakText(`Not quite! The correct answer is ${currentPicture.firstLetter} for ${currentPicture.word}`, 1.0)
    }

    setTimeout(() => {
      if (currentIndex < pictureWords.length - 1) {
        setCurrentIndex((prev) => prev + 1)
        setSelectedLetter(null)
      } else {
        setGameComplete(true)
        speakText("Wonderful! You completed all the pictures!", 1.0)
        saveScore()
      }
    }, 3000) // Increased time to let the speech finish
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
            firstLetterPictures: Math.max(child.scores.firstLetterPictures, percentage),
          },
        }
      }
      return child
    })
    localStorage.setItem("children", JSON.stringify(updatedChildren))
  }

  const resetGame = () => {
    setCurrentIndex(0)
    setSelectedLetter(null)
    setScore(0)
    setAttempts(0)
    setGameComplete(false)
    setCorrectAnswers([])
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-400 via-purple-400 to-indigo-400 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button
            onClick={() => router.push("/dashboard")}
            variant="outline"
            className="bg-white/20 border-white/30 text-white hover:bg-white/30"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
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
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
              🖼️ First Letter Pictures 🖼️ <Volume2 className="inline w-6 h-6 ml-2" />
            </CardTitle>
            <p className="text-gray-600">
              🔊 Listen to the word and click on letters to hear their sounds! Look at the picture and choose the first
              letter of the word!
            </p>
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
                  <Button onClick={() => router.push("/dashboard")} variant="outline" className="flex-1">
                    Back to Dashboard
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
            <div className="text-8xl mb-4 animate-pulse">{currentPicture.emoji}</div>
            <Button
              onClick={() => speakText(`${currentPicture.word}. ${currentPicture.description}`, 0.9)}
              variant="outline"
              className="mb-4 bg-blue-100 hover:bg-blue-200"
            >
              <Volume2 className="w-4 h-4 mr-2" />
              Hear the Word Again
            </Button>
            <h3 className="text-2xl font-bold mb-2">{currentPicture.description}</h3>
            <p className="text-gray-600 mb-4">What is the first letter of this word?</p>
            {selectedLetter && (
              <div
                className={`text-xl font-bold ${
                  selectedLetter === currentPicture.firstLetter ? "text-green-600" : "text-red-600"
                }`}
              >
                {selectedLetter === currentPicture.firstLetter
                  ? `✅ Correct! It's "${currentPicture.firstLetter}" for "${currentPicture.word}"`
                  : `❌ Not quite! The correct answer is "${currentPicture.firstLetter}" for "${currentPicture.word}"`}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Letter Options */}
        <Card className="bg-white/95 backdrop-blur">
          <CardHeader>
            <CardTitle className="text-center text-lg font-bold text-purple-600">Choose the First Letter</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-3">
              {letterOptions.map((letter) => (
                <Button
                  key={letter}
                  onClick={() => handleLetterSelect(letter)}
                  disabled={selectedLetter !== null}
                  className={`h-12 text-lg font-bold transition-all duration-300 ${
                    selectedLetter === letter
                      ? selectedLetter === currentPicture.firstLetter
                        ? "bg-green-500 text-white"
                        : "bg-red-500 text-white"
                      : selectedLetter && letter === currentPicture.firstLetter
                        ? "bg-green-500 text-white"
                        : "bg-gradient-to-r from-blue-400 to-purple-400 text-white hover:scale-105"
                  }`}
                >
                  {letter}
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
