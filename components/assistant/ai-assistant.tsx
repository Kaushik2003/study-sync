"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { motion } from "framer-motion"
import { Send, Bot, Sparkles, Plus, Trash2 } from "lucide-react"
import { useStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import { MarkdownPreview } from "@/components/notes/markdown-preview"
import {
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialog,
} from "@/components/ui/alert-dialog"

export function AIAssistant() {
  // Make sure to destructure the new methods from the store
  const {
    aiConversations,
    startConversation,
    addMessage,
    currentConversation,
    setCurrentConversation,
    deleteConversation,
    clearConversationMessages,
  } = useStore()

  const [message, setMessage] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Get current conversation
  const conversation = currentConversation ? aiConversations.find((c) => c.id === currentConversation) : null

  // Create a new conversation if none exists
  useEffect(() => {
    if (aiConversations.length === 0) {
      startConversation("New Conversation")
    } else if (!currentConversation) {
      setCurrentConversation(aiConversations[0].id)
    }
  }, [aiConversations, currentConversation])

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [conversation?.messages])

  // Send message
  const sendMessage = async () => {
    if (!message.trim() || !currentConversation) return

    // Add user message
    const userMessageId = addMessage(message, "user")
    setMessage("")

    // Show typing indicator
    setIsTyping(true)

    try {
      // Get the current conversation for context
      const conversation = aiConversations.find((c) => c.id === currentConversation)

      // Prepare the history for the API
      const history = conversation?.messages || []

      // Call the API
      const response = await fetch("/api/ask-ai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: message.trim(),
          history: history.slice(-10), // Send last 10 messages for context
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to get AI response")
      }

      const data = await response.json()

      // Add AI response
      addMessage(data.content, "assistant")
    } catch (error) {
      console.error("Error getting AI response:", error)
      // Add fallback message
      addMessage("I'm sorry, I'm having trouble connecting right now. Please try again later.", "assistant")
    } finally {
      setIsTyping(false)
    }
  }

  // Add state for delete confirmation dialog
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  
  // Add state for showing suggested prompts
  const [showSuggestedPrompts, setShowSuggestedPrompts] = useState(false)
  
  // Add state for topic input and AI-generated suggestions
  const [topicInput, setTopicInput] = useState("")
  const [aiGeneratedPrompts, setAiGeneratedPrompts] = useState<string[]>([])
  const [isGeneratingPrompts, setIsGeneratingPrompts] = useState(false)
  
  // Generate AI suggestions based on topic input
  const generateAISuggestions = async () => {
    if (!topicInput.trim()) return
    
    setIsGeneratingPrompts(true)
    try {
      const response = await fetch("/api/ask-ai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: `Generate 8 specific study prompts for the topic: "${topicInput}". Make them educational and focused on learning, understanding, and applying knowledge about this topic. Return only the prompts, one per line, without numbering or bullet points.`,
          history: [],
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to generate suggestions")
      }

      const data = await response.json()
      const prompts = data.content
        .split('\n')
        .filter((line: string) => line.trim())
        .slice(0, 8) // Limit to 8 prompts
      
      setAiGeneratedPrompts(prompts)
    } catch (error) {
      console.error("Error generating AI suggestions:", error)
      // Fallback to default prompts
      setAiGeneratedPrompts(getDynamicPrompts())
    } finally {
      setIsGeneratingPrompts(false)
    }
  }
  
  // Generate dynamic prompts based on conversation context
  const getDynamicPrompts = () => {
    if (!conversation?.messages.length) {
      // Default prompts when no conversation exists
      return [
        "Explain the concept of derivatives in calculus",
        "Create a study plan for my upcoming exam",
        "Summarize my notes on World War II",
        "Help me understand sorting algorithms",
        "Generate flashcards from my notes",
        "Explain this topic in simple terms",
        "What are the key points I should remember?",
        "Help me prepare for my presentation",
      ]
    }

    // Get the last few messages to understand the topic
    const recentMessages = conversation.messages.slice(-3)
    const conversationText = recentMessages.map(msg => msg.content).join(' ').toLowerCase()
    
    // Topic-specific prompts based on conversation content
    if (conversationText.includes('calculus') || conversationText.includes('derivative') || conversationText.includes('integral')) {
      return [
        "Explain the concept of derivatives in calculus",
        "Help me understand integration techniques",
        "What are the applications of calculus in real life?",
        "Explain the chain rule with examples",
        "Help me solve this calculus problem step by step",
        "What are the fundamental theorems of calculus?",
        "Explain limits and continuity",
        "Help me understand differential equations",
      ]
    } else if (conversationText.includes('history') || conversationText.includes('war') || conversationText.includes('historical')) {
      return [
        "Summarize the key events of World War II",
        "Explain the causes of the American Revolution",
        "What were the major civilizations of ancient times?",
        "Help me understand the timeline of events",
        "What were the social impacts of this historical period?",
        "Explain the significance of this historical event",
        "Help me analyze primary sources",
        "What were the long-term consequences?",
      ]
    } else if (conversationText.includes('algorithm') || conversationText.includes('programming') || conversationText.includes('code')) {
      return [
        "Help me understand sorting algorithms",
        "Explain the time complexity of this algorithm",
        "What are the different data structures?",
        "Help me debug this code",
        "Explain object-oriented programming concepts",
        "What are the best practices for this programming language?",
        "Help me optimize this algorithm",
        "Explain recursion with examples",
      ]
    } else if (conversationText.includes('biology') || conversationText.includes('cell') || conversationText.includes('organism')) {
      return [
        "Explain the structure and function of cells",
        "Help me understand the process of photosynthesis",
        "What are the different systems in the human body?",
        "Explain the process of evolution",
        "Help me understand genetics and DNA",
        "What are the different types of ecosystems?",
        "Explain the process of cellular respiration",
        "Help me understand the classification of organisms",
      ]
    } else if (conversationText.includes('physics') || conversationText.includes('force') || conversationText.includes('energy')) {
      return [
        "Explain Newton's laws of motion",
        "Help me understand the concept of energy",
        "What are the different types of forces?",
        "Explain the principles of thermodynamics",
        "Help me solve this physics problem",
        "What are the properties of waves?",
        "Explain the concept of momentum",
        "Help me understand electricity and magnetism",
      ]
    } else {
      // General prompts for any topic
      return [
        "Explain this concept in simple terms",
        "What are the key points I should remember?",
        "Help me understand this topic step by step",
        "Create a summary of the main ideas",
        "What are the practical applications?",
        "Help me prepare for my exam on this topic",
        "Explain the connections between different concepts",
        "What are common misconceptions about this subject?",
      ]
    }
  }

  // Update the deleteCurrentConversation function to use the new store methods
  const deleteCurrentConversation = () => {
    if (currentConversation) {
      // Clear the messages in the current conversation
      clearConversationMessages(currentConversation)
      setShowDeleteDialog(false)
    }
  }

  // Handle key press
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  // Create a new conversation
  const createNewConversation = () => {
    startConversation("New Conversation")
  }

  // Format timestamp
  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    })
  }

  return (
    <div className="h-full flex flex-col md:flex-row gap-6">
      {/* Conversations sidebar */}
      <div className="w-full md:w-64 flex-shrink-0">
        <div className="glassmorphism rounded-2xl p-4 h-full">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold">Conversations</h2>
            <Button variant="ghost" size="icon" onClick={createNewConversation}>
              <Plus className="h-4 w-4" />
              <span className="sr-only">New Conversation</span>
            </Button>
          </div>

          <div className="space-y-2">
            {aiConversations.map((conv) => (
              <motion.div
                key={conv.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={cn(
                  "p-2 rounded-lg cursor-pointer group relative",
                  currentConversation === conv.id ? "bg-primary/20" : "hover:bg-card/50",
                )}
                onClick={() => setCurrentConversation(conv.id)}
              >
                <div className="flex items-center pr-6">
                  <Bot className="h-4 w-4 mr-2" />
                  <span className="text-sm font-medium truncate">{conv.title}</span>
                </div>
                <p className="text-xs text-muted-foreground truncate mt-1 pr-6">
                  {conv.messages.length > 0
                    ? conv.messages[conv.messages.length - 1].content.substring(0, 30) + "..."
                    : "No messages yet"}
                </p>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => {
                    e.stopPropagation()
                    deleteConversation(conv.id)
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                  <span className="sr-only">Delete conversation</span>
                </Button>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Chat area */}
      <div className="flex-1 flex flex-col glassmorphism rounded-2xl p-4 h-full">
        <div className="flex items-center justify-between mb-4 pb-4 border-b border-border/50">
          <div className="flex items-center">
            <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center mr-2">
              <Bot className="h-4 w-4 text-primary" />
            </div>
            <div>
              <h2 className="font-semibold">StudySync AI Assistant</h2>
              <p className="text-xs text-muted-foreground">Powered by Gemini AI to help with your studies</p>
            </div>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => setShowDeleteDialog(true)}>
              <Trash2 className="h-4 w-4 mr-1" />
              Delete Chat
            </Button>
            <Button variant="outline" size="sm" onClick={() => setShowSuggestedPrompts(true)}>
              <Sparkles className="h-4 w-4 mr-1" />
              Suggest Prompts
            </Button>
          </div>
        </div>

        <ScrollArea className="flex-1 pr-4">
          {conversation?.messages.length ? (
            <div className="space-y-4">
              {conversation.messages.map((msg) => (
                <div key={msg.id} className={cn("flex", msg.role === "user" ? "justify-end" : "justify-start")}>
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className={cn(
                      "max-w-[80%] rounded-2xl p-4",
                      msg.role === "user" ? "bg-primary text-primary-foreground" : "bg-card",
                    )}
                  >
                    {msg.role === "assistant" ? (
                      <MarkdownPreview content={msg.content} />
                    ) : (
                      <p>{msg.content}</p>
                    )}
                    <p className="text-xs opacity-70 mt-1 text-right">{formatTimestamp(msg.timestamp)}</p>
                  </motion.div>
                </div>
              ))}

              {isTyping && (
                <div className="flex justify-start">
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-[80%] rounded-2xl p-4 bg-card"
                  >
                    <div className="flex space-x-1">
                      <motion.div
                        animate={{ y: [0, -5, 0] }}
                        transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1 }}
                        className="h-2 w-2 rounded-full bg-primary"
                      />
                      <motion.div
                        animate={{ y: [0, -5, 0] }}
                        transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1, delay: 0.2 }}
                        className="h-2 w-2 rounded-full bg-primary"
                      />
                      <motion.div
                        animate={{ y: [0, -5, 0] }}
                        transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1, delay: 0.4 }}
                        className="h-2 w-2 rounded-full bg-primary"
                      />
                    </div>
                  </motion.div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center p-4">
              <Bot className="h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-xl font-medium mb-2">How can I help you today?</h3>
              <p className="text-muted-foreground mb-6 max-w-md">
                Ask me anything about your courses, assignments, or study techniques. I can help you understand
                concepts, create study plans, and more.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full max-w-2xl">
                {[
                  "Explain the concept of derivatives in calculus",
                  "Create a study plan for my upcoming exam",
                  "Summarize my notes on World War II",
                  "Help me understand sorting algorithms",
                ].map((prompt, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="justify-start h-auto min-h-[60px] py-3 px-4 text-left whitespace-normal break-words"
                    onClick={() => {
                      setMessage(prompt)
                      setTimeout(() => sendMessage(), 100)
                    }}
                  >
                    <span className="text-sm leading-relaxed">{prompt}</span>
                  </Button>
                ))}
              </div>
            </div>
          )}
        </ScrollArea>

        <div className="mt-4 pt-4 border-t border-border/50">
          <div className="flex items-end gap-2">
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Type your message..."
              className="min-h-[60px] resize-none"
            />

            <Button
              className="h-10 w-10 rounded-full p-0 flex-shrink-0"
              onClick={sendMessage}
              disabled={!message.trim() || isTyping}
            >
              <Send className="h-5 w-5" />
              <span className="sr-only">Send</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Delete conversation dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={(open) => setShowDeleteDialog(open)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Conversation</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this conversation? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={deleteCurrentConversation}
              className="bg-destructive text-destructive-foreground"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Suggested prompts dialog */}
      <AlertDialog open={showSuggestedPrompts} onOpenChange={(open) => setShowSuggestedPrompts(open)}>
        <AlertDialogContent className="max-w-4xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Suggested Prompts</AlertDialogTitle>
            <AlertDialogDescription>
              Get personalized prompts based on your topic or choose from conversation-based suggestions:
            </AlertDialogDescription>
          </AlertDialogHeader>
          
          {/* Topic Input Section */}
          <div className="space-y-4 my-4">
            <div className="flex gap-2">
              <Input
                placeholder="Enter a topic (e.g., 'machine learning', 'world history', 'organic chemistry')"
                value={topicInput}
                onChange={(e) => setTopicInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    generateAISuggestions()
                  }
                }}
                className="flex-1"
              />
              <Button 
                onClick={generateAISuggestions}
                disabled={!topicInput.trim() || isGeneratingPrompts}
                className="px-6"
              >
                {isGeneratingPrompts ? "Generating..." : "Generate"}
              </Button>
            </div>
          </div>
          
          {/* Prompts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 my-4">
            {(aiGeneratedPrompts.length > 0 ? aiGeneratedPrompts : getDynamicPrompts()).map((prompt, index) => (
              <Button
                key={index}
                variant="outline"
                className="justify-start h-auto min-h-[60px] py-3 px-4 text-left whitespace-normal break-words"
                onClick={() => {
                  setMessage(prompt)
                  setShowSuggestedPrompts(false)
                  setTimeout(() => sendMessage(), 100)
                }}
              >
                <span className="text-sm leading-relaxed">{prompt}</span>
              </Button>
            ))}
          </div>
          
          <AlertDialogFooter>
            <Button 
              variant="outline" 
              onClick={() => {
                setTopicInput("")
                setAiGeneratedPrompts([])
              }}
            >
              Clear
            </Button>
            <AlertDialogCancel>Close</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
