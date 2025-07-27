"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { X } from "lucide-react"

interface AddChildModalProps {
  onClose: () => void
  onAdd: (child: { name: string; age: number; grade: string; gender: string }) => void
}

export default function AddChildModal({ onClose, onAdd }: AddChildModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    grade: "",
    gender: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name || !formData.age || !formData.grade || !formData.gender) {
      alert("Please fill in all fields")
      return
    }

    onAdd({
      name: formData.name,
      age: Number.parseInt(formData.age),
      grade: formData.grade,
      gender: formData.gender,
    })
  }

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md bg-white">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-xl font-bold">Add New Child</CardTitle>
          <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8">
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Child's Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                placeholder="Enter child's name"
                className="mt-1"
                required
              />
            </div>

            <div>
              <Label htmlFor="age">Age</Label>
              <Select onValueChange={(value) => handleChange("age", value)}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select age" />
                </SelectTrigger>
                <SelectContent>
                  {[3, 4, 5, 6, 7].map((age) => (
                    <SelectItem key={age} value={age.toString()}>
                      {age} years old
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="grade">Grade</Label>
              <Select onValueChange={(value) => handleChange("grade", value)}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select grade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Pre-K">Pre-K</SelectItem>
                  <SelectItem value="Kindergarten">Kindergarten</SelectItem>
                  <SelectItem value="1st Grade">1st Grade</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="gender">Gender</Label>
              <Select onValueChange={(value) => handleChange("gender", value)}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Boy">Boy</SelectItem>
                  <SelectItem value="Girl">Girl</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex space-x-3 pt-4">
              <Button type="button" variant="outline" onClick={onClose} className="flex-1 bg-transparent">
                Cancel
              </Button>
              <Button type="submit" className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500">
                Add Child
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
