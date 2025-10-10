"use client"

import { CheckCircle2, Clock, Brain } from "lucide-react"
import type { Task, FocusSession } from "@/lib/store"
import { Progress } from "@/components/ui/progress"

interface StatsWidgetProps {
  tasks: Task[]
  focusSessions: FocusSession[]
}

export function StatsWidget({ tasks, focusSessions }: StatsWidgetProps) {
  // Calculate stats
  const today = new Date().toISOString().split("T")[0]

  // Tasks completed today
  const tasksCompletedToday = tasks.filter((task) => {
    if (!task.completed) return false
    const completedDate = new Date(task.createdAt).toISOString().split("T")[0]
    return completedDate === today
  }).length

  // Total tasks for today
  const totalTasksToday = tasks.filter((task) => {
    const taskDate = new Date(task.dueDate).toISOString().split("T")[0]
    return taskDate === today
  }).length

  // Calculate completion percentage
  const completionPercentage = totalTasksToday > 0 ? Math.round((tasksCompletedToday / totalTasksToday) * 100) : 0

  // Pomodoros completed today
  const pomodorosToday = focusSessions
    .filter((session) => {
      const sessionDate = new Date(session.startTime).toISOString().split("T")[0]
      return sessionDate === today
    })
    .reduce((total, session) => total + session.pomodorosCompleted, 0)

  // Total study time today (in hours)
  const studyTimeToday =
    focusSessions
      .filter((session) => {
        const sessionDate = new Date(session.startTime).toISOString().split("T")[0]
        return sessionDate === today
      })
      .reduce((total, session) => total + session.totalFocusTime, 0) / 3600

  // Stats to display
  const stats = [
    {
      label: "Tasks Completed",
      value: tasksCompletedToday,
      total: totalTasksToday,
      icon: CheckCircle2,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
    },
    {
      label: "Pomodoros Done",
      value: pomodorosToday,
      icon: Clock,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      label: "Study Hours",
      value: studyTimeToday.toFixed(1),
      icon: Brain,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
    },
  ]

  return (
    <div className="widget">
      <div className="widget-header">
        <h2 className="widget-title">Today's Stats</h2>
        <span className="text-sm text-muted-foreground">
          {new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" })}
        </span>
      </div>

      <div className="widget-content">
        {/* Overall Progress Bar */}
        <div className="mb-4">
          <div className="flex items-center justify-between text-sm mb-1">
            <span>Daily Progress</span>
            <span>{completionPercentage}%</span>
          </div>
          <Progress value={completionPercentage} className="h-2" />
        </div>

        <div className="grid grid-cols-3 gap-4">
          {stats.map((stat, index) => (
            <div key={index} className={`flex flex-col items-center p-3 rounded-lg ${stat.bgColor}`}>
              <div className={`h-10 w-10 rounded-full flex items-center justify-center ${stat.color} bg-card mb-2`}>
                <stat.icon className="h-5 w-5" />
              </div>

              <p className="text-2xl font-bold">{stat.value}</p>
              <p className="text-xs text-muted-foreground text-center">{stat.label}</p>
              {stat.total !== undefined && <p className="text-xs text-muted-foreground mt-1">of {stat.total}</p>}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
