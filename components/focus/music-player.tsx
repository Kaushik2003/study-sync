"use client"

import { useState } from "react"
import { Play, Pause, SkipForward, SkipBack } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"

interface MusicPlayerProps {
  isMuted: boolean
}

export function MusicPlayer({ isMuted }: MusicPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTrack, setCurrentTrack] = useState(0)
  const [volume, setVolume] = useState(80)

  // Mock tracks
  const tracks = [
    { title: "Lo-Fi Study Beats", artist: "ChillHop" },
    { title: "Deep Focus", artist: "Ambient Sounds" },
    { title: "Nature Sounds", artist: "Relaxation" },
    { title: "Piano Concentration", artist: "Classical Focus" },
  ]

  // Toggle play/pause
  const togglePlay = () => {
    setIsPlaying(!isPlaying)
  }

  // Next track
  const nextTrack = () => {
    setCurrentTrack((currentTrack + 1) % tracks.length)
  }

  // Previous track
  const prevTrack = () => {
    setCurrentTrack((currentTrack - 1 + tracks.length) % tracks.length)
  }

  return (
    <div>
      <div className="mb-4">
        <h3 className="font-medium">{tracks[currentTrack].title}</h3>
        <p className="text-sm text-muted-foreground">{tracks[currentTrack].artist}</p>
      </div>

      <div className="flex items-center justify-center gap-2 mb-6">
        <Button variant="ghost" size="icon" onClick={prevTrack}>
          <SkipBack className="h-5 w-5" />
          <span className="sr-only">Previous</span>
        </Button>

        <Button size="icon" className="h-10 w-10 rounded-full" onClick={togglePlay}>
          {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
          <span className="sr-only">{isPlaying ? "Pause" : "Play"}</span>
        </Button>

        <Button variant="ghost" size="icon" onClick={nextTrack}>
          <SkipForward className="h-5 w-5" />
          <span className="sr-only">Next</span>
        </Button>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm">Volume</span>
          <span className="text-sm">{volume}%</span>
        </div>
        <Slider
          value={[volume]}
          min={0}
          max={100}
          step={1}
          onValueChange={(value) => setVolume(value[0])}
          disabled={isMuted}
        />
      </div>
    </div>
  )
}
