"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { CheckCircle2, Clock, ListTodo } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Task } from "@/lib/store"
import { cn } from "@/lib/utils"
import { useStore } from "@/lib/store"

interface TodaysPlanWidgetProps {
  tasks: Task[]
}

export function TodaysPlanWidget({ tasks }: TodaysPlanWidgetProps) {
  const { toggleTaskCompletion } = useStore()

  // Filter tasks for today - FIX: Use proper date comparison
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const todaysTasks = tasks.filter((task) => {
    const taskDate = new Date(task.dueDate)
    taskDate.setHours(0, 0, 0, 0)
    return taskDate.getTime() === today.getTime()
  })

  // Sort by priority
  const sortedTasks = [...todaysTasks].sort((a, b) => {
    const priorityOrder = { high: 0, medium: 1, low: 2 }
    return priorityOrder[a.priority] - priorityOrder[b.priority]
  })

  return (
    <div className="widget">
      <div className="widget-header">
        <h2 className="widget-title">Today's Plan</h2>
        <span className="text-sm text-muted-foreground">
          {new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" })}
        </span>
      </div>

      <div className="widget-content">
        <div className="widget-scrollable space-y-2">
          {sortedTasks.length > 0 ? (
            sortedTasks.map((task) => (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                whileHover={{ scale: 1.02 }}
                className={cn("flex items-start p-2 rounded-lg bg-card/50", task.completed && "opacity-60")}
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
                  <p className={cn("font-medium text-sm", task.completed && "line-through")}>{task.title}</p>

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
              <ListTodo className="h-8 w-8 text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">No tasks scheduled for today</p>
            </div>
          )}
        </div>

        <div className="flex justify-between mt-3">
          <Button variant="outline" size="sm" asChild>
            <Link href="/planner">View Planner</Link>
          </Button>

          <Button size="sm" asChild>
            <Link href="/focus">
              <Clock className="h-4 w-4 mr-1" />
              Start Focus Session
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
