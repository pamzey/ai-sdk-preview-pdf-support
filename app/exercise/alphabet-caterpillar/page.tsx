"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Star, Trophy, Volume2 } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"

const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("")
const caterpillarPositions = [
  // Head
  { letter: "HEAD", x: 50, y: 100, isHead: true },
  // Body segments in caterpillar formation
  { letter: "A", x: 120, y: 120 },
  { letter: "B", x: 180, y: 140 },
  { letter: "C", x: 240, y: 160 },
  { letter: "D", x: 300, y: 180 },
  { letter: "E", x: 360, y: 200 },
  { letter: "F", x: 420, y: 220 },
  { letter: "G", x: 480, y: 240 },
  { letter: "H", x: 540, y: 220 },
  { letter: "I", x: 600, y: 200 },
  { letter: "J", x: 660, y: 180 },
  { letter: "K", x: 720, y: 160 },
  { letter: "L", x: 780, y: 140 },
  { letter: "M", x: 840, y: 120 },
  { letter: "N", x: 900, y: 140 },
  { letter: "O", x: 960, y: 160 },
  { letter: "P", x: 1020, y: 180 },
  { letter: "Q", x: 1080, y: 200 },
  { letter: "R", x: 1140, y: 220 },
  { letter: "S", x: 1200, y: 240 },
  { letter: "T", x: 1260, y: 220 },
  { letter: "U", x: 1320, y: 200 },
  { letter: "V", x: 1380, y: 180 },
  { letter: "W", x: 1440, y: 160 },
  { letter: "X", x: 1500, y: 140 },
  { letter: "Y", x: 1560, y: 120 },
  { letter: "Z", x: 1620, y: 100 },
]

// Define which letters are initially missing (empty positions)
const initialMissingLetters = ["C", "G", "I", "L", "M", "P", "T", "U", "Z"]

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

