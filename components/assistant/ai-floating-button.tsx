"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Bot, X, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import Link from "next/link"
import { useStore } from "@/lib/store"

export function AIFloatingButton() {
  const [showChat, setShowChat] = useState(false)
  const [message, setMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { aiConversations, startConversation, addMessage, currentConversation, setCurrentConversation } = useStore()

  // Get current conversation or create a new one
  const getOrCreateConversation = () => {
    if (!currentConversation) {
      const id = startConversation("Quick Chat")
      setCurrentConversation(id)
      return id
    }
    return currentConversation
  }

  // Send message to AI
  const sendMessage = async () => {
    if (!message.trim()) return

    const convId = getOrCreateConversation()
    const conversation = aiConversations.find((c) => c.id === convId)

    // Add user message
    addMessage(message, "user")
    const userMessage = message
    setMessage("")
    setIsLoading(true)

    try {
      const history = conversation?.messages.slice(-10) || []
      const response = await fetch("/api/ask-ai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: userMessage,
          history,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to get AI response")
      }

      const data = await response.json()
      addMessage(data.content, "assistant")
    } catch (error) {
      console.error("Error sending message:", error)
      addMessage("Sorry, I couldn't get a response. Please try again.", "assistant")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <AnimatePresence>
        {showChat && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-20 right-6 w-80 md:w-96 h-96 glassmorphism rounded-xl overflow-hidden shadow-lg z-50"
          >
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between p-3 border-b border-border/50">
                <div className="flex items-center">
                  <Bot className="h-5 w-5 mr-2 text-primary" />
                  <h3 className="font-medium">StudySync AI</h3>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" asChild>
                    <Link href="/assistant">Full View</Link>
                  </Button>
                  <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setShowChat(false)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <ScrollArea className="flex-1 p-3">
                {currentConversation ? (
                  aiConversations
                    .find((c) => c.id === currentConversation)
                    ?.messages.map((msg, index) => (
                      <div key={index} className={`mb-3 ${msg.role === "user" ? "text-right" : "text-left"}`}>
                        <span
                          className={`inline-block p-2 rounded-lg ${
                            msg.role === "user" ? "bg-primary text-primary-foreground" : "bg-card"
                          }`}
                        >
                          {msg.content}
                        </span>
                      </div>
                    ))
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center p-4">
                    <Bot className="h-10 w-10 text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">
                      Ask me anything about your courses, assignments, or study techniques.
                    </p>
                  </div>
                )}
                {isLoading && (
                  <div className="text-left mb-3">
                    <div className="inline-block p-2 rounded-lg bg-card">
                      <div className="flex space-x-1">
                        <div
                          className="h-2 w-2 rounded-full bg-primary animate-bounce"
                          style={{ animationDelay: "0ms" }}
                        />
                        <div
                          className="h-2 w-2 rounded-full bg-primary animate-bounce"
                          style={{ animationDelay: "200ms" }}
                        />
                        <div
                          className="h-2 w-2 rounded-full bg-primary animate-bounce"
                          style={{ animationDelay: "400ms" }}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </ScrollArea>

              <div className="p-3 border-t border-border/50">
                <div className="flex items-end gap-2">
                  <Textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Ask something..."
                    className="min-h-[60px] resize-none"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault()
                        sendMessage()
                      }
                    }}
                  />
                  <Button
                    className="h-9 w-9 rounded-full p-0 flex-shrink-0"
                    onClick={sendMessage}
                    disabled={!message.trim() || isLoading}
                  >
                    <Send className="h-4 w-4" />
                    <span className="sr-only">Send</span>
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div className="fixed bottom-6 right-6 z-50" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        <Button className="h-12 w-12 rounded-full p-0 shadow-lg pulse-animation" onClick={() => setShowChat(!showChat)}>
          <Bot className="h-6 w-6" />
          <span className="sr-only">AI Assistant</span>
        </Button>
      </motion.div>
    </>
  )
}
