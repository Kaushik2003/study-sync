"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { FileText, Plus, Edit, Trash2 } from "lucide-react"
import { useStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { AddNoteDialog } from "@/components/notes/add-note-dialog"
import { NoteEditor } from "@/components/notes/note-editor"

interface CourseNotesProps {
  courseId: string
}

export function CourseNotes({ courseId }: CourseNotesProps) {
  const { notes, deleteNote } = useStore()
  const [showAddNote, setShowAddNote] = useState(false)
  const [selectedNote, setSelectedNote] = useState<string | null>(null)

  // Filter notes for this course
  const courseNotes = notes.filter((note) => note.courseId === courseId)

  // Get the selected note
  const currentNote = selectedNote ? notes.find((note) => note.id === selectedNote) : null

  return (
    <div>
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
            <h2 className="text-xl font-semibold">Course Notes</h2>
            <Button onClick={() => setShowAddNote(true)}>
              <Plus className="h-4 w-4 mr-1" />
              Add Note
            </Button>
          </div>

          <AnimatePresence>
            {courseNotes.length > 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
              >
                {courseNotes.map((note) => (
                  <motion.div
                    key={note.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    whileHover={{ scale: 1.02 }}
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
                      <span>Created {new Date(note.createdAt).toLocaleDateString()}</span>

                      <div className="flex space-x-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          onClick={(e) => {
                            e.stopPropagation()
                            setSelectedNote(note.id)
                          }}
                        >
                          <Edit className="h-3.5 w-3.5" />
                          <span className="sr-only">Edit</span>
                        </Button>

                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-destructive"
                          onClick={(e) => {
                            e.stopPropagation()
                            deleteNote(note.id)
                          }}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center p-12 text-center"
              >
                <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-xl font-medium mb-2">No notes yet</h3>
                <p className="text-muted-foreground mb-6">
                  Create your first note to start organizing your study materials.
                </p>
                <Button onClick={() => setShowAddNote(true)}>
                  <Plus className="h-4 w-4 mr-1" />
                  Create Your First Note
                </Button>
              </motion.div>
            )}
          </AnimatePresence>

          <AddNoteDialog open={showAddNote} onOpenChange={setShowAddNote} courseId={courseId} />
        </>
      )}
    </div>
  )
}
