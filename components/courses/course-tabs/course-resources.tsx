"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Link2, FileText, Plus, ExternalLink } from "lucide-react"
import { useStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { AddResourceDialog } from "@/components/resources/add-resource-dialog"

interface CourseResourcesProps {
  courseId: string
}

export function CourseResources({ courseId }: CourseResourcesProps) {
  const { courses } = useStore()
  const [showAddResource, setShowAddResource] = useState(false)

  // Find the course
  const course = courses.find((c) => c.id === courseId)

  // Get resources for this course
  const resources = course?.resources || []

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">Course Resources</h2>
        <Button onClick={() => setShowAddResource(true)}>
          <Plus className="h-4 w-4 mr-1" />
          Add Resource
        </Button>
      </div>

      <AnimatePresence>
        {resources.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            {resources.map((resource) => (
              <motion.a
                key={resource.id}
                href={resource.url}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                whileHover={{ scale: 1.02 }}
                className="glassmorphism rounded-xl p-4 flex items-start glow-hover"
              >
                <div className="h-10 w-10 rounded-full bg-card flex items-center justify-center mr-3">
                  {resource.type === "link" ? (
                    <Link2 className="h-5 w-5 text-primary" />
                  ) : (
                    <FileText className="h-5 w-5 text-accent" />
                  )}
                </div>

                <div className="flex-1">
                  <h3 className="font-medium mb-1">{resource.title}</h3>
                  <p className="text-sm text-muted-foreground truncate mb-2">{resource.url}</p>

                  <div className="flex items-center text-xs">
                    <span className="flex items-center text-primary">
                      <ExternalLink className="h-3 w-3 mr-1" />
                      {resource.type === "link" ? "Open Link" : "View File"}
                    </span>
                  </div>
                </div>
              </motion.a>
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center p-12 text-center"
          >
            <Link2 className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-xl font-medium mb-2">No resources yet</h3>
            <p className="text-muted-foreground mb-6">
              Add links to helpful websites, videos, or upload files for this course.
            </p>
            <Button onClick={() => setShowAddResource(true)}>
              <Plus className="h-4 w-4 mr-1" />
              Add Your First Resource
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      <AddResourceDialog open={showAddResource} onOpenChange={setShowAddResource} courseId={courseId} />
    </div>
  )
}