export default function AlphabetCaterpillarExercise() {
  // Start with some letters filled (pre-filled)
  const [filledLetters, setFilledLetters] = useState<string[]>(
    alphabet.filter((letter) => !initialMissingLetters.includes(letter)),
  )

  // Track which letters were answered correctly vs incorrectly
  const [correctAttempts, setCorrectAttempts] = useState<string[]>(
    alphabet.filter((letter) => !initialMissingLetters.includes(letter)),
  )
  const [failedAttempts, setFailedAttempts] = useState<string[]>([])

  // Track current step (which missing letter we're working on)
  const [currentStep, setCurrentStep] = useState(0)
  const [score, setScore] = useState(alphabet.length - initialMissingLetters.length)
  const [attempts, setAttempts] = useState(0)
  const [showCelebration, setShowCelebration] = useState(false)
  const [gameComplete, setGameComplete] = useState(false)

  const router = useRouter()
  const searchParams = useSearchParams()
  const childId = searchParams.get("childId")

  // Get the current missing letter we're working on
  const currentTargetLetter = initialMissingLetters[currentStep]
  const remainingMissingLetters = initialMissingLetters.filter((letter) => !filledLetters.includes(letter))

  const handleAlphabetClick = (letter: string) => {
    if (filledLetters.includes(letter) || gameComplete) return // Already filled or game over

    setAttempts((prev) => prev + 1)
    speakText(`${letter}`, 0.8)

    // Check if this is the correct letter for the current step
    const isCorrect = letter === currentTargetLetter

    if (isCorrect) {
      // Correct attempt
      setFilledLetters((prev) => [...prev, letter])
      setCorrectAttempts((prev) => [...prev, letter])
      setScore((prev) => prev + 1)
      setShowCelebration(true)
      speakText("Great job!", 1.0)
      setTimeout(() => setShowCelebration(false), 1500)

      // Move to next step
      if (currentStep < initialMissingLetters.length - 1) {
        setCurrentStep((prev) => prev + 1)
      } else {
        // Game complete
        setTimeout(() => {
          setGameComplete(true)
          speakText("Congratulations! You completed the caterpillar!", 1.0)
          saveScore()
        }, 1500)
      }
    } else {
      // Failed attempt - fill the letter anyway but mark as failed
      setFilledLetters((prev) => [...prev, currentTargetLetter])
      setFailedAttempts((prev) => [...prev, currentTargetLetter])
      speakText(`Not quite! The correct letter was ${currentTargetLetter}`, 1.0)

      // Move to next step
      if (currentStep < initialMissingLetters.length - 1) {
        setTimeout(() => {
          setCurrentStep((prev) => prev + 1)
        }, 2000)
      } else {
        // Game complete
        setTimeout(() => {
          setGameComplete(true)
          speakText("You completed the caterpillar! Keep practicing!", 1.0)
          saveScore()
        }, 2000)
      }
    }
  }

  const saveScore = () => {
    if (!childId) return

    const children = JSON.parse(localStorage.getItem("children") || "[]")
    const updatedChildren = children.map((child: any) => {
      if (child.id === childId) {
        const percentage = Math.round((correctAttempts.length / 26) * 100)
        return {
          ...child,
          scores: {
            ...child.scores,
            alphabetCaterpillar: Math.max(child.scores.alphabetCaterpillar, percentage),
          },
        }
      }
      return child
    })
    localStorage.setItem("children", JSON.stringify(updatedChildren))
  }

  const resetGame = () => {
    setFilledLetters(alphabet.filter((letter) => !initialMissingLetters.includes(letter)))
    setCorrectAttempts(alphabet.filter((letter) => !initialMissingLetters.includes(letter)))
    setFailedAttempts([])
    setCurrentStep(0)
    setScore(alphabet.length - initialMissingLetters.length)
    setAttempts(0)
    setGameComplete(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-400 via-blue-400 to-purple-400 p-4">
      <div className="max-w-7xl mx-auto">
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
              <span className="font-bold">Correct: {correctAttempts.length}/26</span>
            </div>
            <div className="flex items-center">
              <Trophy className="w-5 h-5 mr-1" />
              <span className="font-bold">
                Step: {currentStep + 1}/{initialMissingLetters.length}
              </span>
            </div>
          </div>
        </div>

        {/* Game Title */}
        <Card className="mb-6 bg-white/95 backdrop-blur">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              🐛 Alphabet Caterpillar 🐛 <Volume2 className="inline w-6 h-6 ml-2" />
            </CardTitle>
            <p className="text-gray-600">
              🔊 Click on alphabet buttons to fill the missing letters! The yellow circle shows where you are.
            </p>
            {!gameComplete && currentTargetLetter && (
              <p className="text-lg font-semibold text-purple-600">
                Step {currentStep + 1}: Find the missing letter (position highlighted in yellow)
              </p>
            )}
          </CardHeader>
        </Card>

        {/* Game Complete Modal */}
        {gameComplete && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <Card className="bg-white p-8 text-center max-w-md mx-4">
              <CardContent>
                <div className="text-6xl mb-4">🎉</div>
                <h2 className="text-2xl font-bold mb-2">Amazing Work!</h2>
                <p className="text-gray-600 mb-4">You completed the alphabet caterpillar!</p>
                <p className="text-lg font-semibold mb-2">✅ Correct: {correctAttempts.length}/26</p>
                <p className="text-lg font-semibold mb-4">❌ Incorrect: {failedAttempts.length}</p>
                <div className="flex space-x-3">
                  <Button onClick={resetGame} className="flex-1 bg-gradient-to-r from-green-500 to-blue-500">
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

        {/* Progress Display */}
        <Card className="mb-6 bg-white/95 backdrop-blur">
          <CardContent className="py-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">Progress</span>
              <span className="text-sm font-medium">
                {currentStep}/{initialMissingLetters.length} missing letters
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-green-500 to-blue-500 h-3 rounded-full transition-all duration-300"
                style={{ width: `${(currentStep / initialMissingLetters.length) * 100}%` }}
              ></div>
            </div>
            <div className="mt-2 flex justify-between text-xs">
              <span className="text-green-600">✅ Correct: {correctAttempts.length}</span>
              <span className="text-red-600">❌ Failed: {failedAttempts.length}</span>
            </div>
          </CardContent>
        </Card>

        {/* Caterpillar Canvas */}
        <Card className="bg-white/95 backdrop-blur mb-6">
          <CardContent className="p-6">
            <div className="relative overflow-x-auto" style={{ height: "400px" }}>
              <svg width="1700" height="400" className="absolute">
                {/* Caterpillar body connections */}
                {caterpillarPositions.slice(1).map((pos, index) => {
                  if (index === 0) return null
                  const prevPos = caterpillarPositions[index]
                  return (
                    <line
                      key={`line-${index}`}
                      x1={prevPos.x + 30}
                      y1={prevPos.y + 30}
                      x2={pos.x + 30}
                      y2={pos.y + 30}
                      stroke="#8B5CF6"
                      strokeWidth="3"
                      strokeDasharray="5,5"
                    />
                  )
                })}

                {/* Caterpillar segments */}
                {caterpillarPositions.map((pos, index) => {
                  if (pos.isHead) {
                    return (
                      <g key="head">
                        <circle
                          cx={pos.x + 30}
                          cy={pos.y + 30}
                          r="35"
                          fill="#FFD700"
                          stroke="#FF6B6B"
                          strokeWidth="3"
                        />
                        {/* Eyes */}
                        <circle cx={pos.x + 20} cy={pos.y + 20} r="5" fill="#000" />
                        <circle cx={pos.x + 40} cy={pos.y + 20} r="5" fill="#000" />
                        {/* Smile */}
                        <path
                          d={`M ${pos.x + 15} ${pos.y + 40} Q ${pos.x + 30} ${pos.y + 50} ${pos.x + 45} ${pos.y + 40}`}
                          stroke="#000"
                          strokeWidth="2"
                          fill="none"
                        />
                        {/* Antennae */}
                        <line
                          x1={pos.x + 15}
                          y1={pos.y}
                          x2={pos.x + 10}
                          y2={pos.y - 10}
                          stroke="#000"
                          strokeWidth="2"
                        />
                        <line
                          x1={pos.x + 45}
                          y1={pos.y}
                          x2={pos.x + 50}
                          y2={pos.y - 10}
                          stroke="#000"
                          strokeWidth="2"
                        />
                        <circle cx={pos.x + 10} cy={pos.y - 10} r="3" fill="#FF6B6B" />
                        <circle cx={pos.x + 50} cy={pos.y - 10} r="3" fill="#FF6B6B" />
                      </g>
                    )
                  }

                  const isFilled = filledLetters.includes(pos.letter)
                  const isCorrect = correctAttempts.includes(pos.letter)
                  const isFailed = failedAttempts.includes(pos.letter)
                  const isCurrentTarget = pos.letter === currentTargetLetter && !gameComplete

                  // Determine color based on status
                  let fillColor = "#E5E7EB" // Default empty (gray)
                  let strokeColor = "#6B7280"
                  let strokeWidth = 3

                  if (isCorrect) {
                    fillColor = "#10B981" // Green for correct
                  } else if (isFailed) {
                    fillColor = "#EF4444" // Red for failed
                  } else if (isCurrentTarget) {
                    fillColor = "#F59E0B" // Yellow for current target
                    strokeColor = "#F59E0B"
                    strokeWidth = 4
                  }

                  return (
                    <g key={pos.letter}>
                      <circle
                        cx={pos.x + 30}
                        cy={pos.y + 30}
                        r="30"
                        fill={fillColor}
                        stroke={strokeColor}
                        strokeWidth={strokeWidth}
                        className={isCurrentTarget ? "animate-pulse" : ""}
                      />
                      <text
                        x={pos.x + 30}
                        y={pos.y + 38}
                        textAnchor="middle"
                        className="text-xl font-bold"
                        fill={isFilled ? "white" : "#374151"}
                      >
                        {isFilled ? pos.letter : "?"}
                      </text>
                    </g>
                  )
                })}
              </svg>
            </div>
          </CardContent>
        </Card>

        {/* Letter Options */}
        <Card className="bg-white/95 backdrop-blur">
          <CardHeader>
            <CardTitle className="text-center text-lg font-bold text-purple-600">
              Click on the alphabet buttons to fill the missing letters!
            </CardTitle>
            {!gameComplete && currentTargetLetter && (
              <p className="text-center text-sm text-gray-600">
                Current step: Looking for the letter that goes in the yellow circle
              </p>
            )}
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-6 md:grid-cols-13 gap-2">
              {alphabet.map((letter) => {
                const isFilled = filledLetters.includes(letter)
                const isCorrect = correctAttempts.includes(letter)
                const isFailed = failedAttempts.includes(letter)

                return (
                  <Button
                    key={letter}
                    onClick={() => handleAlphabetClick(letter)}
                    disabled={isFilled || gameComplete}
                    className={`h-12 text-lg font-bold transition-all duration-300 ${
                      isFilled
                        ? isCorrect
                          ? "bg-green-500 text-white cursor-not-allowed"
                          : isFailed
                            ? "bg-red-500 text-white cursor-not-allowed"
                            : "bg-green-500 text-white cursor-not-allowed"
                        : "bg-gradient-to-r from-purple-400 to-pink-400 text-white hover:scale-105"
                    }`}
                  >
                    {letter}
                  </Button>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Legend */}
        <Card className="mt-6 bg-white/95 backdrop-blur">
          <CardContent className="py-4">
            <div className="flex justify-center space-x-6 text-sm">
              <div className="flex items-center">
                <div className="w-4 h-4 bg-green-500 rounded mr-2"></div>
                <span>Correct Letters</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-red-500 rounded mr-2"></div>
                <span>Incorrect Letters</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-yellow-500 rounded mr-2"></div>
                <span>Current Position</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-gray-300 rounded mr-2"></div>
                <span>Missing Letters</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
