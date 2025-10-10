"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { CheckCircle2, Clock, Plus, Trash2, Edit } from "lucide-react"
import { useStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { AddTaskDialog } from "@/components/tasks/add-task-dialog"
import { cn } from "@/lib/utils"

interface CourseTasksProps {
  courseId: string
}

export function CourseTasks({ courseId }: CourseTasksProps) {
  const { tasks, toggleTaskCompletion, deleteTask } = useStore()
  const [showAddTask, setShowAddTask] = useState(false)
  const [filter, setFilter] = useState<"all" | "pending" | "completed">("all")

  // Filter tasks for this course
  const courseTasks = tasks.filter((task) => task.courseId === courseId)

  // Apply filter
  const filteredTasks = courseTasks.filter((task) => {
    if (filter === "all") return true
    if (filter === "pending") return !task.completed
    if (filter === "completed") return task.completed
    return true
  })

  // Sort by due date and priority
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    // First by completion status
    if (a.completed && !b.completed) return 1
    if (!a.completed && b.completed) return -1

    // Then by due date
    const dateA = new Date(a.dueDate)
    const dateB = new Date(b.dueDate)
    if (dateA < dateB) return -1
    if (dateA > dateB) return 1

    // Then by priority
    const priorityOrder = { high: 0, medium: 1, low: 2 }
    return priorityOrder[a.priority] - priorityOrder[b.priority]
  })

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex space-x-2">
          <Button variant={filter === "all" ? "default" : "outline"} size="sm" onClick={() => setFilter("all")}>
            All
          </Button>
          <Button variant={filter === "pending" ? "default" : "outline"} size="sm" onClick={() => setFilter("pending")}>
            Pending
          </Button>
          <Button
            variant={filter === "completed" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("completed")}
          >
            Completed
          </Button>
        </div>

        <Button onClick={() => setShowAddTask(true)}>
          <Plus className="h-4 w-4 mr-1" />
          Add Task
        </Button>
      </div>

      <AnimatePresence>
        {sortedTasks.length > 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-3">
            {sortedTasks.map((task) => (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                whileHover={{ scale: 1.01 }}
                className={cn("flex items-start p-4 rounded-xl glassmorphism", task.completed && "opacity-60")}
              >
                <div className="flex-shrink-0 mt-0.5">
                  <CheckCircle2
                    className={cn(
                      "h-5 w-5 cursor-pointer",
                      task.completed ? "text-primary fill-primary" : "text-muted-foreground",
                    )}
                    onClick={() => toggleTaskCompletion(task.id)}
                  />
                </div>

                <div className="ml-3 flex-1">
                  <p className={cn("font-medium", task.completed && "line-through")}>{task.title}</p>

                  {task.description && <p className="text-sm text-muted-foreground mt-1">{task.description}</p>}

                  <div className="flex items-center mt-2 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3 mr-1" />
                    <span>
                      Due{" "}
                      {new Date(task.dueDate).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        hour: "numeric",
                        minute: "2-digit",
                      })}
                    </span>

                    <span
                      className={cn(
                        "ml-2 px-1.5 py-0.5 rounded text-xs",
                        task.priority === "high" && "bg-red-500/20 text-red-500",
                        task.priority === "medium" && "bg-amber-500/20 text-amber-500",
                        task.priority === "low" && "bg-green-500/20 text-green-500",
                      )}
                    >
                      {task.priority}
                    </span>
                  </div>
                </div>

                <div className="flex space-x-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => {
                      // Edit task functionality would go here
                    }}
                  >
                    <Edit className="h-4 w-4" />
                    <span className="sr-only">Edit</span>
                  </Button>

                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive"
                    onClick={() => deleteTask(task.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Delete</span>
                  </Button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center p-12 text-center"
          >
            <Clock className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-xl font-medium mb-2">No tasks found</h3>
            <p className="text-muted-foreground mb-6">
              {filter === "all"
                ? "You haven't added any tasks for this course yet."
                : filter === "pending"
                  ? "You don't have any pending tasks for this course."
                  : "You haven't completed any tasks for this course yet."}
            </p>
            <Button onClick={() => setShowAddTask(true)}>
              <Plus className="h-4 w-4 mr-1" />
              Add Your First Task
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      <AddTaskDialog open={showAddTask} onOpenChange={setShowAddTask} />
    </div>
  )
}
