"use client"

import { useState } from "react"
import { ArrowLeft, ArrowRight, Check, X, BrainCircuit } from "lucide-react"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

interface MCQQuizProps {
  noteContent: string
  onClose: () => void
}

export function MCQQuiz({ noteContent, onClose }: MCQQuizProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [isAnswered, setIsAnswered] = useState(false)
  const [score, setScore] = useState(0)
  const [quizCompleted, setQuizCompleted] = useState(false)

  // Mock MCQ questions based on note content
  const questions = [
    {
      question: "What is the main concept discussed in the notes?",
      options: [
        "Mathematical formulas and equations",
        "Historical events and timelines",
        "Scientific principles and theories",
        "Literary analysis and interpretation",
      ],
      correctAnswer: 2,
    },
    {
      question: "Which of the following best describes the application of the concept?",
      options: [
        "It's primarily used in theoretical research",
        "It has practical applications in everyday scenarios",
        "It's mainly used for educational purposes",
        "It's only relevant in specialized fields",
      ],
      correctAnswer: 1,
    },
    {
      question: "What is a key limitation of the approach discussed?",
      options: [
        "High computational requirements",
        "Limited scope of application",
        "Complexity of implementation",
        "Lack of theoretical foundation",
      ],
      correctAnswer: 0,
    },
    {
      question: "Which of these is NOT mentioned as a related concept?",
      options: ["Fundamental principles", "Practical applications", "Historical development", "Economic implications"],
      correctAnswer: 3,
    },
    {
      question: "What would be the most appropriate next step after understanding this concept?",
      options: [
        "Apply it to solve real-world problems",
        "Study advanced theoretical extensions",
        "Research historical context",
        "Compare with alternative approaches",
      ],
      correctAnswer: 0,
    },
  ]

  const currentQ = questions[currentQuestion]

  const checkAnswer = () => {
    if (selectedAnswer === null) return

    setIsAnswered(true)
    if (Number.parseInt(selectedAnswer) === currentQ.correctAnswer) {
      setScore(score + 1)
    }
  }

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
      setSelectedAnswer(null)
      setIsAnswered(false)
    } else {
      setQuizCompleted(true)
    }
  }

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
      setSelectedAnswer(null)
      setIsAnswered(false)
    }
  }

  if (quizCompleted) {
    return (
      <div className="flex flex-col items-center text-center">
        <BrainCircuit className="h-16 w-16 text-primary mb-4" />
        <h2 className="text-2xl font-bold mb-2">Quiz Completed!</h2>
        <p className="text-lg mb-6">
          Your score: <span className="font-bold">{score}</span> out of {questions.length}
        </p>
        <p className="text-muted-foreground mb-8">
          {score === questions.length
            ? "Perfect score! You've mastered this topic."
            : score >= questions.length / 2
              ? "Good job! You have a solid understanding of the material."
              : "Keep studying! Review the material to improve your understanding."}
        </p>
        <Button onClick={onClose}>Return to Flashcards</Button>
      </div>
    )
  }

  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <Button variant="outline" size="sm" onClick={onClose}>
          Exit Quiz
        </Button>
        <div className="text-sm">
          Question {currentQuestion + 1} of {questions.length}
        </div>
        <div className="text-sm font-medium">
          Score: {score}/{questions.length}
        </div>
      </div>

      <div className="glassmorphism rounded-xl p-6 mb-6">
        <h3 className="text-xl font-medium mb-4">{currentQ.question}</h3>

        <RadioGroup value={selectedAnswer || ""} onValueChange={setSelectedAnswer} className="space-y-3">
          {currentQ.options.map((option, index) => (
            <div
              key={index}
              className={cn(
                "flex items-center space-x-2 rounded-lg border p-3 cursor-pointer",
                isAnswered && index === currentQ.correctAnswer && "border-green-500 bg-green-500/10",
                isAnswered &&
                  selectedAnswer === index.toString() &&
                  index !== currentQ.correctAnswer &&
                  "border-red-500 bg-red-500/10",
              )}
            >
              <RadioGroupItem value={index.toString()} id={`option-${index}`} disabled={isAnswered} />
              <Label
                htmlFor={`option-${index}`}
                className={cn(
                  "flex-1 cursor-pointer",
                  isAnswered && index === currentQ.correctAnswer && "text-green-500",
                  isAnswered &&
                    selectedAnswer === index.toString() &&
                    index !== currentQ.correctAnswer &&
                    "text-red-500",
                )}
              >
                {option}
              </Label>
              {isAnswered && index === currentQ.correctAnswer && <Check className="h-5 w-5 text-green-500" />}
              {isAnswered && selectedAnswer === index.toString() && index !== currentQ.correctAnswer && (
                <X className="h-5 w-5 text-red-500" />
              )}
            </div>
          ))}
        </RadioGroup>
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={prevQuestion} disabled={currentQuestion === 0}>
          <ArrowLeft className="h-4 w-4 mr-1" />
          Previous
        </Button>

        {!isAnswered ? (
          <Button onClick={checkAnswer} disabled={selectedAnswer === null}>
            Check Answer
          </Button>
        ) : (
          <Button onClick={nextQuestion}>
            {currentQuestion < questions.length - 1 ? (
              <>
                Next
                <ArrowRight className="h-4 w-4 ml-1" />
              </>
            ) : (
              "Complete Quiz"
            )}
          </Button>
        )}
      </div>
    </div>
  )
}
