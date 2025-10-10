"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Save, Sparkles } from "lucide-react"
import { useStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import type { Note } from "@/lib/store"
import { FlashcardSection } from "./flashcard-section"
import { MarkdownPreview } from "./markdown-preview"
import { AIPromptMenu } from "./ai-prompt-menu"

interface NoteEditorProps {
  note: Note
}

export function NoteEditor({ note }: NoteEditorProps) {
  const { updateNote } = useStore()
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Form state
  const [title, setTitle] = useState(note.title)
  const [content, setContent] = useState(note.content)
  const [activeTab, setActiveTab] = useState("edit")
  const [isSaving, setIsSaving] = useState(false)
  const [showAIPrompts, setShowAIPrompts] = useState(false)
  const [cursorPosition, setCursorPosition] = useState(0)

  // Save note
  const saveNote = () => {
    setIsSaving(true)

    updateNote(note.id, {
      title,
      content,
    })

    // Simulate saving delay
    setTimeout(() => {
      setIsSaving(false)
    }, 500)
  }

  // Auto-save when content changes
  useEffect(() => {
    const timer = setTimeout(() => {
      if (title !== note.title || content !== note.content) {
        saveNote()
      }
    }, 2000)

    return () => clearTimeout(timer)
  }, [title, content])

  // Handle AI suggestions
  const handleAISuggest = () => {
    setShowAIPrompts(!showAIPrompts)
  }

  // Apply AI suggestion
  const applyAISuggestion = (suggestion: string) => {
    const textarea = textareaRef.current
    if (!textarea) return

    const newContent = content.substring(0, cursorPosition) + suggestion + content.substring(cursorPosition)

    setContent(newContent)
    setShowAIPrompts(false)
  }

  // Handle inline prompts
  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value
    setContent(newContent)
    setCursorPosition(e.target.selectionStart)

    // Check for inline prompts
    const lines = newContent.split("\n")
    const currentLine = lines[lines.length - 1]

    if (currentLine.startsWith("/summarize")) {
      const contentToSummarize = lines.slice(0, -1).join("\n")
      const summary = generateMockSummary(contentToSummarize)

      // Replace the prompt with the summary
      lines[lines.length - 1] = summary
      setContent(lines.join("\n"))
    } else if (currentLine.startsWith("/expand")) {
      const contentToExpand = lines.slice(0, -1).join("\n")
      const expanded = generateMockExpansion(contentToExpand)

      // Replace the prompt with the expanded content
      lines[lines.length - 1] = expanded
      setContent(lines.join("\n"))
    }
  }

  // Mock AI functions
  const generateMockSummary = (text: string) => {
    return `## Summary\n\n- This is a summarized version of your notes\n- Key points are extracted\n- Main concepts are highlighted\n- Important details are preserved`
  }

  const generateMockExpansion = (text: string) => {
    return `## Expanded Content\n\n${text}\n\nAdditional details:\n- Further explanation of the concept\n- Examples to illustrate the points\n- Related theories and applications\n- Historical context and significance`
  }

  return (
    <div>
      <div className="mb-4">
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="text-xl font-bold mb-2"
          placeholder="Note Title"
        />

        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">
            Last updated: {new Date(note.updatedAt).toLocaleString()}
          </span>

          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleAISuggest} className="flex items-center gap-1">
              <Sparkles className="h-4 w-4" />
              <span>AI Suggest</span>
            </Button>
            <Button variant="outline" size="sm" onClick={saveNote} disabled={isSaving}>
              {isSaving ? "Saving..." : "Save"}
              <Save className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      </div>

      {showAIPrompts && <AIPromptMenu onSelect={applyAISuggestion} onClose={() => setShowAIPrompts(false)} />}

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="edit">Edit</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
          <TabsTrigger value="flashcards">Flashcards</TabsTrigger>
        </TabsList>

        <TabsContent value="edit">
          <div className="relative">
            <Textarea
              ref={textareaRef}
              value={content}
              onChange={handleContentChange}
              className="min-h-[500px] font-mono"
              placeholder="# Start typing your note here...
              
Try using inline prompts like:
/summarize - to generate a summary
/expand - to expand on your content"
            />
            <div className="absolute bottom-4 right-4 text-xs text-muted-foreground">
              Tip: Type <span className="font-bold">/summarize</span> or <span className="font-bold">/expand</span> on a
              new line for AI assistance
            </div>
          </div>
        </TabsContent>

        <TabsContent value="preview">
          <div className="glassmorphism rounded-xl p-6 min-h-[500px] prose prose-invert max-w-none">
            <MarkdownPreview content={content} />
          </div>
        </TabsContent>

        <TabsContent value="flashcards">
          <FlashcardSection note={note} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
