"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Bell, Plus, User, Settings, Sun, Moon, X, AlertTriangle, Clock, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { AddTaskDialog } from "./tasks/add-task-dialog"
import { useTheme } from "next-themes"
import Link from "next/link"
import { useStore } from "@/lib/store"

export function TopBar() {
  const [date, setDate] = useState(new Date())
  const [showAddTask, setShowAddTask] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()
  const { tasks } = useStore()
  const notificationsRef = useRef<HTMLDivElement>(null)

  // Set mounted state after hydration
  useEffect(() => {
    setMounted(true)
  }, [])

  // Update date every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setDate(new Date())
    }, 60000)

    return () => clearInterval(interval)
  }, [])

  // Close notifications when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setShowNotifications(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  // Format date: Monday, January 1, 2023
  const formattedDate = date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  // Format time: 12:00 PM
  const formattedTime = date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  })

  // Toggle theme
  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  // Get notifications
  const getNotifications = () => {
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

    return notifications.slice(0, 5) // Return only 5 most recent
  }

  const notifications = getNotifications()
  const hasNotifications = notifications.length > 0

  return (
    <motion.div
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.2 }}
      className="h-16 border-b border-border/50 glassmorphism flex items-center justify-between px-4 md:px-6"
    >
      <div className="flex items-center space-x-4">
        <div className="hidden md:block">
          <p className="text-sm text-muted-foreground">{formattedDate}</p>
          <p className="text-lg font-semibold">{formattedTime}</p>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        {mounted && (
          <Button variant="outline" size="icon" className="relative glow-hover" onClick={toggleTheme}>
            {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            <span className="sr-only">Toggle Theme</span>
          </Button>
        )}

        <Button variant="outline" size="icon" className="relative glow-hover" onClick={() => setShowAddTask(true)}>
          <Plus className="h-5 w-5" />
          <span className="sr-only">Add Task</span>
        </Button>

        <div className="relative" ref={notificationsRef}>
          <Button
            variant="outline"
            size="icon"
            className="relative glow-hover"
            onClick={() => setShowNotifications(!showNotifications)}
          >
            <Bell className="h-5 w-5" />
            <span className="sr-only">Notifications</span>
            {hasNotifications && <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-primary"></span>}
          </Button>

          <AnimatePresence>
            {showNotifications && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute right-0 mt-2 w-80 z-[9999]"
              >
                <div className="glassmorphism-high-z rounded-xl overflow-hidden shadow-lg">
                  <div className="flex items-center justify-between p-3 border-b border-border/50">
                    <h3 className="font-medium">Notifications</h3>
                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setShowNotifications(false)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="max-h-[300px] overflow-y-auto">
                    {notifications.length > 0 ? (
                      <div className="divide-y divide-border/50">
                        {notifications.map((notification, index) => (
                          <Link
                            key={index}
                            href="/planner"
                            className="block p-3 hover:bg-card/50 transition-colors"
                            onClick={() => setShowNotifications(false)}
                          >
                            <div className="flex items-start">
                              <div className={`flex-shrink-0 mt-0.5 ${notification.color}`}>
                                <notification.icon className="h-5 w-5" />
                              </div>
                              <div className="ml-3 flex-1">
                                <p className="font-medium text-sm">{notification.task.title}</p>
                                <p className="text-xs text-muted-foreground mt-0.5">
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
                                </p>
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    ) : (
                      <div className="p-6 text-center">
                        <Bell className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                        <p className="text-sm text-muted-foreground">No notifications at the moment</p>
                      </div>
                    )}
                  </div>

                  {notifications.length > 0 && (
                    <div className="p-3 border-t border-border/50">
                      <Button variant="outline" size="sm" className="w-full" asChild>
                        <Link href="/planner" onClick={() => setShowNotifications(false)}>
                          View All
                        </Link>
                      </Button>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon" className="glow-hover">
              <User className="h-5 w-5" />
              <span className="sr-only">User Menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/account">
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/account">
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <AddTaskDialog open={showAddTask} onOpenChange={setShowAddTask} />
    </motion.div>
  )
}
