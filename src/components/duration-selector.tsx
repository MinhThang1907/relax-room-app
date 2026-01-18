"use client"

import { Button } from "@/components/ui/button"

interface DurationSelectorProps {
  selected: number
  onSelect: (duration: number) => void
}

export function DurationSelector({ selected, onSelect }: DurationSelectorProps) {
  const durations = [5, 10, 25]

  return (
    <div className="flex items-center gap-3">
      <span className="text-sm font-medium text-muted-foreground">Thời gian:</span>
      <div className="flex gap-2">
        {durations.map((duration) => (
          <Button
            key={duration}
            variant={selected === duration ? "default" : "outline"}
            size="sm"
            onClick={() => onSelect(duration)}
          >
            {duration} phút
          </Button>
        ))}
      </div>
    </div>
  )
}
