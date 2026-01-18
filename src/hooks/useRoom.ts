"use client"

import { useEffect, useState, useRef } from "react"
import type { RoomDetail, Room, Participant } from "@/domain/room"
import { roomsService } from "@/services/roomsService"
import { env } from "@/lib/env"

export const useRoom = (roomId: string) => {
  const [roomDetail, setRoomDetail] = useState<RoomDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const eventSourceRef = useRef<EventSource | null>(null)
  const pollingRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const detail = await roomsService.getRoomDetail(roomId)
        setRoomDetail((prev) => mergeRoomDetail(prev, detail))
        setError(null)

        // Try SSE first (polling stays as fallback until SSE delivers updates)
        connectSSE()
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : "Lỗi tải phòng"
        setError(errorMsg)

        // Fallback to polling
        startPolling()
      } finally {
        setLoading(false)
      }
    }

    fetchRoom()

    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close()
      }
      if (pollingRef.current) {
        clearInterval(pollingRef.current)
      }
    }
  }, [roomId])

  const normalizeRoom = (payload: any): Room => {
    if (!payload) {
      throw new Error("Invalid room payload")
    }
    if ("moodId" in payload) {
      return payload as Room
    }
    return {
      id: payload.id,
      moodId: payload.mood_id,
      durationMinutes: payload.duration_minutes,
      status: payload.status,
      hostUserId: payload.host_user_id,
      createdAt: payload.created_at,
      startedAt: payload.started_at ?? null,
      endsAt: payload.ends_at ?? null,
    }
  }

  const normalizeParticipants = (payload: any): Participant[] => {
    const list = Array.isArray(payload) ? payload : [payload]
    return list
      .filter(Boolean)
      .map((participant) => {
        if ("userId" in participant) {
          return { userId: participant.userId, joinedAt: participant.joinedAt }
        }
        return { userId: participant.user_id, joinedAt: participant.joined_at }
      })
  }

  const stopPolling = () => {
    if (pollingRef.current) {
      clearInterval(pollingRef.current)
      pollingRef.current = null
    }
  }

  const connectSSE = () => {
    try {
      const guestId = localStorage.getItem("guest-id") || ""
      const eventSource = new EventSource(`${env.backendUrl}/api/rooms/${roomId}/stream?x-guest-id=${guestId}`)

      eventSource.addEventListener("room_updated", (event) => {
        try {
          const updatedRoom = normalizeRoom(JSON.parse(event.data))
          setRoomDetail((prev) => (prev ? { ...prev, room: updatedRoom } : null))
          stopPolling()
        } catch (e) {
          console.error("Error parsing SSE room_updated:", e)
        }
      })

      eventSource.addEventListener("participants_updated", (event) => {
        try {
          const updatedParticipants = normalizeParticipants(JSON.parse(event.data))
          setRoomDetail((prev) => (prev ? { ...prev, participants: updatedParticipants } : null))
          stopPolling()
        } catch (e) {
          console.error("Error parsing SSE participants_updated:", e)
        }
      })

      eventSource.onerror = () => {
        eventSource.close()
        eventSourceRef.current = null
        // Fallback to polling
        startPolling()
      }

      eventSourceRef.current = eventSource

      // Start polling until we actually receive SSE updates.
      startPolling()
    } catch (err) {
      console.error("SSE connection error:", err)
      startPolling()
    }
  }

  const startPolling = () => {
    if (pollingRef.current) return
    pollingRef.current = setInterval(async () => {
      try {
        const detail = await roomsService.getRoomDetail(roomId)
        setRoomDetail((prev) => mergeRoomDetail(prev, detail))
      } catch (err) {
        console.error("Polling error:", err)
      }
    }, 3000)
  }

  return { roomDetail, loading, error }
}

const getAudioBase = (url?: string) => {
  if (!url) return ""
  const [base] = url.split("?")
  return base
}

const mergeRoomDetail = (prev: RoomDetail | null, next: RoomDetail): RoomDetail => {
  if (!prev) return next
  const prevAudioBase = getAudioBase(prev.mood.audioUrl)
  const nextAudioBase = getAudioBase(next.mood.audioUrl)

  if (prevAudioBase && nextAudioBase && prevAudioBase === nextAudioBase) {
    return {
      ...next,
      mood: {
        ...next.mood,
        audioUrl: prev.mood.audioUrl,
      },
    }
  }

  return next
}
