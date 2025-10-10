"use client"

import type React from "react"

import { useState } from "react"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface AddResourceDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  courseId: string
}

export function AddResourceDialog({ open, onOpenChange, courseId }: AddResourceDialogProps) {
  // Form state
  const [title, setTitle] = useState("")
  const [url, setUrl] = useState("")
  const [type, setType] = useState<"link" | "file">("link")

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Add resource (mock implementation)
    // In a real app, this would call a function from the store

    // Reset form and close dialog
    resetForm()
    onOpenChange(false)
  }

  // Reset form
  const resetForm = () => {
    setTitle("")
    setUrl("")
    setType("link")
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add Resource</DialogTitle>
            <DialogDescription>Add a link or file resource to your course.</DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Resource Title</Label>
              <Input
                id="title"
                placeholder="Enter resource title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="type">Resource Type</Label>
              <Select value={type} onValueChange={(value) => setType(value as "link" | "file")}>
                <SelectTrigger>
                  <SelectValue placeholder="Select resource type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="link">Link</SelectItem>
                  <SelectItem value="file">File</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="url">{type === "link" ? "URL" : "File Upload"}</Label>
              <Input
                id="url"
                placeholder={type === "link" ? "https://example.com" : "Upload file"}
                type={type === "link" ? "url" : "file"}
                value={type === "link" ? url : ""}
                onChange={(e) => setUrl(e.target.value)}
                required
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Add Resource</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
