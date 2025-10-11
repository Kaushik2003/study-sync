/*
import { create } from "zustand"
import { persist } from "zustand/middleware"

// Types
export type Course = {
  id: string
  name: string
  color: string
  progress: number
  thumbnail?: string
  tasks: Task[]
  notes: Note[]
  resources: Resource[]
  exams: Exam[]
}

export type Task = {
  id: string
  title: string
  description?: string
  courseId: string
  dueDate: string
  priority: "low" | "medium" | "high"
  completed: boolean
  createdAt: string
}

export type Note = {
  id: string
  title: string
  content: string
  courseId: string
  createdAt: string
  updatedAt: string
  flashcards: Flashcard[]
}

export type Flashcard = {
  id: string
  question: string
  answer: string
  noteId: string
  lastReviewed?: string
  confidence: "low" | "medium" | "high"
}

export type Resource = {
  id: string
  title: string
  url: string
  type: "link" | "file"
  courseId: string
}

export type Exam = {
  id: string
  title: string
  courseId: string
  date: string
  description?: string
  progress: number
}

export type FocusSession = {
  id: string
  startTime: string
  endTime?: string
  taskId?: string
  courseId?: string
  pomodorosCompleted: number
  totalFocusTime: number // in seconds
  sessionType: "pomodoro" | "shortBreak" | "longBreak"
}

export type AIMessage = {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: string
  courseId?: string
}

export type AIConversation = {
  id: string
  title: string
  messages: AIMessage[]
  courseId?: string
  createdAt: string
  updatedAt: string
}

// Store type
type StudySyncStore = {
  // Data
  courses: Course[]
  tasks: Task[]
  notes: Note[]
  focusSessions: FocusSession[]
  aiConversations: AIConversation[]

  // Current state
  currentCourse?: string
  currentTask?: string
  currentNote?: string
  currentConversation?: string

  // Focus mode
  isFocusModeActive: boolean
  currentFocusSession?: FocusSession
  pomodoroSettings: {
    focusDuration: number // in minutes
    breakDuration: number // in minutes
    longBreakDuration: number // in minutes
    longBreakInterval: number // after how many pomodoros
  }

  // UI state
  sidebarOpen: boolean

  // Actions
  setSidebarOpen: (open: boolean) => void

  // Course actions
  addCourse: (course: Omit<Course, "id" | "tasks" | "notes" | "resources" | "exams">) => void
  updateCourse: (id: string, course: Partial<Course>) => void
  deleteCourse: (id: string) => void
  setCurrentCourse: (id?: string) => void

  // Task actions
  addTask: (task: Omit<Task, "id" | "createdAt">) => void
  updateTask: (id: string, task: Partial<Task>) => void
  deleteTask: (id: string) => void
  toggleTaskCompletion: (id: string) => void
  setCurrentTask: (id?: string) => void

  // Note actions
  addNote: (note: Omit<Note, "id" | "createdAt" | "updatedAt" | "flashcards">) => void
  updateNote: (id: string, note: Partial<Note>) => void
  deleteNote: (id: string) => void
  setCurrentNote: (id?: string) => void

  // Focus mode actions
  startFocusSession: (taskId?: string, courseId?: string) => void
  endFocusSession: () => void
  updateFocusSession: (session: Partial<FocusSession>) => void

  // AI actions
  startConversation: (title: string, courseId?: string) => void
  addMessage: (content: string, role: "user" | "assistant") => void
  deleteConversation: (id: string) => void
  clearConversationMessages: (id: string) => void
  setCurrentConversation: (id?: string) => void
}

// Generate a unique ID
const generateId = () => Math.random().toString(36).substring(2, 11)

// Create the store
export const useStore = create<StudySyncStore>()(
  persist(
    (set, get) => ({
      // Initial data
      courses: [],
      tasks: [],
      notes: [],
      focusSessions: [],
      aiConversations: [],

      // Current state
      currentCourse: undefined,
      currentTask: undefined,
      currentNote: undefined,
      currentConversation: undefined,

      // Focus mode
      isFocusModeActive: false,
      currentFocusSession: undefined,
      pomodoroSettings: {
        focusDuration: 25,
        breakDuration: 5,
        longBreakDuration: 15,
        longBreakInterval: 4,
      },

      // UI state
      sidebarOpen: true,

      // Actions
      setSidebarOpen: (open) => set({ sidebarOpen: open }),

      // Course actions
      addCourse: (course) => {
        const id = generateId()
        set((state) => ({
          courses: [
            ...state.courses,
            {
              id,
              ...course,
              tasks: [],
              notes: [],
              resources: [],
              exams: [],
            },
          ],
        }))
        return id
      },

      updateCourse: (id, course) =>
        set((state) => ({
          courses: state.courses.map((c) => (c.id === id ? { ...c, ...course } : c)),
        })),

      deleteCourse: (id) =>
        set((state) => ({
          courses: state.courses.filter((c) => c.id !== id),
          tasks: state.tasks.filter((t) => t.courseId !== id),
          notes: state.notes.filter((n) => n.courseId !== id),
        })),

      setCurrentCourse: (id) => set({ currentCourse: id }),

      // Task actions
      addTask: (task) => {
        const id = generateId()
        const now = new Date().toISOString()
        set((state) => ({
          tasks: [
            ...state.tasks,
            {
              id,
              ...task,
              completed: false,
              createdAt: now,
            },
          ],
        }))
        return id
      },

      updateTask: (id, task) =>
        set((state) => ({
          tasks: state.tasks.map((t) => (t.id === id ? { ...t, ...task } : t)),
        })),

      deleteTask: (id) =>
        set((state) => ({
          tasks: state.tasks.filter((t) => t.id !== id),
        })),

      toggleTaskCompletion: (id) =>
        set((state) => ({
          tasks: state.tasks.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)),
        })),

      setCurrentTask: (id) => set({ currentTask: id }),

      // Note actions
      addNote: (note) => {
        const id = generateId()
        const now = new Date().toISOString()
        set((state) => ({
          notes: [
            ...state.notes,
            {
              id,
              ...note,
              createdAt: now,
              updatedAt: now,
              flashcards: [],
            },
          ],
        }))
        return id
      },

      updateNote: (id, note) => {
        const now = new Date().toISOString()
        set((state) => ({
          notes: state.notes.map((n) => (n.id === id ? { ...n, ...note, updatedAt: now } : n)),
        }))
      },

      deleteNote: (id) =>
        set((state) => ({
          notes: state.notes.filter((n) => n.id !== id),
        })),

      setCurrentNote: (id) => set({ currentNote: id }),

      // Focus mode actions
      startFocusSession: (taskId, courseId) => {
        const id = generateId()
        const now = new Date().toISOString()
        const session: FocusSession = {
          id,
          startTime: now,
          taskId,
          courseId,
          pomodorosCompleted: 0,
          totalFocusTime: 0,
          sessionType: "pomodoro",
        }

        set((state) => ({
          focusSessions: [...state.focusSessions, session],
          currentFocusSession: session,
          isFocusModeActive: true,
        }))

        return id
      },

      endFocusSession: () => {
        const { currentFocusSession } = get()
        if (!currentFocusSession) return

        const now = new Date().toISOString()

        set((state) => ({
          focusSessions: state.focusSessions.map((s) => (s.id === currentFocusSession.id ? { ...s, endTime: now } : s)),
          currentFocusSession: undefined,
          isFocusModeActive: false,
        }))
      },

      updateFocusSession: (session) => {
        const { currentFocusSession } = get()
        if (!currentFocusSession) return

        set((state) => ({
          focusSessions: state.focusSessions.map((s) => (s.id === currentFocusSession.id ? { ...s, ...session } : s)),
          currentFocusSession: { ...currentFocusSession, ...session },
        }))
      },

      // AI actions
      startConversation: (title, courseId) => {
        const id = generateId()
        const now = new Date().toISOString()

        set((state) => ({
          aiConversations: [
            ...state.aiConversations,
            {
              id,
              title,
              messages: [],
              courseId,
              createdAt: now,
              updatedAt: now,
            },
          ],
          currentConversation: id,
        }))

        return id
      },

      addMessage: (content, role) => {
        const { currentConversation } = get()
        if (!currentConversation) return

        const id = generateId()
        const now = new Date().toISOString()

        set((state) => ({
          aiConversations: state.aiConversations.map((c) =>
            c.id === currentConversation
              ? {
                  ...c,
                  messages: [...c.messages, { id, role, content, timestamp: now }],
                  updatedAt: now,
                }
              : c,
          ),
        }))

        return id
      },

      deleteConversation: (id) => {
        set((state) => ({
          aiConversations: state.aiConversations.filter((c) => c.id !== id),
          currentConversation: state.currentConversation === id ? undefined : state.currentConversation,
        }))
      },

      clearConversationMessages: (id) => {
        set((state) => ({
          aiConversations: state.aiConversations.map((c) =>
            c.id === id
              ? {
                  ...c,
                  messages: [],
                  updatedAt: new Date().toISOString(),
                }
              : c,
          ),
        }))
      },

      setCurrentConversation: (id) => set({ currentConversation: id }),
    }),
    {
      name: "studysync-storage",
    },
  ),
)
*/


