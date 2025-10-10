"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Plus, BookOpen, Upload, Link } from "lucide-react"
import { useStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { CourseCard } from "./course-card"
import { AddCourseDialog } from "./add-course-dialog"
import { CourseDetails } from "./course-details"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function CourseManager() {
  const { courses } = useStore()
  const [showAddCourse, setShowAddCourse] = useState(false)
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null)
  const [showThumbnailDialog, setShowThumbnailDialog] = useState(false)
  const [activeCourseForThumbnail, setActiveCourseForThumbnail] = useState<string | null>(null)
  const [thumbnailUrl, setThumbnailUrl] = useState("")
  const [activeTab, setActiveTab] = useState("url")

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  }

  // Open thumbnail dialog for a course
  const openThumbnailDialog = (courseId: string) => {
    setActiveCourseForThumbnail(courseId)
    setShowThumbnailDialog(true)
  }

  // Save thumbnail
  const saveThumbnail = () => {
    if (activeCourseForThumbnail) {
      // In a real app, this would update the course with the new thumbnail
      console.log(`Updating course ${activeCourseForThumbnail} with thumbnail: ${thumbnailUrl}`)
    }
    setShowThumbnailDialog(false)
    setThumbnailUrl("")
  }

  return (
    <div className="h-full">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Courses</h1>
          <p className="text-muted-foreground">Manage your courses and materials</p>
        </div>

        <Button onClick={() => setShowAddCourse(true)}>
          <Plus className="h-4 w-4 mr-1" />
          Add Course
        </Button>
      </div>

      {selectedCourse ? (
        <CourseDetails courseId={selectedCourse} onBack={() => setSelectedCourse(null)} />
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {courses.length > 0 ? (
            courses.map((course) => (
              <motion.div key={course.id} variants={itemVariants} className="relative group">
                <CourseCard course={course} onClick={() => setSelectedCourse(course.id)} />
                <Button
                  variant="outline"
                  size="sm"
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-background/80"
                  onClick={(e) => {
                    e.stopPropagation()
                    openThumbnailDialog(course.id)
                  }}
                >
                  <Upload className="h-4 w-4 mr-1" />
                  Thumbnail
                </Button>
              </motion.div>
            ))
          ) : (
            <motion.div
              variants={itemVariants}
              className="col-span-full flex flex-col items-center justify-center p-12 text-center bg-card rounded-2xl"
            >
              <BookOpen className="h-16 w-16 text-muted-foreground mb-4" />
              <h2 className="text-2xl font-bold mb-2">No Courses Yet</h2>
              <p className="text-muted-foreground mb-6 max-w-md">
                Add your first course to start organizing your study materials, assignments, and exams.
              </p>
              <Button onClick={() => setShowAddCourse(true)}>
                <Plus className="h-4 w-4 mr-1" />
                Add Your First Course
              </Button>
            </motion.div>
          )}
        </motion.div>
      )}

      <AddCourseDialog open={showAddCourse} onOpenChange={setShowAddCourse} />

      {/* Thumbnail Dialog */}
      <Dialog open={showThumbnailDialog} onOpenChange={setShowThumbnailDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Update Course Thumbnail</DialogTitle>
            <DialogDescription>Add a thumbnail image to make your course visually distinctive.</DialogDescription>
          </DialogHeader>

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
                      src={thumbnailUrl || "/placeholder.svg"}
                      alt="Thumbnail preview"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        ;(e.target as HTMLImageElement).src = "/placeholder.svg?height=200&width=400"
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
                      console.log("File selected:", e.target.files?.[0])
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

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowThumbnailDialog(false)}>
              Cancel
            </Button>
            <Button onClick={saveThumbnail}>Save Thumbnail</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
