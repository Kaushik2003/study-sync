"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { ChevronLeft, BookOpen, Plus, FileText, Calendar, Clock } from "lucide-react"
import { useStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CourseTasks } from "./course-tabs/course-tasks"
import { CourseNotes } from "./course-tabs/course-notes"
import { CourseResources } from "./course-tabs/course-resources"
import { CourseExams } from "./course-tabs/course-exams"
import { AddTaskDialog } from "../tasks/add-task-dialog"

interface CourseDetailsProps {
  courseId: string
  onBack: () => void
}

export function CourseDetails({ courseId, onBack }: CourseDetailsProps) {
  const { courses } = useStore()
  const [activeTab, setActiveTab] = useState("tasks")
  const [showAddTask, setShowAddTask] = useState(false)

  // Find the course
  const course = courses.find((c) => c.id === courseId)

  if (!course) {
    return (
      <div className="flex flex-col items-center justify-center p-12">
        <h2 className="text-2xl font-bold mb-2">Course not found</h2>
        <Button onClick={onBack}>Go Back</Button>
      </div>
    )
  }

  return (
    <div>
      <Button variant="ghost" className="mb-4" onClick={onBack}>
        <ChevronLeft className="h-4 w-4 mr-1" />
        Back to Courses
      </Button>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`course-${course.color.split("-")[0]} glassmorphism rounded-2xl p-6 mb-6`}
      >
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold">{course.name}</h1>
            <p className="text-muted-foreground">
              {course.tasks?.filter((t) => !t.completed).length || 0} pending tasks
            </p>
          </div>

          <div className={`h-12 w-12 rounded-full flex items-center justify-center bg-${course.color} bg-opacity-20`}>
            <BookOpen className={`h-6 w-6 text-${course.color}`} />
          </div>
        </div>

        <div className="mb-4">
          <div className="flex items-center justify-between text-sm mb-1">
            <span>Course Progress</span>
            <span>{course.progress}%</span>
          </div>
          <Progress value={course.progress} className="h-2" />
        </div>

        <div className="flex justify-end">
          <Button onClick={() => setShowAddTask(true)}>
            <Plus className="h-4 w-4 mr-1" />
            Add Task
          </Button>
        </div>
      </motion.div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-4 mb-6">
          <TabsTrigger value="tasks" className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>Tasks</span>
          </TabsTrigger>
          <TabsTrigger value="notes" className="flex items-center gap-1">
            <FileText className="h-4 w-4" />
            <span>Notes</span>
          </TabsTrigger>
          <TabsTrigger value="resources" className="flex items-center gap-1">
            <BookOpen className="h-4 w-4" />
            <span>Resources</span>
          </TabsTrigger>
          <TabsTrigger value="exams" className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            <span>Exams</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="tasks">
          <CourseTasks courseId={courseId} />
        </TabsContent>

        <TabsContent value="notes">
          <CourseNotes courseId={courseId} />
        </TabsContent>

        <TabsContent value="resources">
          <CourseResources courseId={courseId} />
        </TabsContent>

        <TabsContent value="exams">
          <CourseExams courseId={courseId} />
        </TabsContent>
      </Tabs>

      <AddTaskDialog open={showAddTask} onOpenChange={setShowAddTask} />
    </div>
  )
}
