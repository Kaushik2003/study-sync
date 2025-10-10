"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Sparkles, ArrowRight, ArrowLeft, Check, X, Plus, BrainCircuit } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useStore } from "@/lib/store"
import type { Note, Flashcard } from "@/lib/store"
import { AddFlashcardDialog } from "./add-flashcard-dialog"
import { MCQQuiz } from "./mcq-quiz"

interface FlashcardSectionProps {
  note: Note
}

export function FlashcardSection({ note }: FlashcardSectionProps) {
  const { updateNote } = useStore()
  const [isGenerating, setIsGenerating] = useState(false)
  const [isQuizMode, setIsQuizMode] = useState(false)
  const [currentCardIndex, setCurrentCardIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)
  const [score, setScore] = useState({ correct: 0, incorrect: 0 })
  const [showAddFlashcard, setShowAddFlashcard] = useState(false)
  const [showMCQQuiz, setShowMCQQuiz] = useState(false)

  // Use flashcards from the note or fallback to mock data
  const flashcards =
    note.flashcards.length > 0
      ? note.flashcards
      : [
          {
            id: "fc-1",
            question: "What is the derivative of x²?",
            answer: "2x",
            noteId: note.id,
            confidence: "medium",
          },
          {
            id: "fc-2",
            question: "What is the power rule for derivatives?",
            answer: "If f(x) = xⁿ, then f'(x) = n·xⁿ⁻¹",
            noteId: note.id,
            confidence: "low",
          },
        ]

  // Generate flashcards from note content
  const generateFlashcards = () => {
    setIsGenerating(true)

    // Simulate AI generation
    setTimeout(() => {
      // Mock generated flashcards
      const generatedFlashcards: Flashcard[] = [
        {
          id: `fc-gen-${Date.now()}-1`,
          question: "What are the key components of the topic discussed?",
          answer: "The key components include definitions, principles, applications, and examples.",
          noteId: note.id,
          confidence: "medium",
        },
        {
          id: `fc-gen-${Date.now()}-2`,
          question: "How does this concept relate to real-world applications?",
          answer: "The concept applies to real-world scenarios through practical implementations and case studies.",
          noteId: note.id,
          confidence: "low",
        },
        {
          id: `fc-gen-${Date.now()}-3`,
          question: "What are the limitations of this approach?",
          answer: "The limitations include scope constraints, contextual dependencies, and resource requirements.",
          noteId: note.id,
          confidence: "medium",
        },
      ]

      // Update note with new flashcards
      updateNote(note.id, {
        flashcards: [...note.flashcards, ...generatedFlashcards],
      })

      setIsGenerating(false)
    }, 2000)
  }

  // Add a new flashcard
  const addFlashcard = (question: string, answer: string) => {
    const newFlashcard: Flashcard = {
      id: `fc-${Date.now()}`,
      question,
      answer,
      noteId: note.id,
      confidence: "medium",
    }

    updateNote(note.id, {
      flashcards: [...note.flashcards, newFlashcard],
    })
  }

  // Start quiz mode
  const startQuiz = () => {
    setIsQuizMode(true)
    setCurrentCardIndex(0)
    setIsFlipped(false)
    setScore({ correct: 0, incorrect: 0 })
  }

  // End quiz mode
  const endQuiz = () => {
    setIsQuizMode(false)
  }

  // Navigate to next card
  const nextCard = () => {
    if (currentCardIndex < flashcards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1)
      setIsFlipped(false)
    } else {
      // End of quiz
      endQuiz()
    }
  }

  // Navigate to previous card
  const prevCard = () => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex(currentCardIndex - 1)
      setIsFlipped(false)
    }
  }

  // Mark card as correct
  const markCorrect = () => {
    // Update confidence level
    const updatedFlashcards = [...note.flashcards]
    const cardIndex = updatedFlashcards.findIndex((card) => card.id === flashcards[currentCardIndex].id)

    if (cardIndex >= 0) {
      updatedFlashcards[cardIndex] = {
        ...updatedFlashcards[cardIndex],
        confidence: "high",
      }

      updateNote(note.id, { flashcards: updatedFlashcards })
    }

    setScore({ ...score, correct: score.correct + 1 })
    nextCard()
  }

  // Mark card as incorrect
  const markIncorrect = () => {
    // Update confidence level
    const updatedFlashcards = [...note.flashcards]
    const cardIndex = updatedFlashcards.findIndex((card) => card.id === flashcards[currentCardIndex].id)

    if (cardIndex >= 0) {
      updatedFlashcards[cardIndex] = {
        ...updatedFlashcards[cardIndex],
        confidence: "low",
      }

      updateNote(note.id, { flashcards: updatedFlashcards })
    }

    setScore({ ...score, incorrect: score.incorrect + 1 })
    nextCard()
  }

  // Generate AI MCQ Quiz
  const generateMCQQuiz = () => {
    setIsGenerating(true)

    // Simulate AI generation
    setTimeout(() => {
      setIsGenerating(false)
      setShowMCQQuiz(true)
    }, 1500)
  }

  // Render quiz mode
  if (showMCQQuiz) {
    return <MCQQuiz noteContent={note.content} onClose={() => setShowMCQQuiz(false)} />
  }

  // Render quiz mode
  if (isQuizMode) {
    const currentCard = flashcards[currentCardIndex]

    return (
      <div className="flex flex-col items-center">
        <div className="mb-4 w-full flex items-center justify-between">
          <Button variant="outline" size="sm" onClick={endQuiz}>
            Exit Quiz
          </Button>

          <div className="text-sm">
            Card {currentCardIndex + 1} of {flashcards.length}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-green-500 flex items-center">
              <Check className="h-4 w-4 mr-1" />
              {score.correct}
            </span>
            <span className="text-red-500 flex items-center">
              <X className="h-4 w-4 mr-1" />
              {score.incorrect}
            </span>
          </div>
        </div>

        <motion.div
          className="w-full max-w-md h-64 cursor-pointer perspective"
          onClick={() => setIsFlipped(!isFlipped)}
        >
          <motion.div
            className="relative w-full h-full glassmorphism rounded-xl p-6 flex items-center justify-center text-center"
            initial={false}
            animate={{ rotateY: isFlipped ? 180 : 0 }}
            transition={{ duration: 0.6 }}
            style={{ transformStyle: "preserve-3d" }}
          >
            <div
              className="absolute inset-0 backface-hidden flex items-center justify-center p-6"
              style={{ backfaceVisibility: "hidden" }}
            >
              <h3 className="text-xl font-medium">{currentCard.question}</h3>
            </div>

            <div
              className="absolute inset-0 backface-hidden flex items-center justify-center p-6"
              style={{
                backfaceVisibility: "hidden",
                transform: "rotateY(180deg)",
              }}
            >
              <p className="text-lg">{currentCard.answer}</p>
            </div>
          </motion.div>
        </motion.div>

        <p className="text-sm text-muted-foreground mt-4 mb-6">Click the card to flip it</p>

        <div className="flex items-center gap-4">
          {isFlipped ? (
            <>
              <Button variant="outline" size="sm" onClick={markIncorrect} className="text-red-500">
                <X className="h-4 w-4 mr-1" />
                Incorrect
              </Button>

              <Button size="sm" onClick={markCorrect} className="text-green-500">
                <Check className="h-4 w-4 mr-1" />
                Correct
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" size="sm" onClick={prevCard} disabled={currentCardIndex === 0}>
                <ArrowLeft className="h-4 w-4 mr-1" />
                Previous
              </Button>

              <Button variant="outline" size="sm" onClick={nextCard}>
                Skip
                <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </>
          )}
        </div>
      </div>
    )
  }

  // Render flashcard management
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">Flashcards</h2>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setShowAddFlashcard(true)}>
            <Plus className="h-4 w-4 mr-1" />
            Add Flashcard
          </Button>

          <Button variant="outline" onClick={generateFlashcards} disabled={isGenerating}>
            <Sparkles className="h-4 w-4 mr-1" />
            {isGenerating ? "Generating..." : "Generate from Note"}
          </Button>

          <Button variant="outline" onClick={generateMCQQuiz} disabled={isGenerating}>
            <BrainCircuit className="h-4 w-4 mr-1" />
            AI Quiz
          </Button>

          <Button onClick={startQuiz} disabled={flashcards.length === 0}>
            Start Quiz
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {flashcards.length > 0 ? (
          flashcards.map((card) => (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="glassmorphism rounded-xl p-4"
            >
              <div className="mb-2">
                <h3 className="font-medium">Question:</h3>
                <p className="text-muted-foreground">{card.question}</p>
              </div>

              <div>
                <h3 className="font-medium">Answer:</h3>
                <p className="text-muted-foreground">{card.answer}</p>
              </div>

              <div className="flex justify-end mt-2">
                <span
                  className={`text-xs px-2 py-1 rounded-full ${
                    card.confidence === "high"
                      ? "bg-green-500/20 text-green-500"
                      : card.confidence === "medium"
                        ? "bg-amber-500/20 text-amber-500"
                        : "bg-red-500/20 text-red-500"
                  }`}
                >
                  {card.confidence} confidence
                </span>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center p-12 text-center">
            <Sparkles className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-xl font-medium mb-2">No flashcards yet</h3>
            <p className="text-muted-foreground mb-6">
              Generate flashcards from your note content or create them manually.
            </p>
            <div className="flex gap-3">
              <Button onClick={() => setShowAddFlashcard(true)}>
                <Plus className="h-4 w-4 mr-1" />
                Add Flashcard
              </Button>
              <Button onClick={generateFlashcards}>
                <Sparkles className="h-4 w-4 mr-1" />
                Generate Flashcards
              </Button>
            </div>
          </div>
        )}
      </div>

      <AddFlashcardDialog open={showAddFlashcard} onOpenChange={setShowAddFlashcard} onAdd={addFlashcard} />
    </div>
  )
}
