"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

interface AddFlashcardDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAdd: (question: string, answer: string) => void
}

export function AddFlashcardDialog({ open, onOpenChange, onAdd }: AddFlashcardDialogProps) {
  const [question, setQuestion] = useState("")
  const [answer, setAnswer] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (question.trim() && answer.trim()) {
      onAdd(question, answer)
      resetForm()
      onOpenChange(false)
    }
  }

  const resetForm = () => {
    setQuestion("")
    setAnswer("")
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add Flashcard</DialogTitle>
            <DialogDescription>Create a new flashcard to help you study this topic.</DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="question">Question</Label>
              <Textarea
                id="question"
                placeholder="Enter the question"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                className="resize-none"
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="answer">Answer</Label>
              <Textarea
                id="answer"
                placeholder="Enter the answer"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                className="resize-none"
                required
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Add Flashcard</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
