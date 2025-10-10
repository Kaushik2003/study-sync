"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { BookOpen, ChevronRight, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Course } from "@/lib/store"
import { useStore } from "@/lib/store"

interface CoursesWidgetProps {
  courses: Course[]
}

export function CoursesWidget({ courses }: CoursesWidgetProps) {
  const { tasks, notes } = useStore()

  return (
    <div className="widget">
      <div className="widget-header">
        <h2 className="widget-title">My Courses</h2>
        <Button variant="ghost" size="sm" asChild>
          <Link href="/courses">
            <span className="mr-1">View All</span>
            <ChevronRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>

      <div className="widget-content">
        <div className="widget-scrollable grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {courses.map((course) => {
            // Count tasks, notes, and upcoming exams
            const pendingTasks = tasks.filter((t) => t.courseId === course.id && !t.completed).length
            const notesCount = notes.filter((n) => n.courseId === course.id).length
            const upcomingExams =
              course.exams?.filter((e) => {
                const examDate = new Date(e.date)
                return examDate > new Date()
              }).length || 0

            // Default thumbnail if none provided
            const thumbnail = course.thumbnail || `/placeholder.svg?height=100&width=200`

            return (
              <motion.div
                key={course.id}
                whileHover={{ scale: 1.02 }}
                className="glassmorphism rounded-xl overflow-hidden cursor-pointer glow-hover"
                onClick={() => (window.location.href = "/courses")}
              >
                <div className="relative h-24 overflow-hidden">
                  <img src={thumbnail || "/placeholder.svg"} alt={course.name} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent" />
                  <h3 className="absolute bottom-2 left-3 text-base font-bold">{course.name}</h3>
                </div>

                <div className="p-3">
                  <div className="grid grid-cols-3 gap-1 text-center">
                    <div className="flex flex-col items-center p-1 rounded-lg bg-card/50">
                      <span className="text-xs text-muted-foreground">Tasks</span>
                      <span className="font-medium text-sm">{pendingTasks}</span>
                    </div>

                    <div className="flex flex-col items-center p-1 rounded-lg bg-card/50">
                      <span className="text-xs text-muted-foreground">Notes</span>
                      <span className="font-medium text-sm">{notesCount}</span>
                    </div>

                    <div className="flex flex-col items-center p-1 rounded-lg bg-card/50">
                      <span className="text-xs text-muted-foreground">Exams</span>
                      <span className="font-medium text-sm">{upcomingExams}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )
          })}

          {courses.length === 0 && (
            <div className="col-span-full flex flex-col items-center justify-center p-4 text-center">
              <BookOpen className="h-8 w-8 text-muted-foreground mb-2" />
              <h3 className="font-medium mb-1 text-sm">No courses yet</h3>
              <p className="text-xs text-muted-foreground mb-3">Add your first course to get started</p>
              <Button size="sm" asChild>
                <Link href="/courses">
                  <Plus className="h-3 w-3 mr-1" />
                  <span>Add Course</span>
                </Link>
              </Button>
            </div>
          )}

          {/* Add Course Button */}
          {courses.length > 0 && (
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="glassmorphism rounded-xl overflow-hidden cursor-pointer border-dashed border-2 border-border flex items-center justify-center"
              onClick={() => (window.location.href = "/courses")}
            >
              <div className="flex flex-col items-center justify-center p-6 text-center">
                <div className="h-12 w-12 rounded-full bg-card/50 flex items-center justify-center mb-2">
                  <Plus className="h-6 w-6 text-muted-foreground" />
                </div>
                <p className="font-medium">Add New Course</p>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}
