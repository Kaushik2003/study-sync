"use client"

import { motion } from "framer-motion"
import { X, Sparkles, ListChecks, Heading1, FileText, BrainCircuit } from "lucide-react"
import { Button } from "@/components/ui/button"

interface AIPromptMenuProps {
  onSelect: (suggestion: string) => void
  onClose: () => void
}

export function AIPromptMenu({ onSelect, onClose }: AIPromptMenuProps) {
  const prompts = [
    {
      title: "Generate Summary",
      description: "Create a concise summary of your notes",
      icon: Sparkles,
      content: `## Summary\n\nHere's a concise summary of the key points:\n\n- First important concept explained simply\n- Second key takeaway from the material\n- Third critical point to remember\n- Final essential element of the topic\n\nThis summary covers the core concepts you need to understand.`,
    },
    {
      title: "Create Bullet Points",
      description: "Convert your text into organized bullet points",
      icon: ListChecks,
      content: `## Key Points\n\n- **Main Concept**: Definition and importance\n- **Supporting Evidence**: Facts and figures that back up the main concept\n- **Applications**: How this concept is applied in real-world scenarios\n- **Related Theories**: Other ideas that connect to this topic\n- **Examples**: Specific instances that demonstrate the concept`,
    },
    {
      title: "Suggest Title",
      description: "Generate a descriptive title for your notes",
      icon: Heading1,
      content: "# Comprehensive Analysis of Key Concepts and Applications",
    },
    {
      title: "Expand Content",
      description: "Elaborate on your existing notes",
      icon: FileText,
      content: `## Expanded Explanation\n\nThe concept can be further understood through these additional details:\n\n1. **Historical Context**: How this idea developed over time\n2. **Theoretical Framework**: The underlying principles that support this concept\n3. **Practical Applications**: Ways this knowledge can be applied in various fields\n4. **Case Studies**: Real examples that demonstrate the concept in action\n5. **Future Implications**: How this concept might evolve or impact future developments`,
    },
    {
      title: "Generate Quiz Questions",
      description: "Create practice questions based on your notes",
      icon: BrainCircuit,
      content: `## Practice Questions\n\n1. What is the primary function of [concept]?\n2. How does [concept] relate to [related concept]?\n3. In what scenario would you apply [concept]?\n4. What are the limitations of [concept]?\n5. Compare and contrast [concept] with [alternative concept].`,
    },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="glassmorphism rounded-xl p-4 mb-4"
    >
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-medium flex items-center">
          <Sparkles className="h-4 w-4 mr-2 text-primary" />
          AI Suggestions
        </h3>
        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {prompts.map((prompt, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="bg-card/50 p-3 rounded-lg cursor-pointer hover:bg-card"
            onClick={() => onSelect(prompt.content)}
          >
            <div className="flex items-center mb-1">
              <prompt.icon className="h-4 w-4 mr-2 text-primary" />
              <h4 className="font-medium">{prompt.title}</h4>
            </div>
            <p className="text-xs text-muted-foreground">{prompt.description}</p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}
