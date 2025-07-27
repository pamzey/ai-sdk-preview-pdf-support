"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, BookOpen, User } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"

interface Child {
  id: string
  name: string
  age: number
  grade: string
  gender: string
  scores: {
    letterMatching: number
    alphabetCaterpillar: number
    firstLetterPictures: number
    pictureWordMatch?: number // New score for Picture Word Match
  }
}

export default function ChildDashboard() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const childId = searchParams.get("childId")
  const [child, setChild] = useState<Child | null>(null)

  useEffect(() => {
    if (childId) {
      const savedChildren = localStorage.getItem("children")
      if (savedChildren) {
        const children: Child[] = JSON.parse(savedChildren)
        const foundChild = children.find((c) => c.id === childId)
        if (foundChild) {
          setChild(foundChild)
        } else {
          router.push("/dashboard") // Redirect if child not found
        }
      } else {
        router.push("/dashboard") // Redirect if no children data
      }
    } else {
      router.push("/dashboard") // Redirect if no childId in URL
    }
  }, [childId, router])

  const startExercise = (exerciseType: string) => {
    if (childId) {
      router.push(`/exercise/${exerciseType}?childId=${childId}`)
    }
  }

  if (!child) {
    return null // Or a loading spinner
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-purple-400 to-pink-400 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button
            onClick={() => router.push("/dashboard")}
            variant="outline"
            className="bg-white/20 border-white/30 text-white hover:bg-white/30"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Parent Dashboard
          </Button>
          <div className="flex items-center space-x-4 text-white">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Hi, {child.name}!</h1>
              <p className="text-white/80">Choose an exercise to start learning!</p>
            </div>
          </div>
        </div>

        {/* Exercise Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="bg-white/95 backdrop-blur shadow-xl hover:shadow-2xl transition-all duration-300">
            <CardHeader className="text-center pb-4">
              <div className="w-16 h-16 mx-auto mb-3 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-4xl">
                🔤
              </div>
              <CardTitle className="text-xl font-bold text-gray-800">Letter Matching</CardTitle>
              <p className="text-gray-600 text-sm">Match uppercase and lowercase letters.</p>
            </CardHeader>
            <CardContent>
              <Button
                onClick={() => startExercise("letter-matching")}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
              >
                <BookOpen className="w-4 h-4 mr-2" />
                Start Game
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-white/95 backdrop-blur shadow-xl hover:shadow-2xl transition-all duration-300">
            <CardHeader className="text-center pb-4">
              <div className="w-16 h-16 mx-auto mb-3 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center text-4xl">
                🐛
              </div>
              <CardTitle className="text-xl font-bold text-gray-800">Alphabet Caterpillar</CardTitle>
              <p className="text-gray-600 text-sm">Fill in the missing letters of the alphabet.</p>
            </CardHeader>
            <CardContent>
              <Button
                onClick={() => startExercise("alphabet-caterpillar")}
                className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600"
              >
                <BookOpen className="w-4 h-4 mr-2" />
                Start Game
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-white/95 backdrop-blur shadow-xl hover:shadow-2xl transition-all duration-300">
            <CardHeader className="text-center pb-4">
              <div className="w-16 h-16 mx-auto mb-3 bg-gradient-to-r from-orange-400 to-red-500 rounded-full flex items-center justify-center text-4xl">
                🖼️
              </div>
              <CardTitle className="text-xl font-bold text-gray-800">First Letter Pictures</CardTitle>
              <p className="text-gray-600 text-sm">Identify the first letter of objects.</p>
            </CardHeader>
            <CardContent>
              <Button
                onClick={() => startExercise("first-letter-pictures")}
                className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
              >
                <BookOpen className="w-4 h-4 mr-2" />
                Start Game
              </Button>
            </CardContent>
          </Card>

          {/* New Exercise Card: Picture Word Match */}
          <Card className="bg-white/95 backdrop-blur shadow-xl hover:shadow-2xl transition-all duration-300">
            <CardHeader className="text-center pb-4">
              <div className="w-16 h-16 mx-auto mb-3 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-4xl">
                📝
              </div>
              <CardTitle className="text-xl font-bold text-gray-800">Picture Word Match</CardTitle>
              <p className="text-gray-600 text-sm">Match pictures to their correct words.</p>
            </CardHeader>
            <CardContent>
              <Button
                onClick={() => startExercise("picture-word-match")}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
              >
                <BookOpen className="w-4 h-4 mr-2" />
                Start Game
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
