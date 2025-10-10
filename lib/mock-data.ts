import type { Course, Task, Note, Resource, Exam, FocusSession, AIConversation } from "./store"

// Generate a unique ID
const generateId = () => Math.random().toString(36).substring(2, 11)

// Mock courses
export const mockCourses: Course[] = [
  {
    id: "course-1",
    name: "Advanced Mathematics",
    color: "cyan-500",
    progress: 65,
    thumbnail: "/placeholder.svg?height=200&width=400&text=Mathematics",
    tasks: [],
    notes: [],
    resources: [],
    exams: [],
  },
  {
    id: "course-2",
    name: "Computer Science 101",
    color: "purple-500",
    progress: 42,
    thumbnail: "/placeholder.svg?height=200&width=400&text=Computer+Science",
    tasks: [],
    notes: [],
    resources: [],
    exams: [],
  },
  {
    id: "course-3",
    name: "World History",
    color: "blue-500",
    progress: 78,
    thumbnail: "/placeholder.svg?height=200&width=400&text=History",
    tasks: [],
    notes: [],
    resources: [],
    exams: [],
  },
  {
    id: "course-4",
    name: "English Literature",
    color: "green-500",
    progress: 30,
    thumbnail: "/placeholder.svg?height=200&width=400&text=Literature",
    tasks: [],
    notes: [],
    resources: [],
    exams: [],
  },
]

// Mock tasks
export const mockTasks: Task[] = [
  {
    id: "task-1",
    title: "Complete Calculus Assignment",
    description: "Problems 1-15 from Chapter 4",
    courseId: "course-1",
    dueDate: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
    priority: "high",
    completed: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: "task-2",
    title: "Read Chapter 3 of Algorithms Textbook",
    description: "Focus on sorting algorithms",
    courseId: "course-2",
    dueDate: new Date(Date.now() + 172800000).toISOString(), // Day after tomorrow
    priority: "medium",
    completed: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: "task-3",
    title: "Write Essay on World War II",
    description: "Minimum 1500 words, focus on economic impacts",
    courseId: "course-3",
    dueDate: new Date(Date.now() + 432000000).toISOString(), // 5 days from now
    priority: "high",
    completed: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: "task-4",
    title: "Analyze Shakespeare's Hamlet",
    description: "Character analysis of Hamlet",
    courseId: "course-4",
    dueDate: new Date(Date.now() + 259200000).toISOString(), // 3 days from now
    priority: "medium",
    completed: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: "task-5",
    title: "Prepare for Midterm Exam",
    description: "Review chapters 1-5",
    courseId: "course-1",
    dueDate: new Date(Date.now() + 604800000).toISOString(), // 7 days from now
    priority: "high",
    completed: false,
    createdAt: new Date().toISOString(),
  },
]

// Mock notes
export const mockNotes: Note[] = [
  {
    id: "note-1",
    title: "Calculus: Derivatives",
    content: `# Derivatives
    
The derivative of a function represents the rate of change of the function with respect to its variable.

## Basic Rules

1. **Power Rule**: If f(x) = x^n, then f'(x) = n * x^(n-1)
2. **Sum Rule**: If f(x) = g(x) + h(x), then f'(x) = g'(x) + h'(x)
3. **Product Rule**: If f(x) = g(x) * h(x), then f'(x) = g'(x) * h(x) + g(x) * h'(x)

## Examples

- If f(x) = x^2, then f'(x) = 2x
- If f(x) = x^3 + 2x, then f'(x) = 3x^2 + 2`,
    courseId: "course-1",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    flashcards: [
      {
        id: "flashcard-1",
        question: "What is the derivative of x^2?",
        answer: "2x",
        noteId: "note-1",
        confidence: "high",
      },
      {
        id: "flashcard-2",
        question: "What is the product rule for derivatives?",
        answer: "If f(x) = g(x) * h(x), then f'(x) = g'(x) * h(x) + g(x) * h'(x)",
        noteId: "note-1",
        confidence: "medium",
      },
    ],
  },
  {
    id: "note-2",
    title: "Sorting Algorithms",
    content: `# Sorting Algorithms

## Quick Sort

Quick Sort is a divide-and-conquer algorithm that works by selecting a 'pivot' element and partitioning the array around the pivot.

### Algorithm Steps:
1. Choose a pivot element
2. Partition the array around the pivot
3. Recursively sort the sub-arrays

### Time Complexity:
- Best Case: O(n log n)
- Average Case: O(n log n)
- Worst Case: O(n²)

## Merge Sort

Merge Sort is also a divide-and-conquer algorithm that divides the input array into two halves, recursively sorts them, and then merges the sorted halves.

### Time Complexity:
- Best, Average, and Worst Case: O(n log n)`,
    courseId: "course-2",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    flashcards: [
      {
        id: "flashcard-3",
        question: "What is the worst-case time complexity of Quick Sort?",
        answer: "O(n²)",
        noteId: "note-2",
        confidence: "high",
      },
      {
        id: "flashcard-4",
        question: "What is the time complexity of Merge Sort?",
        answer: "O(n log n) for all cases (best, average, worst)",
        noteId: "note-2",
        confidence: "medium",
      },
    ],
  },
]

