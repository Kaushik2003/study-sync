"use client"

import type React from "react"

import { useState } from "react"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
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
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { cn } from "@/lib/utils"

interface AddExamDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  courseId: string
}

export function AddExamDialog({ open, onOpenChange, courseId }: AddExamDialogProps) {
  // Form state
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [date, setDate] = useState<Date>(new Date())
  const [time, setTime] = useState("12:00")

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Add exam (mock implementation)
    // In a real app, this would call a function from the store

    // Reset form and close dialog
    resetForm()
    onOpenChange(false)
  }

  // Reset form
  const resetForm = () => {
    setTitle("")
    setDescription("")
    setDate(new Date())
    setTime("12:00")
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add Exam</DialogTitle>
            <DialogDescription>Schedule an exam for your course.</DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Exam Title</Label>
              <Input
                id="title"
                placeholder="Enter exam title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                placeholder="Enter exam description, topics covered, etc."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Exam Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn("justify-start text-left font-normal", !date && "text-muted-foreground")}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "PPP") : "Select date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={(date) => setDate(date || new Date())}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="time">Exam Time</Label>
                <Input id="time" type="time" value={time} onChange={(e) => setTime(e.target.value)} />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Add Exam</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
