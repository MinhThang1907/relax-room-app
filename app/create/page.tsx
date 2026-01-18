"use client"

import { useSearchParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { moodsService } from "@/services/moodsService"
import { roomsService } from "@/services/roomsService"
import type { Mood } from "@/domain/mood"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DurationSelector } from "@/components/duration-selector"
import { ErrorState } from "@/components/error-state"

export default function CreatePage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const moodId = searchParams.get("moodId")

  const [mood, setMood] = useState<Mood | null>(null)
  const [duration, setDuration] = useState(10)
  const [loading, setLoading] = useState(false)
  const [creating, setCreating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!moodId) {
      router.push("/moods")
      return
    }

    const fetchMood = async () => {
      try {
        setLoading(true)
        const data = await moodsService.getMoodById(moodId)
        setMood(data)
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Lỗi tải thông tin mood")
      } finally {
        setLoading(false)
      }
    }

    fetchMood()
  }, [moodId, router])

  const handleCreate = async () => {
    if (!moodId) return

    try {
      setCreating(true)
      setError(null)
      const roomId = await roomsService.createRoom(moodId, duration)
      router.push(`/room/${roomId}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Lỗi tạo phòng")
      setCreating(false)
    }
  }

  if (loading) {
    return (
      <div className="max-w-md mx-auto">
        <div className="space-y-4">
          <div className="h-12 bg-slate-200 rounded animate-pulse" />
          <div className="h-32 bg-slate-200 rounded animate-pulse" />
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-md mx-auto space-y-6">
      <div>
        <h1 className="text-4xl font-bold mb-2">Tạo phòng</h1>
        <p className="text-muted-foreground">Chọn thời gian và bắt đầu chill</p>
      </div>

      {error && <ErrorState message={error} onRetry={() => setError(null)} />}

      {mood && (
        <Card>
          <CardHeader>
            <CardTitle>{mood.name}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-muted-foreground">{mood.description}</p>

            <div>
              <DurationSelector selected={duration} onSelect={setDuration} />
            </div>

            <Button onClick={handleCreate} disabled={creating} className="w-full h-12 text-base" size="lg">
              {creating ? "Đang tạo..." : "Tạo phòng"}
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
