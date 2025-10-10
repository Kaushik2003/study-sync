"use client"

import { motion } from "framer-motion"
import { FileText, Calendar, Clock } from "lucide-react"
import type { Course } from "@/lib/store"
import { useStore } from "@/lib/store"

interface CourseCardProps {
  course: Course
  onClick: () => void
}

export function CourseCard({ course, onClick }: CourseCardProps) {
  const { tasks, notes } = useStore()

  // Count tasks, notes, and upcoming exams
  const pendingTasks = tasks.filter((t) => t.courseId === course.id && !t.completed).length
  const notesCount = notes.filter((n) => n.courseId === course.id).length
  const upcomingExams =
    course.exams?.filter((e) => {
      const examDate = new Date(e.date)
      return examDate > new Date()
    }).length || 0

  // Get course color for styling
  const colorClass = `bg-${course.color}`
  const textColorClass = `text-${course.color}`

  // Default thumbnail if none provided
  const thumbnail = course.thumbnail || `/placeholder.svg?height=200&width=400`

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="glassmorphism rounded-2xl overflow-hidden cursor-pointer glow-hover"
    >
      <div className="relative h-40 overflow-hidden">
        <img
          src={course.thumbnail || `/placeholder.svg?height=200&width=400&text=${encodeURIComponent(course.name)}`}
          alt={course.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.currentTarget.src = `/placeholder.svg?height=200&width=400&text=${encodeURIComponent(course.name)}`
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent" />
        <h3 className="absolute bottom-4 left-4 text-xl font-bold">{course.name}</h3>
      </div>

      <div className="p-4">
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="flex flex-col items-center p-2 rounded-lg bg-card/50">
            <FileText className="h-4 w-4 mb-1 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">Tasks</span>
            <span className="font-medium">{pendingTasks}</span>
          </div>

          <div className="flex flex-col items-center p-2 rounded-lg bg-card/50">
            <Clock className="h-4 w-4 mb-1 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">Notes</span>
            <span className="font-medium">{notesCount}</span>
          </div>

          <div className="flex flex-col items-center p-2 rounded-lg bg-card/50">
            <Calendar className="h-4 w-4 mb-1 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">Exams</span>
            <span className="font-medium">{upcomingExams}</span>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
