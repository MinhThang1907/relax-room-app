"use client"

import type { Mood } from "@/domain/mood"
import { MoodCard } from "./mood-card"

interface MoodGridProps {
  moods: Mood[]
  onCreateRoom: (moodId: string) => void
}

export function MoodGrid({ moods, onCreateRoom }: MoodGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {moods.map((mood) => (
        <MoodCard key={mood.id} mood={mood} onCreateRoom={onCreateRoom} />
      ))}
    </div>
  )
}
