"use client"

import { useState, useEffect } from "react"

interface MarkdownPreviewProps {
  content: string
}

export function MarkdownPreview({ content }: MarkdownPreviewProps) {
  const [html, setHtml] = useState<string>("")

  useEffect(() => {
    // Basic markdown parsing
    const parsedContent = content
      // Headers
      .replace(/^# (.*$)/gm, "<h1>$1</h1>")
      .replace(/^## (.*$)/gm, "<h2>$1</h2>")
      .replace(/^### (.*$)/gm, "<h3>$1</h3>")
      // Bold
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      // Italic
      .replace(/\*(.*?)\*/g, "<em>$1</em>")
      // Lists
      .replace(/^- (.*$)/gm, "<li>$1</li>")
      .replace(/<\/li>\n<li>/g, "</li><li>")
      .replace(/<li>(.+?)(?=<\/li>|$)/g, (match) => match.replace(/\n/g, "<br>"))
      .replace(/(<li>.*<\/li>)/g, "<ul>$1</ul>")
      // Line breaks
      .replace(/\n/g, "<br>")
      // Code blocks
      .replace(/```([\s\S]*?)```/g, "<pre><code>$1</code></pre>")
      // Inline code
      .replace(/`([^`]+)`/g, "<code>$1</code>")
      // Links
      .replace(/\[([^\]]+)\]$$([^)]+)$$/g, '<a href="$2" class="text-primary hover:underline">$1</a>')

    setHtml(parsedContent)
  }, [content])

  return <div className="markdown-preview" dangerouslySetInnerHTML={{ __html: html }} />
}
