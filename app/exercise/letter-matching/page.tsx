"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Star, Trophy, Volume2, History } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"

const allLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").map((letter) => ({
  upper: letter,
  lower: letter.toLowerCase(),
}))

interface AttemptHistory {
  attemptNumber: number
  score: number
  totalLetters: number
  percentage: number
  timestamp: Date
}

export default function LetterMatchingExercise() {
  const [currentLetters, setCurrentLetters] = useState(allLetters.slice(0, 5)) // Start with A-E
  const [selectedUpper, setSelectedUpper] = useState<string | null>(null)
  const [selectedLower, setSelectedLower] = useState<string | null>(null)
  const [currentScore, setCurrentScore] = useState(0)
  const [currentAttempts, setCurrentAttempts] = useState(0)
  const [showCelebration, setShowCelebration] = useState(false)
  const [gameComplete, setGameComplete] = useState(false)
  const [nextLetterIndex, setNextLetterIndex] = useState(5) // Next letter to add (F)
  const [attemptHistory, setAttemptHistory] = useState<AttemptHistory[]>([])
  const [currentAttemptNumber, setCurrentAttemptNumber] = useState(1)
  const [showHistory, setShowHistory] = useState(false)

  const router = useRouter()
  const searchParams = useSearchParams()
  const childId = searchParams.get("childId")

  // Shuffle lowercase letters for display
  const shuffledLowercase = [...currentLetters.map((p) => p.lower)].sort(() => Math.random() - 0.5)

  // Load attempt history on component mount
  useEffect(() => {
    if (childId) {
      const savedHistory = localStorage.getItem(`letterMatching_${childId}`)
      if (savedHistory) {
        const history = JSON.parse(savedHistory)
        setAttemptHistory(history)
        setCurrentAttemptNumber(history.length + 1)
      }
    }
  }, [childId])

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

  useEffect(() => {
    if (selectedUpper && selectedLower) {
      setCurrentAttempts((prev) => prev + 1)
      const isMatch = currentLetters.find((pair) => pair.upper === selectedUpper && pair.lower === selectedLower)

      if (isMatch) {
        setCurrentScore((prev) => prev + 1)
        setShowCelebration(true)
        speakText("Great job!", 1.0)
        setTimeout(() => setShowCelebration(false), 1500)
      } else {
        speakText("Try again next time!", 1.0)
      }

      // Always move forward after each attempt (correct or incorrect)
      setTimeout(() => {
        setCurrentLetters((prevLetters) => {
          const newLetters = prevLetters.filter((letter) => letter.upper !== selectedUpper)

          // Add next letter if available
          if (nextLetterIndex < allLetters.length) {
            newLetters.push(allLetters[nextLetterIndex])
            setNextLetterIndex((prev) => prev + 1)
          }

          return newLetters
        })

        // Check if current attempt is complete (no more letters or reached end)
        if (nextLetterIndex >= allLetters.length && currentLetters.length === 1) {
          completeCurrentAttempt()
        }
      }, 1500)

      setTimeout(() => {
        setSelectedUpper(null)
        setSelectedLower(null)
      }, 1500)
    }
  }, [selectedUpper, selectedLower, nextLetterIndex, currentLetters.length])

  const completeCurrentAttempt = () => {
    const finalScore =
      currentScore +
      (selectedUpper &&
      selectedLower &&
      currentLetters.find((pair) => pair.upper === selectedUpper && pair.lower === selectedLower)
        ? 1
        : 0)

    const newAttempt: AttemptHistory = {
      attemptNumber: currentAttemptNumber,
      score: finalScore,
      totalLetters: 26,
      percentage: Math.round((finalScore / 26) * 100),
      timestamp: new Date(),
    }

    const updatedHistory = [...attemptHistory, newAttempt]
    setAttemptHistory(updatedHistory)

    // Save to localStorage
    if (childId) {
      localStorage.setItem(`letterMatching_${childId}`, JSON.stringify(updatedHistory))
      saveScoreToChild(newAttempt.percentage)
    }

    setGameComplete(true)
    speakText(`Attempt complete! You scored ${finalScore} out of 26 letters!`, 1.0)
  }

  const saveScoreToChild = (percentage: number) => {
    if (!childId) return

    const children = JSON.parse(localStorage.getItem("children") || "[]")
    const updatedChildren = children.map((child: any) => {
      if (child.id === childId) {
        return {
          ...child,
          scores: {
            ...child.scores,
            letterMatching: Math.max(child.scores.letterMatching, percentage),
          },
        }
      }
      return child
    })
    localStorage.setItem("children", JSON.stringify(updatedChildren))
  }

  const startNewAttempt = () => {
    setCurrentLetters(allLetters.slice(0, 5))
    setSelectedUpper(null)
    setSelectedLower(null)
    setCurrentScore(0)
    setCurrentAttempts(0)
    setGameComplete(false)
    setNextLetterIndex(5)
    setCurrentAttemptNumber(attemptHistory.length + 1)
  }

  const handleUpperClick = (letter: string) => {
    setSelectedUpper(letter)
    speakText(`${letter}`, 0.8)
  }

  const handleLowerClick = (letter: string) => {
    setSelectedLower(letter)
    speakText(`${letter}`, 0.8)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-400 via-orange-400 to-red-400 p-4">
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
                Score: {currentScore}/{currentAttempts}
              </span>
            </div>
            <div className="flex items-center">
              <Trophy className="w-5 h-5 mr-1" />
              <span className="font-bold">Attempt: {currentAttemptNumber}</span>
            </div>
            <Button
              onClick={() => setShowHistory(!showHistory)}
              variant="outline"
              size="sm"
              className="bg-white/20 border-white/30 text-white hover:bg-white/30"
            >
              <History className="w-4 h-4 mr-1" />
              History
            </Button>
          </div>
        </div>

        {/* Game Title */}
        <Card className="mb-6 bg-white/95 backdrop-blur">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              🔤 Dynamic Letter Matching Game 🔤
            </CardTitle>
            <p className="text-gray-600">
              Match letters and discover new ones! Every attempt counts - keep trying to improve!
            </p>
          </CardHeader>
        </Card>

        {/* Attempt History */}
        {showHistory && (
          <Card className="mb-6 bg-white/95 backdrop-blur">
            <CardHeader>
              <CardTitle className="text-lg font-bold text-blue-600">📊 Attempt History</CardTitle>
            </CardHeader>
            <CardContent>
              {attemptHistory.length === 0 ? (
                <p className="text-gray-600 text-center">No attempts yet. Start playing to see your progress!</p>
              ) : (
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {attemptHistory.map((attempt) => (
                    <div
                      key={attempt.attemptNumber}
                      className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
                    >
                      <div>
                        <span className="font-semibold">Attempt {attempt.attemptNumber}</span>
                        <span className="text-sm text-gray-600 ml-2">
                          {new Date(attempt.timestamp).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-lg">
                          {attempt.score}/{attempt.totalLetters}
                        </div>
                        <div
                          className={`text-sm font-semibold ${
                            attempt.percentage >= 80
                              ? "text-green-600"
                              : attempt.percentage >= 60
                                ? "text-yellow-600"
                                : "text-red-600"
                          }`}
                        >
                          {attempt.percentage}%
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Game Complete Modal */}
        {gameComplete && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <Card className="bg-white p-8 text-center max-w-md mx-4">
              <CardContent>
                <div className="text-6xl mb-4">
                  {currentScore >= 20 ? "🎉" : currentScore >= 15 ? "👏" : currentScore >= 10 ? "😊" : "💪"}
                </div>
                <h2 className="text-2xl font-bold mb-2">Attempt {currentAttemptNumber} Complete!</h2>
                <p className="text-gray-600 mb-4">You scored {currentScore} out of 26 letters correctly!</p>
                <p className="text-lg font-semibold text-purple-600 mb-4">
                  Accuracy: {Math.round((currentScore / 26) * 100)}%
                </p>
                {currentScore < 26 && (
                  <p className="text-sm text-gray-500 mb-4">Keep practicing to improve your score!</p>
                )}
                <div className="flex space-x-3">
                  <Button onClick={startNewAttempt} className="flex-1 bg-gradient-to-r from-green-500 to-blue-500">
                    Try Again
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

        {/* Progress Display */}
        <Card className="mb-6 bg-white/95 backdrop-blur">
          <CardContent className="py-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">Current Attempt Progress</span>
              <span className="text-sm font-medium">{currentAttempts}/26</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-green-500 to-blue-500 h-3 rounded-full transition-all duration-300"
                style={{ width: `${(currentAttempts / 26) * 100}%` }}
              ></div>
            </div>
            <div className="mt-2 flex justify-between text-xs text-gray-600">
              <span>Correct: {currentScore}</span>
              <span>Accuracy: {currentAttempts > 0 ? Math.round((currentScore / currentAttempts) * 100) : 0}%</span>
            </div>
          </CardContent>
        </Card>

        {/* Game Board */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Uppercase Letters */}
          <Card className="bg-white/95 backdrop-blur">
            <CardHeader>
              <CardTitle className="text-center text-lg font-bold text-purple-600">
                Uppercase Letters
                <Volume2 className="inline w-4 h-4 ml-2" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-4">
                {currentLetters.map((pair) => (
                  <Button
                    key={pair.upper}
                    onClick={() => handleUpperClick(pair.upper)}
                    disabled={selectedUpper !== null}
                    className={`h-16 text-3xl font-bold transition-all duration-300 ${
                      selectedUpper === pair.upper
                        ? "bg-purple-500 text-white scale-105 ring-4 ring-purple-300"
                        : "bg-gradient-to-r from-blue-400 to-purple-400 text-white hover:scale-105"
                    }`}
                  >
                    {pair.upper}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Lowercase Letters */}
          <Card className="bg-white/95 backdrop-blur">
            <CardHeader>
              <CardTitle className="text-center text-lg font-bold text-pink-600">
                Lowercase Letters
                <Volume2 className="inline w-4 h-4 ml-2" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-4">
                {shuffledLowercase.map((letter, index) => (
                  <Button
                    key={`${letter}-${index}`}
                    onClick={() => handleLowerClick(letter)}
                    disabled={selectedLower !== null}
                    className={`h-16 text-3xl font-bold transition-all duration-300 ${
                      selectedLower === letter
                        ? "bg-pink-500 text-white scale-105 ring-4 ring-pink-300"
                        : "bg-gradient-to-r from-pink-400 to-red-400 text-white hover:scale-105"
                    }`}
                  >
                    {letter}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Instructions */}
        <Card className="mt-6 bg-white/95 backdrop-blur">
          <CardContent className="text-center py-4">
            <p className="text-gray-600">
              🔊 Click on letters to hear their sounds! Match uppercase with lowercase letters. Every attempt is
              recorded - keep trying to improve your score!
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
