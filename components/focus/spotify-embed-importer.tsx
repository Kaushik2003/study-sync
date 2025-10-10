"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Music, X, Import, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"

export function SpotifyEmbedImporter() {
  const [showImporter, setShowImporter] = useState(false)
  const [spotifyUrl, setSpotifyUrl] = useState("")
  const [embedUrl, setEmbedUrl] = useState("")
  const [error, setError] = useState("")
  const [isImported, setIsImported] = useState(false)

  // Parse Spotify URL to get the embed URL
  const parseSpotifyUrl = (url: string) => {
    try {
      // Reset states
      setError("")

      // Check if it's a valid Spotify URL
      if (!url.includes("spotify.com")) {
        setError("Please enter a valid Spotify URL")
        return
      }

      // Extract the type and ID from the URL
      // Examples:
      // https://open.spotify.com/track/1dGr1c8CrMLDpV6mPbImSI
      // https://open.spotify.com/album/2noRn2Aes5aoNVsU6iWThc
      // https://open.spotify.com/playlist/7K6fVGUcL6ChCsRMJP4oOC
      const urlParts = url.split("/")
      const typeIndex = urlParts.findIndex((part) => part === "track" || part === "album" || part === "playlist")

      if (typeIndex === -1 || typeIndex + 1 >= urlParts.length) {
        setError("Invalid Spotify URL format")
        return
      }

      const type = urlParts[typeIndex]
      let id = urlParts[typeIndex + 1]

      // Remove query parameters if present
      if (id.includes("?")) {
        id = id.split("?")[0]
      }

      // Create the embed URL
      const newEmbedUrl = `https://open.spotify.com/embed/${type}/${id}?utm_source=generator`
      setEmbedUrl(newEmbedUrl)
      setIsImported(true)

      // Close the importer after a delay
      setTimeout(() => {
        setShowImporter(false)
        // Reset the imported state after the importer is closed
        setTimeout(() => setIsImported(false), 300)
      }, 1500)
    } catch (err) {
      setError("Failed to parse Spotify URL")
      console.error(err)
    }
  }

  // Handle import button click
  const handleImport = () => {
    if (!spotifyUrl.trim()) {
      setError("Please enter a Spotify URL")
      return
    }

    parseSpotifyUrl(spotifyUrl.trim())
  }

  return (
    <div className="mb-6">
      <Button variant="outline" className="flex items-center gap-2" onClick={() => setShowImporter(!showImporter)}>
        <Music className="h-4 w-4" />
        Import Song/Playlist from Spotify
      </Button>

      <AnimatePresence>
        {showImporter && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mt-4"
          >
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg flex items-center">
                    <Music className="h-5 w-5 mr-2 text-primary" />
                    Import from Spotify
                  </CardTitle>
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setShowImporter(false)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-4">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Paste Spotify URL (song, album, or playlist)"
                      value={spotifyUrl}
                      onChange={(e) => setSpotifyUrl(e.target.value)}
                      className="flex-1"
                    />
                    <Button onClick={handleImport} className="flex-shrink-0" disabled={isImported}>
                      {isImported ? (
                        <>
                          <Check className="h-4 w-4 mr-1" />
                          Imported
                        </>
                      ) : (
                        <>
                          <Import className="h-4 w-4 mr-1" />
                          Import
                        </>
                      )}
                    </Button>
                  </div>

                  {error && (
                    <Alert variant="destructive">
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  <div className="text-xs text-muted-foreground">
                    <p>Supported formats:</p>
                    <ul className="list-disc list-inside ml-2 mt-1">
                      <li>https://open.spotify.com/track/1dGr1c8CrMLDpV6mPbImSI</li>
                      <li>https://open.spotify.com/album/2noRn2Aes5aoNVsU6iWThc</li>
                      <li>https://open.spotify.com/playlist/7K6fVGUcL6ChCsRMJP4oOC</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="pt-0">
                <p className="text-xs text-muted-foreground">Imported content will appear in the music player below</p>
              </CardFooter>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {embedUrl && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-6">
          <iframe
            style={{ borderRadius: "12px" }}
            src={embedUrl}
            width="100%"
            height="352"
            frameBorder="0"
            allowFullScreen
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"
          ></iframe>
        </motion.div>
      )}
    </div>
  )
}
