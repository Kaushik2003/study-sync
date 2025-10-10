"use client"

import { motion } from "framer-motion"
import { Bell, AlertTriangle, Clock, Calendar, CheckCircle2 } from "lucide-react"
import type { Task } from "@/lib/store"
import { useStore } from "@/lib/store"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface NotificationsWidgetProps {
  tasks: Task[]
}

export function NotificationsWidget({ tasks }: NotificationsWidgetProps) {
  const { toggleTaskCompletion } = useStore()

  // Get upcoming and overdue tasks - FIX: Use proper date comparison
  const now = new Date()
  const today = new Date(now)
  today.setHours(0, 0, 0, 0)

  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)

  // Overdue tasks
  const overdueTasks = tasks.filter((task) => {
    if (task.completed) return false
    const taskDate = new Date(task.dueDate)
    return taskDate < now && taskDate.setHours(0, 0, 0, 0) < today.getTime()
  })

  // Due today
  const dueTodayTasks = tasks.filter((task) => {
    if (task.completed) return false
    const taskDate = new Date(task.dueDate)
    const taskDay = new Date(taskDate)
    taskDay.setHours(0, 0, 0, 0)
    return taskDay.getTime() === today.getTime() && taskDate > now
  })

  // Due tomorrow
  const dueTomorrowTasks = tasks.filter((task) => {
    if (task.completed) return false
    const taskDate = new Date(task.dueDate)
    const taskDay = new Date(taskDate)
    taskDay.setHours(0, 0, 0, 0)
    return taskDay.getTime() === tomorrow.getTime()
  })

  // Combine notifications
  const notifications = [
    ...overdueTasks.map((task) => ({
      type: "overdue",
      task,
      icon: AlertTriangle,
      color: "text-red-500",
    })),
    ...dueTodayTasks.map((task) => ({
      type: "today",
      task,
      icon: Clock,
      color: "text-amber-500",
    })),
    ...dueTomorrowTasks.map((task) => ({
      type: "tomorrow",
      task,
      icon: Calendar,
      color: "text-blue-500",
    })),
  ]

  return (
    <div className="widget">
      <div className="widget-header">
        <h2 className="widget-title">Notifications</h2>
        <Bell className="h-5 w-5 text-primary" />
      </div>

      <div className="widget-content">
        <div className="flex overflow-x-auto gap-3 pb-1">
          {notifications.length > 0 ? (
            notifications.slice(0, 5).map((notification, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                whileHover={{ scale: 1.01 }}
                className="flex-shrink-0 w-64 p-2 rounded-lg bg-card/50"
              >
                <div className={`flex items-start ${notification.color}`}>
                  <notification.icon className="h-4 w-4 mt-0.5" />
                  <div className="ml-2 flex-1">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-sm">{notification.task.title}</p>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 ml-1"
                        onClick={() => toggleTaskCompletion(notification.task.id)}
                      >
                        <CheckCircle2
                          className={cn(
                            "h-4 w-4",
                            notification.task.completed ? "text-primary fill-primary" : "text-muted-foreground",
                          )}
                        />
                      </Button>
                    </div>

                    <div className="text-xs mt-1">
                      {notification.type === "overdue" && (
                        <span className="text-red-500">
                          Overdue - Due{" "}
                          {new Date(notification.task.dueDate).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                          })}
                        </span>
                      )}

                      {notification.type === "today" && (
                        <span className="text-amber-500">
                          Due today at{" "}
                          {new Date(notification.task.dueDate).toLocaleTimeString("en-US", {
                            hour: "numeric",
                            minute: "2-digit",
                          })}
                        </span>
                      )}

                      {notification.type === "tomorrow" && (
                        <span className="text-blue-500">
                          Due tomorrow at{" "}
                          {new Date(notification.task.dueDate).toLocaleTimeString("en-US", {
                            hour: "numeric",
                            minute: "2-digit",
                          })}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-2 text-center w-full">
              <Bell className="h-5 w-5 text-muted-foreground mb-1" />
              <p className="text-sm text-muted-foreground">No notifications at the moment</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