// Mock resources
export const mockResources: Resource[] = [
  {
    id: "resource-1",
    title: "Calculus Textbook PDF",
    url: "https://example.com/calculus.pdf",
    type: "file",
    courseId: "course-1",
  },
  {
    id: "resource-2",
    title: "Khan Academy - Derivatives",
    url: "https://www.khanacademy.org/derivatives",
    type: "link",
    courseId: "course-1",
  },
  {
    id: "resource-3",
    title: "Algorithms Visualization",
    url: "https://visualgo.net/",
    type: "link",
    courseId: "course-2",
  },
]

// Mock exams
export const mockExams: Exam[] = [
  {
    id: "exam-1",
    title: "Calculus Midterm",
    courseId: "course-1",
    date: new Date(Date.now() + 1209600000).toISOString(), // 14 days from now
    description: "Covers chapters 1-5, focus on derivatives and integrals",
    progress: 40,
  },
  {
    id: "exam-2",
    title: "CS Algorithms Quiz",
    courseId: "course-2",
    date: new Date(Date.now() + 604800000).toISOString(), // 7 days from now
    description: "Sorting and searching algorithms",
    progress: 65,
  },
]

// Mock focus sessions
export const mockFocusSessions: FocusSession[] = [
  {
    id: "session-1",
    startTime: new Date(Date.now() - 86400000).toISOString(), // Yesterday
    endTime: new Date(Date.now() - 86400000 + 5400000).toISOString(), // 1.5 hours later
    taskId: "task-1",
    courseId: "course-1",
    pomodorosCompleted: 3,
    totalFocusTime: 4500, // 75 minutes in seconds
  },
  {
    id: "session-2",
    startTime: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
    endTime: new Date(Date.now() - 172800000 + 3600000).toISOString(), // 1 hour later
    taskId: "task-2",
    courseId: "course-2",
    pomodorosCompleted: 2,
    totalFocusTime: 3000, // 50 minutes in seconds
  },
]

// Mock AI conversations
export const mockAIConversations: AIConversation[] = [
  {
    id: "conversation-1",
    title: "Help with Calculus",
    messages: [
      {
        id: "message-1",
        role: "user",
        content: "Can you explain the chain rule in calculus?",
        timestamp: new Date(Date.now() - 86400000).toISOString(),
      },
      {
        id: "message-2",
        role: "assistant",
        content: `The chain rule is used to find the derivative of a composite function. If you have a function h(x) = f(g(x)), the chain rule states that:

h'(x) = f'(g(x)) · g'(x)

In other words, you multiply the derivative of the outer function (evaluated at the inner function) by the derivative of the inner function.

Example:
If h(x) = sin(x²), then:
- f(x) = sin(x) and g(x) = x²
- f'(x) = cos(x) and g'(x) = 2x
- h'(x) = cos(x²) · 2x = 2x·cos(x²)`,
        timestamp: new Date(Date.now() - 86400000 + 60000).toISOString(),
      },
    ],
    courseId: "course-1",
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 + 60000).toISOString(),
  },
]

// Initialize store with mock data
export const initializeStoreWithMockData = (store: any) => {
  // Add courses
  mockCourses.forEach((course) => {
    store.addCourse({
      name: course.name,
      color: course.color,
      progress: course.progress,
      thumbnail: course.thumbnail,
    })
  })

  // Add tasks
  mockTasks.forEach((task) => {
    store.addTask({
      title: task.title,
      description: task.description,
      courseId: task.courseId,
      dueDate: task.dueDate,
      priority: task.priority,
    })
  })

  // Add notes
  mockNotes.forEach((note) => {
    const noteId = store.addNote({
      title: note.title,
      content: note.content,
      courseId: note.courseId,
    })

    // Add flashcards for this note
    note.flashcards.forEach((flashcard) => {
      // Implement addFlashcard if needed
    })
  })
}
