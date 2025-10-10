"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Bot, MessageSquare, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useStore } from "@/lib/store"

export function AIAssistantWidget() {
  const { aiConversations, startConversation, setCurrentConversation } = useStore()

  // Quick prompt suggestions
  const quickPrompts = ["Explain this concept...", "Summarize my notes...", "Create a study plan..."]

  // Start a new conversation with a prompt
  const handleQuickPrompt = (prompt: string) => {
    const id = startConversation("New Conversation")
    setCurrentConversation(id)
    // Navigate to assistant page
    window.location.href = "/assistant"
  }

  return (
    <div className="widget">
      <div className="widget-header">
        <h2 className="widget-title">AI Assistant</h2>
        <Bot className="h-5 w-5 text-primary" />
      </div>

      <div className="widget-content">
        <div className="widget-scrollable space-y-2 mb-3">
          <p className="text-xs text-muted-foreground mb-1">Quick prompts:</p>

          {quickPrompts.map((prompt, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="p-2 rounded-lg bg-card/50 cursor-pointer flex items-center"
              onClick={() => handleQuickPrompt(prompt)}
            >
              <MessageSquare className="h-4 w-4 mr-2 text-muted-foreground" />
              <span className="text-sm">{prompt}</span>
            </motion.div>
          ))}
        </div>

        <Button asChild className="w-full mt-auto">
          <Link href="/assistant">
            <Bot className="h-4 w-4 mr-1" />
            Open Full Chat
            <ChevronRight className="h-4 w-4 ml-auto" />
          </Link>
        </Button>
      </div>
    </div>
  )
}
