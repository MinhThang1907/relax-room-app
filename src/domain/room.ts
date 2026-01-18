import type { Mood } from "./mood" // Assuming Mood is declared in another file, e.g., src/domain/mood.ts

export type RoomStatus = "LOBBY" | "RUNNING" | "ENDED"

export interface Participant {
  userId: string
  joinedAt: string
}

export interface Room {
  id: string
  moodId: string
  durationMinutes: number
  status: RoomStatus
  hostUserId: string
  createdAt: string
  startedAt: string | null
  endsAt: string | null
}

export interface RoomDetail {
  room: Room
  mood: Mood
  participants: Participant[]
}
