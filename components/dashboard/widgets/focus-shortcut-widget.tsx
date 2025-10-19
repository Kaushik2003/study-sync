"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Clock, Play, Music, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useStore } from "@/lib/store"

export function FocusShortcutWidget() {
  const { startFocusSession, isFocusModeActive, currentFocusSession, tasks } = useStore()

  // Get current task if any
  const currentTask = currentFocusSession?.taskId ? tasks.find((t) => t.id === currentFocusSession.taskId) : null

  // Start a quick focus session
  const handleQuickStart = () => {
    startFocusSession()
    window.location.href = "/dashboard/focus"
  }

  return (
    <div className="widget relative overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-60"
        style={{ backgroundImage: "url('/monk.jpg')" }}
      />
      
      {/* Content overlay */}
      <div className="relative z-10 rounded-2xl p-3 h-full flex flex-col">
        <div className="widget-header">
          <h2 className="widget-title">Focus Mode</h2>
          <Clock className="h-5 w-5 text-primary" />
        </div>

        <div className="widget-content flex flex-col items-center justify-center p-4">
          {isFocusModeActive ? (
            <div className="text-center mb-4">
              <div className="inline-block p-2 bg-primary/10 rounded-full mb-2">
                <Clock className="h-8 w-8 text-primary animate-pulse" />
              </div>
              <h3 className="text-lg font-medium mb-1">Focus Session Active</h3>
              {currentTask && <p className="text-sm text-muted-foreground mb-3">Working on: {currentTask.title}</p>}
              <Button asChild className="w-full">
                <Link href="/dashboard/focus">
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Continue Session
                </Link>
              </Button>
            </div>
          ) : (
            <div className="text-center w-full">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-20 h-20 mx-auto rounded-full bg-primary flex items-center justify-center cursor-pointer glow-hover mb-4"
                onClick={handleQuickStart}
              >
                <Play className="h-10 w-10 text-primary-foreground ml-1" />
              </motion.div>

              <h3 className="text-lg font-medium mb-3">Ready to focus?</h3>
              <div className="grid grid-cols-2 gap-3">
                <Button variant="outline" className="w-full" onClick={handleQuickStart}>
                  <Clock className="h-4 w-4 mr-2" />
                  Quick Start
                </Button>

                <Button variant="outline" className="w-full" asChild>
                  <Link href="/dashboard/focus">
                    <Music className="h-4 w-4 mr-2" />
                    With Music
                  </Link>
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
