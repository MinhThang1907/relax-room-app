import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`
}

export const calculateRemainingSeconds = (startedAt: string, durationMinutes: number): number => {
  const started = new Date(startedAt).getTime()
  const now = new Date().getTime()
  const elapsed = Math.floor((now - started) / 1000)
  const totalSeconds = durationMinutes * 60
  const remaining = totalSeconds - elapsed
  return Math.max(0, remaining)
}
