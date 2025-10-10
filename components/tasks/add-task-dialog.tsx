"use client"

import type React from "react"

import { useState } from "react"
import { CalendarIcon, Clock } from "lucide-react"
import { format } from "date-fns"
import { useStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { cn } from "@/lib/utils"

interface AddTaskDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AddTaskDialog({ open, onOpenChange }: AddTaskDialogProps) {
  const { courses, addTask } = useStore()

  // Form state
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [courseId, setCourseId] = useState("")
  const [dueDate, setDueDate] = useState<Date>(new Date())
  const [dueTime, setDueTime] = useState("12:00")
  const [priority, setPriority] = useState<"low" | "medium" | "high">("medium")

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Combine date and time
    const [hours, minutes] = dueTime.split(":").map(Number)
    const dueDateWithTime = new Date(dueDate)
    dueDateWithTime.setHours(hours, minutes)

    // Add task
    addTask({
      title,
      description,
      courseId,
      dueDate: dueDateWithTime.toISOString(),
      priority,
      completed: false,
    })

    // Reset form and close dialog
    resetForm()
    onOpenChange(false)
  }

  // Reset form
  const resetForm = () => {
    setTitle("")
    setDescription("")
    setCourseId("")
    setDueDate(new Date())
    setDueTime("12:00")
    setPriority("medium")
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add New Task</DialogTitle>
            <DialogDescription>Create a new task for your courses. Click save when you're done.</DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Task Title</Label>
              <Input
                id="title"
                placeholder="Enter task title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                placeholder="Enter task description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="resize-none"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="course">Course</Label>
              <Select value={courseId} onValueChange={setCourseId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a course" />
                </SelectTrigger>
                <SelectContent>
                  {courses.map((course) => (
                    <SelectItem key={course.id} value={course.id}>
                      {course.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Due Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn("justify-start text-left font-normal", !dueDate && "text-muted-foreground")}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dueDate ? format(dueDate, "PPP") : "Select date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={dueDate}
                      onSelect={(date) => setDueDate(date || new Date())}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="time">Due Time</Label>
                <div className="flex items-center">
                  <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                  <Input id="time" type="time" value={dueTime} onChange={(e) => setDueTime(e.target.value)} />
                </div>
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="priority">Priority</Label>
              <Select value={priority} onValueChange={(value) => setPriority(value as "low" | "medium" | "high")}>
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Add Task</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
