"use client"

import { motion } from "framer-motion"
import { useStore } from "@/lib/store"
import { CoursesWidget } from "./widgets/courses-widget"
import { TodaysPlanWidget } from "./widgets/todays-plan-widget"
import { FocusShortcutWidget } from "./widgets/focus-shortcut-widget"
import { StatsWidget } from "./widgets/stats-widget"
// Remove the NotificationsWidget import

export function Dashboard() {
  const { courses, tasks, focusSessions } = useStore()

  // Animation variants for staggered animation
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  }

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col overflow-hidden">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back to StudySync</p>
      </div>

      <motion.div
        className="grid grid-cols-1 md:grid-cols-6 lg:grid-cols-12 gap-6 flex-1 overflow-auto pb-6"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        {/* Today's Plan Widget - Spans 6 columns on medium, 5 on large */}
        <motion.div variants={itemVariants} className="col-span-1 md:col-span-6 lg:col-span-5 row-span-1 md:row-span-2">
          <TodaysPlanWidget tasks={tasks} />
        </motion.div>

        {/* Stats Widget - Spans 6 columns on medium, 7 on large */}
        <motion.div variants={itemVariants} className="col-span-1 md:col-span-6 lg:col-span-7 row-span-1">
          <StatsWidget tasks={tasks} focusSessions={focusSessions} />
        </motion.div>

        {/* Focus Shortcut Widget - Spans 6 columns on medium, 5 on large */}
        <motion.div variants={itemVariants} className="col-span-1 md:col-span-6 lg:col-span-7 row-span-1">
          <FocusShortcutWidget />
        </motion.div>

        {/* Courses Widget - Spans 6 columns on medium, 8 on large */}
        <motion.div
          variants={itemVariants}
          className="col-span-1 md:col-span-6 lg:col-span-12 row-span-1 md:row-span-2"
        >
          <CoursesWidget courses={courses} />
        </motion.div>

        {/* Removed NotificationsWidget */}
      </motion.div>
    </div>
  )
}
