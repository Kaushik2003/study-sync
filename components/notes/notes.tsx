"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { FileText, Plus, Search, Filter } from "lucide-react"
import { useStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { AddNoteDialog } from "./add-note-dialog"
import { NoteEditor } from "./note-editor"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function Notes() {
  const { notes, courses } = useStore()
  const [showAddNote, setShowAddNote] = useState(false)
  const [selectedNote, setSelectedNote] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [courseFilter, setCourseFilter] = useState<string>("all")

  // Get the selected note
  const currentNote = selectedNote ? notes.find((note) => note.id === selectedNote) : null

  // Filter notes by search query and course
  const filteredNotes = notes.filter((note) => {
    // Filter by search query
    const matchesSearch =
      !searchQuery ||
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase())

    // Filter by course
    const matchesCourse = courseFilter === "all" || note.courseId === courseFilter

    return matchesSearch && matchesCourse
  })

  // Get course name
  const getCourseName = (courseId: string) => {
    const course = courses.find((c) => c.id === courseId)
    return course ? course.name : "Unknown Course"
  }

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

  return (
    <div className="h-full">
      {selectedNote && currentNote ? (
        <div>
          <Button variant="ghost" className="mb-4" onClick={() => setSelectedNote(null)}>
            Back to Notes
          </Button>

          <NoteEditor note={currentNote} />
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold">Notes</h1>
              <p className="text-muted-foreground">Organize your study materials and create flashcards</p>
            </div>

            <Button onClick={() => setShowAddNote(true)}>
              <Plus className="h-4 w-4 mr-1" />
              Add Note
            </Button>
          </div>

          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search notes..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="w-full md:w-64">
              <Select value={courseFilter} onValueChange={setCourseFilter}>
                <SelectTrigger>
                  <div className="flex items-center">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Filter by course" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Courses</SelectItem>
                  {courses.map((course) => (
                    <SelectItem key={course.id} value={course.id}>
                      {course.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredNotes.length > 0 ? (
              filteredNotes.map((note) => (
                <motion.div
                  key={note.id}
                  variants={itemVariants}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="glassmorphism rounded-xl p-4 cursor-pointer glow-hover"
                  onClick={() => setSelectedNote(note.id)}
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-medium">{note.title}</h3>
                    <FileText className="h-4 w-4 text-muted-foreground" />
                  </div>

                  <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                    {note.content.replace(/[#*_]/g, "")}
                  </p>

                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span className="px-2 py-1 bg-card/50 rounded-full">{getCourseName(note.courseId)}</span>
                    <span>{new Date(note.updatedAt).toLocaleDateString()}</span>
                  </div>
                </motion.div>
              ))
            ) : (
              <motion.div
                variants={itemVariants}
                className="col-span-full flex flex-col items-center justify-center p-12 text-center"
              >
                <FileText className="h-16 w-16 text-muted-foreground mb-4" />
                <h2 className="text-2xl font-bold mb-2">No Notes Found</h2>
                <p className="text-muted-foreground mb-6 max-w-md">
                  {searchQuery || courseFilter !== "all"
                    ? "No notes match your search criteria. Try different filters."
                    : "You haven't created any notes yet. Add your first note to get started."}
                </p>
                {!searchQuery && courseFilter === "all" && (
                  <Button onClick={() => setShowAddNote(true)}>
                    <Plus className="h-4 w-4 mr-1" />
                    Create Your First Note
                  </Button>
                )}
              </motion.div>
            )}
          </motion.div>

          <AddNoteDialog open={showAddNote} onOpenChange={setShowAddNote} courseId={courses[0]?.id || ""} />
        </>
      )}
    </div>
  )
}