import { create } from "zustand"

// Types
export type Course = {
  id: string
  name: string
  color: string
  progress: number
  thumbnail?: string
  tasks: Task[]
  notes: Note[]
  resources: Resource[]
  exams: Exam[]
}

export type Task = {
  id: string
  title: string
  description?: string
  courseId: string
  dueDate: string
  priority: "low" | "medium" | "high"
  completed: boolean
  createdAt: string
}

export type Note = {
  id: string
  title: string
  content: string
  courseId: string
  createdAt: string
  updatedAt: string
  flashcards: Flashcard[]
}

export type Flashcard = {
  id: string
  question: string
  answer: string
  noteId: string
  lastReviewed?: string
  confidence: "low" | "medium" | "high"
}

export type Resource = {
  id: string
  title: string
  url: string
  type: "link" | "file"
  courseId: string
}

export type Exam = {
  id: string
  title: string
  courseId: string
  date: string
  description?: string
  progress: number
}

export type FocusSession = {
  id: string
  startTime: string
  endTime?: string
  taskId?: string
  courseId?: string
  pomodorosCompleted: number
  totalFocusTime: number // in seconds
  sessionType: "pomodoro" | "shortBreak" | "longBreak"
}

export type AIMessage = {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: string
  courseId?: string
}

export type AIConversation = {
  id: string
  title: string
  messages: AIMessage[]
  courseId?: string
  createdAt: string
  updatedAt: string
}

