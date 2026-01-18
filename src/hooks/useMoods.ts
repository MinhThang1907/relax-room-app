"use client"

import { useEffect, useState } from "react"
import type { Mood } from "@/domain/mood"
import { moodsService } from "@/services/moodsService"

export const useMoods = () => {
  const [moods, setMoods] = useState<Mood[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchMoods = async () => {
      try {
        setLoading(true)
        const data = await moodsService.getMoods()
        setMoods(data)
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Lỗi tải danh sách moods")
      } finally {
        setLoading(false)
      }
    }

    fetchMoods()
  }, [])

  return { moods, loading, error }
}
