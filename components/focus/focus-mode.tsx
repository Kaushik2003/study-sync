"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Play, Pause, RotateCcw, Clock, CheckCircle } from "lucide-react"
import { useStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { FocusTasks } from "./focus-tasks"
import { SpotifyEmbedImporter } from "./spotify-embed-importer"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function FocusMode() {
  const {
    pomodoroSettings,
    startFocusSession,
    endFocusSession,
    updateFocusSession,
    currentFocusSession,
    isFocusModeActive,
  } = useStore()

  // Timer state
  const [timeLeft, setTimeLeft] = useState(pomodoroSettings.focusDuration * 60)
  const [isRunning, setIsRunning] = useState(false)
  const [timerType, setTimerType] = useState<"pomodoro" | "shortBreak" | "longBreak">("pomodoro")
  const [pomodorosCompleted, setPomodorosCompleted] = useState(0)
  const [showSpotify, setShowSpotify] = useState(false)
  const [sessionHistory, setSessionHistory] = useState<Array<{ type: string; duration: number; timestamp: string }>>([])

  // Set timer duration based on type
  const getTimerDuration = (type: "pomodoro" | "shortBreak" | "longBreak") => {
    switch (type) {
      case "pomodoro":
        return pomodoroSettings.focusDuration * 60
      case "shortBreak":
        return pomodoroSettings.breakDuration * 60
      case "longBreak":
        return pomodoroSettings.longBreakDuration * 60
    }
  }

  // Change timer type
  const changeTimerType = (type: "pomodoro" | "shortBreak" | "longBreak") => {
    setTimerType(type)
    setTimeLeft(getTimerDuration(type))
    setIsRunning(false)
  }

  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  // Calculate progress percentage
  const calculateProgress = () => {
    const totalSeconds = getTimerDuration(timerType)
    return 100 - (timeLeft / totalSeconds) * 100
  }

  // Start timer
  const startTimer = () => {
    if (!isFocusModeActive && timerType === "pomodoro") {
      startFocusSession()
    }
    setIsRunning(true)
  }

  // Pause timer
  const pauseTimer = () => {
    setIsRunning(false)
  }

  // Reset timer
  const resetTimer = () => {
    setIsRunning(false)
    setTimeLeft(getTimerDuration(timerType))
  }

  // Toggle Spotify panel
  const toggleSpotify = () => {
    setShowSpotify(!showSpotify)
  }

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout

    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(timeLeft - 1)

        // Update focus session for pomodoro timers
        if (currentFocusSession && timerType === "pomodoro") {
          updateFocusSession({
            totalFocusTime: (currentFocusSession.totalFocusTime || 0) + 1,
          })
        }
      }, 1000)
    } else if (isRunning && timeLeft === 0) {
      // Timer finished
      const now = new Date().toISOString()

      // Add to session history
      setSessionHistory((prev) => [
        ...prev,
        {
          type: timerType,
          duration: getTimerDuration(timerType),
          timestamp: now,
        },
      ])

      // Play notification sound
      const audio = new Audio("/notification.mp3")
      audio.play().catch((e) => console.log("Audio play failed:", e))

      if (timerType === "pomodoro") {
        // Pomodoro finished
        setPomodorosCompleted((prev) => prev + 1)

        // Update pomodoros completed
        if (currentFocusSession) {
          updateFocusSession({
            pomodorosCompleted: (currentFocusSession.pomodorosCompleted || 0) + 1,
          })
        }

        // Determine if it's time for a long break
        const isLongBreak = (pomodorosCompleted + 1) % pomodoroSettings.longBreakInterval === 0

        // Switch to appropriate break
        changeTimerType(isLongBreak ? "longBreak" : "shortBreak")
        setIsRunning(true)
      } else {
        // Break finished, switch to pomodoro
        changeTimerType("pomodoro")
        setIsRunning(true)
      }
    }

    return () => clearInterval(interval)
  }, [isRunning, timeLeft, timerType])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (isFocusModeActive) {
        endFocusSession()
      }
    }
  }, [])

  return (
    <div className="h-full flex flex-col md:flex-row gap-6">
      <div className="flex-1">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Focus Mode</h1>
          <p className="text-muted-foreground">Stay productive with the Pomodoro technique</p>
        </div>

        <div className="glassmorphism rounded-2xl p-6 mb-6">
          <Tabs value={timerType} onValueChange={(v) => changeTimerType(v as any)} className="mb-6">
            <TabsList className="grid grid-cols-3">
              <TabsTrigger value="pomodoro">Pomodoro</TabsTrigger>
              <TabsTrigger value="shortBreak">Short Break</TabsTrigger>
              <TabsTrigger value="longBreak">Long Break</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="flex flex-col items-center">
            <div className="text-center mb-8">
              <h2 className="text-xl font-semibold mb-1">
                {timerType === "pomodoro" ? "Focus Time" : timerType === "shortBreak" ? "Short Break" : "Long Break"}
              </h2>
              <p className="text-muted-foreground">
                {timerType === "pomodoro" ? "Stay focused on your task" : "Take a break and relax"}
              </p>
            </div>

            <motion.div
              className="relative w-64 h-64 mb-8"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-5xl font-bold">{formatTime(timeLeft)}</div>
              </div>

              <svg className="w-full h-full" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="2" strokeOpacity="0.1" />
                <motion.circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke={
                    timerType === "pomodoro"
                      ? "hsl(var(--primary))"
                      : timerType === "shortBreak"
                        ? "hsl(var(--cyan))"
                        : "hsl(var(--purple))"
                  }
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeDasharray="283"
                  strokeDashoffset={283 - (283 * calculateProgress()) / 100}
                  transform="rotate(-90 50 50)"
                  initial={{ strokeDashoffset: 283 }}
                  animate={{ strokeDashoffset: 283 - (283 * calculateProgress()) / 100 }}
                  transition={{ duration: 0.5 }}
                />
              </svg>
            </motion.div>

            <div className="flex items-center gap-4 mb-6">
              <Button variant="outline" size="icon" className="h-12 w-12 rounded-full" onClick={resetTimer}>
                <RotateCcw className="h-5 w-5" />
                <span className="sr-only">Reset</span>
              </Button>

              <Button
                size="icon"
                className="h-16 w-16 rounded-full"
                onClick={isRunning ? pauseTimer : startTimer}
                style={{
                  backgroundColor:
                    timerType === "pomodoro"
                      ? "hsl(var(--primary))"
                      : timerType === "shortBreak"
                        ? "hsl(var(--cyan))"
                        : "hsl(var(--purple))",
                }}
              >
                {isRunning ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
                <span className="sr-only">{isRunning ? "Pause" : "Start"}</span>
              </Button>

              <Button variant="outline" size="icon" className="h-12 w-12 rounded-full" onClick={toggleSpotify}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-music"
                >
                  <path d="M9 18V5l12-2v13" />
                  <circle cx="6" cy="18" r="3" />
                  <circle cx="18" cy="16" r="3" />
                </svg>
                <span className="sr-only">Spotify</span>
              </Button>
            </div>

            <div className="text-center">
              <p className="text-sm text-muted-foreground">{pomodorosCompleted} pomodoros completed today</p>
            </div>
          </div>
        </div>

        {showSpotify && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="glassmorphism rounded-2xl p-6 mb-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Spotify</h2>
            </div>

            <SpotifyEmbedImporter />
          </motion.div>
        )}

        {sessionHistory.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glassmorphism rounded-2xl p-6 mb-6"
          >
            <h2 className="text-xl font-semibold mb-4">Today's Sessions</h2>
            <div className="space-y-3">
              {sessionHistory
                .slice()
                .reverse()
                .map((session, index) => (
                  <div key={index} className="flex items-center p-3 bg-card/50 rounded-lg">
                    <div
                      className={`h-8 w-8 rounded-full flex items-center justify-center mr-3 ${
                        session.type === "pomodoro"
                          ? "bg-primary/20 text-primary"
                          : session.type === "shortBreak"
                            ? "bg-cyan/20 text-cyan"
                            : "bg-electric-purple/20 text-electric-purple"
                      }`}
                    >
                      {session.type === "pomodoro" ? (
                        <Clock className="h-4 w-4" />
                      ) : (
                        <CheckCircle className="h-4 w-4" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">
                        {session.type === "pomodoro"
                          ? "Focus Session"
                          : session.type === "shortBreak"
                            ? "Short Break"
                            : "Long Break"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(session.timestamp).toLocaleTimeString()} • {formatTime(session.duration)}
                      </p>
                    </div>
                  </div>
                ))}
            </div>
          </motion.div>
        )}
      </div>

      <div className="w-full md:w-80 flex-shrink-0">
        <FocusTasks />
      </div>
    </div>
  )
}