// Store type
type StudySyncStore = {
  // Data
  courses: Course[]
  tasks: Task[]
  notes: Note[]
  focusSessions: FocusSession[]
  aiConversations: AIConversation[]

  // Current state
  currentCourse?: string
  currentTask?: string
  currentNote?: string
  currentConversation?: string

  // Focus mode
  isFocusModeActive: boolean
  currentFocusSession?: FocusSession
  pomodoroSettings: {
    focusDuration: number
    breakDuration: number
    longBreakDuration: number
    longBreakInterval: number
  }

  // UI state
  sidebarOpen: boolean

  // Actions
  setSidebarOpen: (open: boolean) => void

  // Course actions
  addCourse: (course: Omit<Course, "id" | "tasks" | "notes" | "resources" | "exams">) => void
  updateCourse: (id: string, course: Partial<Course>) => void
  deleteCourse: (id: string) => void
  setCurrentCourse: (id?: string) => void

  // Task actions
  addTask: (task: Omit<Task, "id" | "createdAt">) => void
  updateTask: (id: string, task: Partial<Task>) => void
  deleteTask: (id: string) => void
  toggleTaskCompletion: (id: string) => void
  setCurrentTask: (id?: string) => void

  // Note actions
  addNote: (note: Omit<Note, "id" | "createdAt" | "updatedAt" | "flashcards">) => void
  updateNote: (id: string, note: Partial<Note>) => void
  deleteNote: (id: string) => void
  setCurrentNote: (id?: string) => void

  // Focus mode actions
  startFocusSession: (taskId?: string, courseId?: string) => void
  endFocusSession: () => void
  updateFocusSession: (session: Partial<FocusSession>) => void

  // AI actions
  startConversation: (title: string, courseId?: string) => void
  addMessage: (content: string, role: "user" | "assistant") => void
  deleteConversation: (id: string) => void
  clearConversationMessages: (id: string) => void
  setCurrentConversation: (id?: string) => void
}

// Generate a unique ID
const generateId = () => Math.random().toString(36).substring(2, 11)

