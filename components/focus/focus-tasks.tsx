"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { CheckCircle2, Clock, Plus } from "lucide-react"
import { useStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { AddTaskDialog } from "../tasks/add-task-dialog"

export function FocusTasks() {
  const { tasks, toggleTaskCompletion, currentTask, setCurrentTask } = useStore()
  const [showAddTask, setShowAddTask] = useState(false)

  // Get today's tasks - FIX: Use proper date comparison
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)

  const todaysTasks = tasks.filter((task) => {
    const taskDate = new Date(task.dueDate)
    taskDate.setHours(0, 0, 0, 0)
    return taskDate.getTime() === today.getTime() && !task.completed
  })

  // Sort by priority
  const sortedTasks = [...todaysTasks].sort((a, b) => {
    const priorityOrder = { high: 0, medium: 1, low: 2 }
    return priorityOrder[a.priority] - priorityOrder[b.priority]
  })

  return (
    <div className="glassmorphism rounded-2xl p-6 h-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Today's Tasks</h2>
        <Button variant="ghost" size="icon" onClick={() => setShowAddTask(true)}>
          <Plus className="h-5 w-5" />
          <span className="sr-only">Add Task</span>
        </Button>
      </div>

      <div className="space-y-3 mb-4 max-h-[calc(100vh-240px)] overflow-y-auto pr-1">
        {sortedTasks.length > 0 ? (
          sortedTasks.map((task) => (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              whileHover={{ scale: 1.02 }}
              className={cn(
                "flex items-start p-3 rounded-lg bg-card/50 cursor-pointer",
                currentTask === task.id && "ring-2 ring-primary",
              )}
              onClick={() => setCurrentTask(task.id)}
            >
              <div className="flex-shrink-0 mt-0.5">
                <CheckCircle2
                  className={cn(
                    "h-5 w-5 cursor-pointer",
                    task.completed ? "text-primary fill-primary" : "text-muted-foreground",
                  )}
                  onClick={(e) => {
                    e.stopPropagation()
                    toggleTaskCompletion(task.id)
                  }}
                />
              </div>

              <div className="ml-3 flex-1">
                <p className={cn("font-medium", task.completed && "line-through")}>{task.title}</p>

                <div className="flex items-center mt-1 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3 mr-1" />
                  <span>
                    Due{" "}
                    {new Date(task.dueDate).toLocaleTimeString("en-US", {
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
            </motion.div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <Clock className="h-8 w-8 text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground">No tasks scheduled for today</p>
          </div>
        )}
      </div>

      <AddTaskDialog open={showAddTask} onOpenChange={setShowAddTask} />
    </div>
  )
}
