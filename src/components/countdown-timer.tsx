"use client"

import { useEffect, useState } from "react"
import { calculateRemainingSeconds, formatTime } from "@/lib/utils"

interface CountdownTimerProps {
  startedAt: string
  durationMinutes: number
  onEnd?: () => void
}

export function CountdownTimer({ startedAt, durationMinutes, onEnd }: CountdownTimerProps) {
  const [remaining, setRemaining] = useState(0)

  useEffect(() => {
    const initial = calculateRemainingSeconds(startedAt, durationMinutes)
    setRemaining(initial)

    const interval = setInterval(() => {
      const newRemaining = calculateRemainingSeconds(startedAt, durationMinutes)
      setRemaining(newRemaining)

      if (newRemaining <= 0) {
        clearInterval(interval)
        onEnd?.()
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [startedAt, durationMinutes, onEnd])

  return (
    <div className="text-center">
      <div className="text-6xl md:text-7xl font-bold text-primary mb-4">{formatTime(remaining)}</div>
      <p className="text-muted-foreground">Còn lại</p>
    </div>
  )
}