// Create the store (NO persist)
export const useStore = create<StudySyncStore>((set, get) => ({
  // Initial data
  courses: [],
  tasks: [],
  notes: [],
  focusSessions: [],
  aiConversations: [],

  // Current state
  currentCourse: undefined,
  currentTask: undefined,
  currentNote: undefined,
  currentConversation: undefined,

  // Focus mode
  isFocusModeActive: false,
  currentFocusSession: undefined,
  pomodoroSettings: {
    focusDuration: 25,
    breakDuration: 5,
    longBreakDuration: 15,
    longBreakInterval: 4,
  },

  // UI state
  sidebarOpen: true,

  // Actions
  setSidebarOpen: (open) => set({ sidebarOpen: open }),

  // Course actions
  addCourse: (course) => {
    const id = generateId()
    set((state) => ({
      courses: [
        ...state.courses,
        {
          id,
          ...course,
          tasks: [],
          notes: [],
          resources: [],
          exams: [],
        },
      ],
    }))
    return id
  },

  updateCourse: (id, course) =>
    set((state) => ({
      courses: state.courses.map((c) => (c.id === id ? { ...c, ...course } : c)),
    })),

  deleteCourse: (id) =>
    set((state) => ({
      courses: state.courses.filter((c) => c.id !== id),
      tasks: state.tasks.filter((t) => t.courseId !== id),
      notes: state.notes.filter((n) => n.courseId !== id),
    })),

  setCurrentCourse: (id) => set({ currentCourse: id }),

  // Task actions
  addTask: (task) => {
    const id = generateId()
    const now = new Date().toISOString()
    set((state) => ({
      tasks: [
        ...state.tasks,
        {
          id,
          ...task,
          completed: false,
          createdAt: now,
        },
      ],
    }))
    return id
  },

  updateTask: (id, task) =>
    set((state) => ({
      tasks: state.tasks.map((t) => (t.id === id ? { ...t, ...task } : t)),
    })),

  deleteTask: (id) =>
    set((state) => ({
      tasks: state.tasks.filter((t) => t.id !== id),
    })),

  toggleTaskCompletion: (id) =>
    set((state) => ({
      tasks: state.tasks.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)),
    })),

  setCurrentTask: (id) => set({ currentTask: id }),

  // Note actions
  addNote: (note) => {
    const id = generateId()
    const now = new Date().toISOString()
    set((state) => ({
      notes: [
        ...state.notes,
        {
          id,
          ...note,
          createdAt: now,
          updatedAt: now,
          flashcards: [],
        },
      ],
    }))
    return id
  },

  updateNote: (id, note) => {
    const now = new Date().toISOString()
    set((state) => ({
      notes: state.notes.map((n) => (n.id === id ? { ...n, ...note, updatedAt: now } : n)),
    }))
  },

  deleteNote: (id) =>
    set((state) => ({
      notes: state.notes.filter((n) => n.id !== id),
    })),

  setCurrentNote: (id) => set({ currentNote: id }),

  // Focus mode actions
  startFocusSession: (taskId, courseId) => {
    const id = generateId()
    const now = new Date().toISOString()
    const session: FocusSession = {
      id,
      startTime: now,
      taskId,
      courseId,
      pomodorosCompleted: 0,
      totalFocusTime: 0,
      sessionType: "pomodoro",
    }

    set((state) => ({
      focusSessions: [...state.focusSessions, session],
      currentFocusSession: session,
      isFocusModeActive: true,
    }))

    return id
  },

  endFocusSession: () => {
    const { currentFocusSession } = get()
    if (!currentFocusSession) return

    const now = new Date().toISOString()

    set((state) => ({
      focusSessions: state.focusSessions.map((s) =>
        s.id === currentFocusSession.id ? { ...s, endTime: now } : s
      ),
      currentFocusSession: undefined,
      isFocusModeActive: false,
    }))
  },

  updateFocusSession: (session) => {
    const { currentFocusSession } = get()
    if (!currentFocusSession) return

    set((state) => ({
      focusSessions: state.focusSessions.map((s) =>
        s.id === currentFocusSession.id ? { ...s, ...session } : s
      ),
      currentFocusSession: { ...currentFocusSession, ...session },
    }))
  },

  // AI actions
  startConversation: (title, courseId) => {
    const id = generateId()
    const now = new Date().toISOString()

    set((state) => ({
      aiConversations: [
        ...state.aiConversations,
        {
          id,
          title,
          messages: [],
          courseId,
          createdAt: now,
          updatedAt: now,
        },
      ],
      currentConversation: id,
    }))

    return id
  },

  addMessage: (content, role) => {
    const { currentConversation } = get()
    if (!currentConversation) return

    const id = generateId()
    const now = new Date().toISOString()

    set((state) => ({
      aiConversations: state.aiConversations.map((c) =>
        c.id === currentConversation
          ? {
              ...c,
              messages: [...c.messages, { id, role, content, timestamp: now }],
              updatedAt: now,
            }
          : c
      ),
    }))

    return id
  },

  deleteConversation: (id) =>
    set((state) => ({
      aiConversations: state.aiConversations.filter((c) => c.id !== id),
      currentConversation: state.currentConversation === id ? undefined : state.currentConversation,
    })),

  clearConversationMessages: (id) =>
    set((state) => ({
      aiConversations: state.aiConversations.map((c) =>
        c.id === id
          ? { ...c, messages: [], updatedAt: new Date().toISOString() }
          : c
      ),
    })),

  setCurrentConversation: (id) => set({ currentConversation: id }),
}))
