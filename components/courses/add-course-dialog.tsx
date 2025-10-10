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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Upload, Link } from "lucide-react"

interface AddCourseDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AddCourseDialog({ open, onOpenChange }: AddCourseDialogProps) {
  const { addCourse } = useStore()

  // Form state
  const [name, setName] = useState("")
  const [color, setColor] = useState("cyan-500")
  const [thumbnailUrl, setThumbnailUrl] = useState("")
  const [activeTab, setActiveTab] = useState("url")

  // Available colors
  const colors = [
    { value: "cyan-500", label: "Cyan" },
    { value: "purple-500", label: "Purple" },
    { value: "blue-500", label: "Blue" },
    { value: "green-500", label: "Green" },
    { value: "amber-500", label: "Amber" },
    { value: "red-500", label: "Red" },
  ]

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Add course
    addCourse({
      name,
      color,
      progress: 0,
      thumbnail: thumbnailUrl || undefined,
    })

    // Reset form and close dialog
    resetForm()
    onOpenChange(false)
  }

  // Reset form
  const resetForm = () => {
    setName("")
    setColor("cyan-500")
    setThumbnailUrl("")
    setActiveTab("url")
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add New Course</DialogTitle>
            <DialogDescription>Create a new course to organize your study materials.</DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Course Name</Label>
              <Input
                id="name"
                placeholder="Enter course name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="color">Course Color</Label>
              <Select value={color} onValueChange={setColor}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a color" />
                </SelectTrigger>
                <SelectContent>
                  {colors.map((color) => (
                    <SelectItem key={color.value} value={color.value}>
                      <div className="flex items-center">
                        <div className={`h-4 w-4 rounded-full bg-${color.value} mr-2`} />
                        <span>{color.label}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label>Course Banner</Label>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="url">Image URL</TabsTrigger>
                  <TabsTrigger value="upload">Upload</TabsTrigger>
                </TabsList>

                <TabsContent value="url" className="py-4">
                  <div className="grid gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="thumbnail-url">Image URL</Label>
                      <div className="flex gap-2">
                        <Input
                          id="thumbnail-url"
                          placeholder="https://example.com/image.jpg"
                          value={thumbnailUrl}
                          onChange={(e) => setThumbnailUrl(e.target.value)}
                        />
                        <Button variant="outline" size="icon">
                          <Link className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    {thumbnailUrl && (
                      <div className="aspect-video rounded-md overflow-hidden border">
                        <img
                          src={thumbnailUrl || `/placeholder.svg?height=200&width=400&text=${encodeURIComponent(name)}`}
                          alt="Banner preview"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            ;(e.target as HTMLImageElement).src =
                              `/placeholder.svg?height=200&width=400&text=${encodeURIComponent(name)}`
                          }}
                        />
                      </div>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="upload" className="py-4">
                  <div className="grid gap-4">
                    <div className="border-2 border-dashed rounded-lg p-8 text-center">
                      <Upload className="h-8 w-8 mx-auto mb-4 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground mb-2">
                        Drag and drop your image here, or click to browse
                      </p>
                      <Input
                        id="thumbnail-file"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          // In a real app, this would handle file upload
                          if (e.target.files && e.target.files[0]) {
                            // Create a temporary URL for the file
                            const url = URL.createObjectURL(e.target.files[0])
                            setThumbnailUrl(url)
                          }
                        }}
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          document.getElementById("thumbnail-file")?.click()
                        }}
                      >
                        Browse Files
                      </Button>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Add Course</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
