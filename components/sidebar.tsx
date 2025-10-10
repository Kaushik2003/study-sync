"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import {
  LayoutDashboard,
  Calendar,
  BookOpen,
  Clock,
  FileText,
  Bot,
  ChevronLeft,
  ChevronRight,
  Menu,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { useMediaQuery } from "@/hooks/use-media-query"

export function Sidebar() {
  const pathname = usePathname()
  const { sidebarOpen, setSidebarOpen } = useStore()
  const isMobile = useMediaQuery("(max-width: 768px)")
  const [showMobileSidebar, setShowMobileSidebar] = useState(false)

  // Close mobile sidebar when navigating
  useEffect(() => {
    if (isMobile) {
      setShowMobileSidebar(false)
    }
  }, [pathname, isMobile])

  // Handle sidebar toggle
  const toggleSidebar = () => {
    if (isMobile) {
      setShowMobileSidebar(!showMobileSidebar)
    } else {
      setSidebarOpen(!sidebarOpen)
    }
  }

  // Navigation items
  const navItems = [
    { href: "/", label: "Dashboard", icon: LayoutDashboard },
    { href: "/planner", label: "Planner", icon: Calendar },
    { href: "/courses", label: "Courses", icon: BookOpen },
    { href: "/focus", label: "Focus Mode", icon: Clock },
    { href: "/notes", label: "Notes", icon: FileText },
    { href: "/assistant", label: "AI Assistant", icon: Bot },
  ]

  // Sidebar variants for animation
  const sidebarVariants = {
    open: { width: "240px", transition: { duration: 0.2 } },
    closed: { width: "72px", transition: { duration: 0.2 } },
  }

  // Mobile sidebar variants
  const mobileSidebarVariants = {
    open: { x: 0, transition: { duration: 0.2 } },
    closed: { x: "-100%", transition: { duration: 0.2 } },
  }

  // Render mobile sidebar
  if (isMobile) {
    return (
      <>
        <Button variant="ghost" size="icon" className="fixed top-4 left-4 z-50 md:hidden" onClick={toggleSidebar}>
          <Menu className="h-5 w-5" />
        </Button>

        <AnimatePresence>
          {showMobileSidebar && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.5 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40"
                onClick={toggleSidebar}
              />

              <motion.div
                initial="closed"
                animate="open"
                exit="closed"
                variants={mobileSidebarVariants}
                className="fixed top-0 left-0 bottom-0 z-50 w-64 glassmorphism"
              >
                <div className="flex flex-col h-full p-4">
                  <div className="flex items-center justify-between mb-8">
                    <h1 className="text-xl font-bold text-primary">StudySync</h1>
                    <Button variant="ghost" size="icon" onClick={toggleSidebar}>
                      <ChevronLeft className="h-5 w-5" />
                    </Button>
                  </div>

                  <nav className="space-y-2">
                    {navItems.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={cn("sidebar-item", pathname === item.href && "active")}
                      >
                        <item.icon className="h-5 w-5" />
                        <span>{item.label}</span>
                      </Link>
                    ))}
                  </nav>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </>
    )
  }

  // Render desktop sidebar
  return (
    <motion.div
      initial={sidebarOpen ? "open" : "closed"}
      animate={sidebarOpen ? "open" : "closed"}
      variants={sidebarVariants}
      className="h-screen glassmorphism border-r border-border/50 relative z-20 overflow-hidden"
    >
      <div className="flex flex-col h-full p-4">
        <div className="flex items-center justify-between mb-8">
          {sidebarOpen ? (
            <h1 className="text-xl font-bold text-primary">StudySync</h1>
          ) : (
            <span className="text-xl font-bold text-primary">SS</span>
          )}

          <Button variant="ghost" size="icon" onClick={toggleSidebar}>
            {sidebarOpen ? <ChevronLeft className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
          </Button>
        </div>

        <nav className="space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn("sidebar-item", pathname === item.href && "active", !sidebarOpen && "justify-center")}
              title={!sidebarOpen ? item.label : undefined}
            >
              <item.icon className="h-5 w-5" />
              {sidebarOpen && <span>{item.label}</span>}
            </Link>
          ))}
        </nav>
      </div>
    </motion.div>
  )
}
