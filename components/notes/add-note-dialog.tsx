"use client"

import type React from "react"

import { useState } from "react"
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

interface AddNoteDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  courseId: string
}

export function AddNoteDialog({ open, onOpenChange, courseId }: AddNoteDialogProps) {
  const { addNote } = useStore()

  // Form state
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Add note
    addNote({
      title,
      content,
      courseId,
    })

    // Reset form and close dialog
    resetForm()
    onOpenChange(false)
  }

  // Reset form
  const resetForm = () => {
    setTitle("")
    setContent("")
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add New Note</DialogTitle>
            <DialogDescription>Create a new note for your course. Markdown formatting is supported.</DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Note Title</Label>
              <Input
                id="title"
                placeholder="Enter note title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="content">Content</Label>
              <Textarea
                id="content"
                placeholder="# Your note content here
                
Markdown formatting is supported:
- Use # for headings
- Use * for bullet points
- Use **bold** for bold text
- Use _italic_ for italic text"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="min-h-[200px] font-mono"
                required
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Add Note</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
