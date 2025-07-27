"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, User, Trophy, BookOpen, LogOut, TrendingUp } from "lucide-react"
import AddChildModal from "@/components/dashboard/add-child-modal"
import { useRouter } from "next/navigation"

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

interface AttemptHistory {
  attemptNumber: number
  score: number
  totalLetters: number
  percentage: number
  timestamp: Date
}

export default function Dashboard() {
  const [children, setChildren] = useState<Child[]>([])
  const [showAddChild, setShowAddChild] = useState(false)
  const [user, setUser] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (!userData) {
      router.push("/")
      return
    }
    setUser(JSON.parse(userData))

    // Load children from localStorage
    const savedChildren = localStorage.getItem("children")
    if (savedChildren) {
      setChildren(JSON.parse(savedChildren))
    }
  }, [router])

  const handleAddChild = (childData: Omit<Child, "id" | "scores">) => {
    const newChild: Child = {
      ...childData,
      id: Date.now().toString(),
      scores: {
        letterMatching: 0,
        alphabetCaterpillar: 0,
        firstLetterPictures: 0,
        pictureWordMatch: 0, // Initialize new score
      },
    }
    const updatedChildren = [...children, newChild]
    setChildren(updatedChildren)
    localStorage.setItem("children", JSON.stringify(updatedChildren))
    setShowAddChild(false)
  }

  const handleLogout = () => {
    localStorage.removeItem("user")
    localStorage.removeItem("children")
    router.push("/")
  }

  const getLetterMatchingAttempts = (childId: string) => {
    const history = localStorage.getItem(`letterMatching_${childId}`)
    if (history) {
      const attempts: AttemptHistory[] = JSON.parse(history)
      return attempts.length
    }
    return 0
  }

  const getLetterMatchingBestScore = (childId: string) => {
    const history = localStorage.getItem(`letterMatching_${childId}`)
    if (history) {
      const attempts: AttemptHistory[] = JSON.parse(history)
      if (attempts.length > 0) {
        return Math.max(...attempts.map((a) => a.percentage))
      }
    }
    return 0
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-purple-400 to-pink-400 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
              <span className="text-2xl">👨‍👩‍👧‍👦</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Welcome, {user.name}!</h1>
              <p className="text-white/80">Manage your children's learning journey</p>
            </div>
          </div>
          <Button
            onClick={handleLogout}
            variant="outline"
            className="bg-white/20 border-white/30 text-white hover:bg-white/30"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>

        {/* Add Child Button */}
        <div className="mb-6">
          <Button
            onClick={() => setShowAddChild(true)}
            className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Child
          </Button>
        </div>

        {/* Children Grid */}
        {children.length === 0 ? (
          <Card className="bg-white/95 backdrop-blur text-center py-12">
            <CardContent>
              <div className="text-6xl mb-4">👶</div>
              <h3 className="text-xl font-semibold mb-2">No children added yet</h3>
              <p className="text-gray-600 mb-4">Add your first child to start their learning journey!</p>
              <Button onClick={() => setShowAddChild(true)} className="bg-gradient-to-r from-purple-500 to-pink-500">
                Add Your First Child
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {children.map((child) => (
              <Card
                key={child.id}
                className="bg-white/95 backdrop-blur shadow-xl hover:shadow-2xl transition-all duration-300"
              >
                <CardHeader className="text-center pb-4">
                  <div className="w-16 h-16 mx-auto mb-3 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                    <User className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-xl font-bold text-gray-800">{child.name}</CardTitle>
                  <div className="flex justify-center space-x-2 mt-2">
                    <Badge variant="secondary">Age {child.age}</Badge>
                    <Badge variant="outline">{child.grade}</Badge>
                    <Badge variant="outline">{child.gender}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 mb-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Letter Matching</span>
                      <div className="flex items-center space-x-2">
                        <div className="flex items-center">
                          <Trophy className="w-4 h-4 text-yellow-500 mr-1" />
                          <span className="font-semibold">{getLetterMatchingBestScore(child.id)}%</span>
                        </div>
                        <div className="flex items-center">
                          <TrendingUp className="w-4 h-4 text-blue-500 mr-1" />
                          <span className="text-xs text-gray-500">{getLetterMatchingAttempts(child.id)} attempts</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Alphabet Caterpillar</span>
                      <div className="flex items-center">
                        <Trophy className="w-4 h-4 text-yellow-500 mr-1" />
                        <span className="font-semibold">{child.scores.alphabetCaterpillar}%</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">First Letter Pictures</span>
                      <div className="flex items-center">
                        <Trophy className="w-4 h-4 text-yellow-500 mr-1" />
                        <span className="font-semibold">{child.scores.firstLetterPictures}%</span>
                      </div>
                    </div>
                    {/* New score display for Picture Word Match */}
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Picture Word Match</span>
                      <div className="flex items-center">
                        <Trophy className="w-4 h-4 text-yellow-500 mr-1" />
                        <span className="font-semibold">{child.scores.pictureWordMatch || 0}%</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Button
                      onClick={() => router.push(`/child-dashboard?childId=${child.id}`)}
                      className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                    >
                      <BookOpen className="w-4 h-4 mr-2" />
                      Start Learning
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Add Child Modal */}
        {showAddChild && <AddChildModal onClose={() => setShowAddChild(false)} onAdd={handleAddChild} />}
      </div>
    </div>
  )
}
