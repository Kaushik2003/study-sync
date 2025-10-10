"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Clock, CheckCircle2 } from "lucide-react"
import { useStore } from "@/lib/store"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface WeeklyCalendarProps {
  startDate: Date
}

export function WeeklyCalendar({ startDate }: WeeklyCalendarProps) {
  const { tasks, courses, toggleTaskCompletion } = useStore()
  const [calendarDays, setCalendarDays] = useState<Date[]>([])
  const [calendarHours, setCalendarHours] = useState<string[]>([])

  // Generate calendar days and hours
  useEffect(() => {
    // Generate 7 days starting from startDate
    const days: Date[] = []
    for (let i = 0; i < 7; i++) {
      const day = new Date(startDate)
      day.setDate(startDate.getDate() + i)
      days.push(day)
    }
    setCalendarDays(days)

    // Generate hours from 8 AM to 10 PM
    const hours: string[] = []
    for (let i = 8; i <= 22; i++) {
      hours.push(`${i % 12 === 0 ? 12 : i % 12}:00 ${i < 12 ? "AM" : "PM"}`)
    }
    setCalendarHours(hours)
  }, [startDate])

  // Get tasks for a specific day
  const getTasksForDay = (day: Date) => {
    const dayStart = new Date(day)
    dayStart.setHours(0, 0, 0, 0)

    const dayEnd = new Date(day)
    dayEnd.setHours(23, 59, 59, 999)

    return tasks.filter((task) => {
      const taskDate = new Date(task.dueDate)
      return taskDate >= dayStart && taskDate <= dayEnd
    })
  }

  // Get course color
  const getCourseColor = (courseId: string) => {
    const course = courses.find((c) => c.id === courseId)
    return course ? course.color : "gray-500"
  }

  // Get hour from date
  const getHourFromDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.getHours()
  }

  // Check if a day is today
  const isToday = (day: Date) => {
    const today = new Date()
    return (
      day.getDate() === today.getDate() &&
      day.getMonth() === today.getMonth() &&
      day.getFullYear() === today.getFullYear()
    )
  }

  return (
    <div className="overflow-x-auto">
      <div className="min-w-[800px]">
        {/* Calendar header */}
        <div className="grid grid-cols-8 gap-1 mb-2">
          <div className="h-16"></div>
          {calendarDays.map((day, index) => (
            <div
              key={index}
              className={cn(
                "h-16 flex flex-col items-center justify-center rounded-lg",
                isToday(day) && "bg-primary/10",
              )}
            >
              <p className="text-sm font-medium">{day.toLocaleDateString("en-US", { weekday: "short" })}</p>
              <p className={cn("text-2xl font-bold", isToday(day) && "text-primary")}>{day.getDate()}</p>
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-8 gap-1">
          {/* Time column */}
          <div className="space-y-1">
            {calendarHours.map((hour, index) => (
              <div key={index} className="h-20 flex items-center justify-center text-xs text-muted-foreground">
                {hour}
              </div>
            ))}
          </div>

          {/* Days columns */}
          {calendarDays.map((day, dayIndex) => (
            <div key={dayIndex} className="space-y-1">
              {calendarHours.map((hour, hourIndex) => {
                const hourValue = hourIndex + 8 // Starting from 8 AM
                const tasksForDay = getTasksForDay(day)
                const tasksForHour = tasksForDay.filter((task) => {
                  const taskHour = getHourFromDate(task.dueDate)
                  return taskHour === hourValue
                })

                return (
                  <div
                    key={hourIndex}
                    className={cn("h-20 rounded-lg border border-border/50 p-1", isToday(day) && "bg-primary/5")}
                  >
                    {tasksForHour.map((task) => (
                      <motion.div
                        key={task.id}
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        whileHover={{ scale: 1.02 }}
                        className={cn(
                          "text-xs p-1 rounded mb-1 cursor-pointer",
                          `bg-${getCourseColor(task.courseId)}/20 text-${getCourseColor(task.courseId)}`,
                          task.completed && "opacity-50",
                        )}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <Clock className="h-3 w-3 mr-1" />
                            <span>
                              {new Date(task.dueDate).toLocaleTimeString("en-US", {
                                hour: "numeric",
                                minute: "2-digit",
                              })}
                            </span>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-4 w-4 p-0"
                            onClick={() => toggleTaskCompletion(task.id)}
                          >
                            <CheckCircle2
                              className={cn(
                                "h-3 w-3",
                                task.completed ? "text-primary fill-primary" : "text-muted-foreground",
                              )}
                            />
                          </Button>
                        </div>
                        <p className={cn("font-medium truncate", task.completed && "line-through")}>{task.title}</p>
                      </motion.div>
                    ))}
                  </div>
                )
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
