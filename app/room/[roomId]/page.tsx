"use client"

import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { useRoom } from "@/hooks/useRoom"
import { useGuestId } from "@/hooks/useGuestId"
import { roomsService } from "@/services/roomsService"
import type { RoomStatus } from "@/domain/room"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { RoomStatusBadge } from "@/components/room-status-badge"
import { ShareLinkBox } from "@/components/share-link-box"
import { AudioPlayer } from "@/components/audio-player"
import { CountdownTimer } from "@/components/countdown-timer"
import { RoomSkeleton } from "@/components/room-skeleton"
import { ErrorState } from "@/components/error-state"

export default function RoomPage() {
  const params = useParams()
  const router = useRouter()
  const roomId = params.roomId as string
  const guestId = useGuestId()

  const { roomDetail, loading, error } = useRoom(roomId)
  const [ratingError, setRatingError] = useState<string | null>(null)
  const [ratingLoading, setRatingLoading] = useState(false)

  useEffect(() => {
    if (!guestId) return

    // Auto join if not already in participants
    if (roomDetail && !roomDetail.participants.some((p) => p.userId === guestId)) {
      roomsService.joinRoom(roomId).catch((err) => {
        console.error("Auto-join failed:", err)
      })
    }
  }, [roomDetail, guestId, roomId])

  const handleStartRoom = async () => {
    try {
      await roomsService.startRoom(roomId)

    } catch (err) {
      console.error("Error starting room:", err)
    }
  }

  const handleRate = async (rating: "BETTER" | "SAME" | "WORSE") => {
    try {
      setRatingLoading(true)
      await roomsService.rateRoom(roomId, rating)
      router.push("/moods")
    } catch (err) {
      setRatingError(err instanceof Error ? err.message : "Lỗi đánh giá phòng")
      setRatingLoading(false)
    }
  }

  if (loading || !roomDetail) {
    return <RoomSkeleton />
  }

  const { room, mood, participants } = roomDetail
  const isHost = room.hostUserId === guestId
  const status = room.status as RoomStatus

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold mb-2">{mood.name}</h1>
          <RoomStatusBadge status={status} />
        </div>
      </div>

      {error && <ErrorState message={error} />}
      {ratingError && <ErrorState message={ratingError} onRetry={() => setRatingError(null)} />}

      {/* Lobby State */}
      {status === "LOBBY" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <ShareLinkBox roomId={roomId} />

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Người tham gia</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {participants.map((p, idx) => (
                    <div key={p.userId} className="flex items-center gap-2">
                      <Badge variant="secondary">Khách #{idx + 1}</Badge>
                      {p.userId === room.hostUserId && <Badge variant="default">Chủ phòng</Badge>}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {isHost && (
              <Button onClick={handleStartRoom} size="lg" className="w-full h-12 text-base">
                Bắt đầu
              </Button>
            )}
          </div>

          {/* Side Panel */}
          <div className="space-y-4">
            <Card className="bg-slate-50">
              <CardContent className="pt-6">
                <p className="text-sm text-muted-foreground mb-2">Thời gian chill</p>
                <p className="text-2xl font-bold">{room.durationMinutes} phút</p>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Running State */}
      {status === "RUNNING" && room.startedAt && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Timer */}
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="pt-12 pb-12">
                <CountdownTimer startedAt={room.startedAt} durationMinutes={room.durationMinutes} />
              </CardContent>
            </Card>

            {/* Audio Player */}
            <Card className="mt-6">
              <CardContent className="pt-6">
                {mood.audioUrl && <AudioPlayer audioUrl={mood.audioUrl} moodName={mood.name} />}
              </CardContent>
            </Card>
          </div>

          {/* Participants Info */}
          <div className="space-y-4">
            <Card className="bg-slate-50">
              <CardContent className="pt-6">
                <p className="text-sm font-medium text-muted-foreground mb-3">Đang chill ({participants.length})</p>
                <div className="space-y-2">
                  {participants.map((_, idx) => (
                    <div key={idx} className="h-8 bg-white rounded flex items-center px-2 text-xs">
                      Khách #{idx + 1}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Ended State */}
      {status === "ENDED" && (
        <div className="max-w-2xl mx-auto space-y-6">
          <Card>
            <CardContent className="pt-12 pb-12">
              <div className="text-center space-y-6">
                <p className="text-2xl font-semibold">Bạn vừa chill xong. Bạn thấy thế nào?</p>

                <div className="flex gap-3 justify-center">
                  <Button onClick={() => handleRate("BETTER")} disabled={ratingLoading} variant="outline">
                    Tốt hơn
                  </Button>
                  <Button onClick={() => handleRate("SAME")} disabled={ratingLoading} variant="outline">
                    Bình thường
                  </Button>
                  <Button onClick={() => handleRate("WORSE")} disabled={ratingLoading} variant="outline">
                    Tệ hơn
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Suggest other moods */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Thử mood khác?</h3>
            <Button onClick={() => router.push("/moods")} className="w-full h-12">
              Tạo phòng mới
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

