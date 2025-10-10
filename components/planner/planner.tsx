"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { WeeklyCalendar } from "./weekly-calendar"
import { AddTaskDialog } from "../tasks/add-task-dialog"

export function Planner() {
  const [currentWeek, setCurrentWeek] = useState(new Date())
  const [showAddTask, setShowAddTask] = useState(false)

  // Get start and end of week
  const getWeekDates = (date: Date) => {
    const day = date.getDay()
    const diff = date.getDate() - day + (day === 0 ? -6 : 1) // Adjust for Sunday
    const monday = new Date(date)
    monday.setDate(diff)

    const sunday = new Date(monday)
    sunday.setDate(monday.getDate() + 6)

    return {
      start: monday,
      end: sunday,
    }
  }

  const weekDates = getWeekDates(currentWeek)

  // Format date range
  const formatDateRange = (start: Date, end: Date) => {
    const startMonth = start.toLocaleDateString("en-US", { month: "short" })
    const endMonth = end.toLocaleDateString("en-US", { month: "short" })
    const startDay = start.getDate()
    const endDay = end.getDate()
    const year = start.getFullYear()

    if (startMonth === endMonth) {
      return `${startMonth} ${startDay} - ${endDay}, ${year}`
    } else {
      return `${startMonth} ${startDay} - ${endMonth} ${endDay}, ${year}`
    }
  }

  // Navigate to previous week
  const prevWeek = () => {
    const newDate = new Date(currentWeek)
    newDate.setDate(newDate.getDate() - 7)
    setCurrentWeek(newDate)
  }

  // Navigate to next week
  const nextWeek = () => {
    const newDate = new Date(currentWeek)
    newDate.setDate(newDate.getDate() + 7)
    setCurrentWeek(newDate)
  }

  // Go to current week
  const goToToday = () => {
    setCurrentWeek(new Date())
  }

  return (
    <div className="h-full">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Weekly Planner</h1>
          <p className="text-muted-foreground">Plan your week and manage your schedule</p>
        </div>

        <Button onClick={() => setShowAddTask(true)}>
          <Plus className="h-4 w-4 mr-1" />
          Add Task
        </Button>
      </div>

      <div className="glassmorphism rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={prevWeek}>
              <ChevronLeft className="h-4 w-4" />
              <span className="sr-only">Previous Week</span>
            </Button>

            <h2 className="text-xl font-semibold">{formatDateRange(weekDates.start, weekDates.end)}</h2>

            <Button variant="outline" size="icon" onClick={nextWeek}>
              <ChevronRight className="h-4 w-4" />
              <span className="sr-only">Next Week</span>
            </Button>
          </div>

          <Button variant="outline" size="sm" onClick={goToToday}>
            Today
          </Button>
        </div>

        <WeeklyCalendar startDate={weekDates.start} />
      </div>

      <AddTaskDialog open={showAddTask} onOpenChange={setShowAddTask} />
    </div>
  )
}
