"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import LoginForm from "@/components/auth/login-form"
import RegisterForm from "@/components/auth/register-form"

export default function HomePage() {
  const [showLogin, setShowLogin] = useState(true)

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-400 to-red-400 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur">
          <CardHeader className="text-center pb-2">
            <div className="mx-auto mb-4 w-20 h-20 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
              <span className="text-3xl">🎓</span>
            </div>
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              KidsLearn Academy
            </CardTitle>
            <p className="text-gray-600">Fun Learning for Little Minds!</p>
          </CardHeader>
          <CardContent>
            <div className="flex mb-6 bg-gray-100 rounded-lg p-1">
              <Button
                variant={showLogin ? "default" : "ghost"}
                className={`flex-1 ${showLogin ? "bg-gradient-to-r from-purple-500 to-pink-500" : ""}`}
                onClick={() => setShowLogin(true)}
              >
                Login
              </Button>
              <Button
                variant={!showLogin ? "default" : "ghost"}
                className={`flex-1 ${!showLogin ? "bg-gradient-to-r from-purple-500 to-pink-500" : ""}`}
                onClick={() => setShowLogin(false)}
              >
                Register
              </Button>
            </div>
            {showLogin ? <LoginForm /> : <RegisterForm />}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
