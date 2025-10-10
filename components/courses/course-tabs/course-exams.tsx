"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Calendar, Plus } from "lucide-react"
import { useStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { AddExamDialog } from "@/components/exams/add-exam-dialog"

interface CourseExamsProps {
  courseId: string
}

export function CourseExams({ courseId }: CourseExamsProps) {
  const { courses } = useStore()
  const [showAddExam, setShowAddExam] = useState(false)

  // Find the course
  const course = courses.find((c) => c.id === courseId)

  // Get exams for this course
  const exams = course?.exams || []

  // Sort exams by date
  const sortedExams = [...exams].sort((a, b) => {
    return new Date(a.date).getTime() - new Date(b.date).getTime()
  })

  // Calculate days until exam
  const getDaysUntil = (dateString: string) => {
    const examDate = new Date(dateString)
    const today = new Date()
    const diffTime = examDate.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">Upcoming Exams</h2>
        <Button onClick={() => setShowAddExam(true)}>
          <Plus className="h-4 w-4 mr-1" />
          Add Exam
        </Button>
      </div>

      <AnimatePresence>
        {sortedExams.length > 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
            {sortedExams.map((exam) => {
              const daysUntil = getDaysUntil(exam.date)
              const isPast = daysUntil < 0

              return (
                <motion.div
                  key={exam.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  whileHover={{ scale: 1.01 }}
                  className="glassmorphism rounded-xl p-4"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-medium">{exam.title}</h3>
                      {exam.description && <p className="text-sm text-muted-foreground mt-1">{exam.description}</p>}
                    </div>

                    <div
                      className={`px-3 py-1 rounded-full text-sm ${
                        isPast
                          ? "bg-muted text-muted-foreground"
                          : daysUntil <= 3
                            ? "bg-red-500/20 text-red-500"
                            : daysUntil <= 7
                              ? "bg-amber-500/20 text-amber-500"
                              : "bg-green-500/20 text-green-500"
                      }`}
                    >
                      {isPast
                        ? "Past"
                        : daysUntil === 0
                          ? "Today"
                          : daysUntil === 1
                            ? "Tomorrow"
                            : `${daysUntil} days left`}
                    </div>
                  </div>

                  <div className="flex items-center text-sm text-muted-foreground mb-3">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span>
                      {new Date(exam.date).toLocaleDateString("en-US", {
                        weekday: "short",
                        month: "short",
                        day: "numeric",
                        hour: "numeric",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>

                  <div className="mb-2">
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span>Preparation Progress</span>
                      <span>{exam.progress}%</span>
                    </div>
                    <Progress value={exam.progress} className="h-2" />
                  </div>
                </motion.div>
              )
            })}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center p-12 text-center"
          >
            <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-xl font-medium mb-2">No exams scheduled</h3>
            <p className="text-muted-foreground mb-6">Add your upcoming exams to track preparation progress.</p>
            <Button onClick={() => setShowAddExam(true)}>
              <Plus className="h-4 w-4 mr-1" />
              Schedule Your First Exam
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      <AddExamDialog open={showAddExam} onOpenChange={setShowAddExam} courseId={courseId} />
    </div>
  )
}
