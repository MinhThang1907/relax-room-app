"use client"

import { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { useMoods } from "@/hooks/useMoods"
import { SearchBar } from "@/components/search-bar"
import { MoodGrid } from "@/components/mood-grid"
import { MoodSkeleton } from "@/components/mood-skeleton"
import { ErrorState } from "@/components/error-state"

export default function MoodsPage() {
  const router = useRouter()
  const { moods, loading, error } = useMoods()
  const [searchQuery, setSearchQuery] = useState("")

  const filteredMoods = useMemo(() => {
    if (!searchQuery) return moods
    return moods.filter((mood) => {
      const query = searchQuery.toLowerCase()
      return (
        mood.name.toLowerCase().includes(query) ||
        mood.description.toLowerCase().includes(query) ||
        mood.tags.some((tag) => tag.toLowerCase().includes(query))
      )
    })
  }, [moods, searchQuery])

  const handleCreateRoom = (moodId: string) => {
    router.push(`/create?moodId=${moodId}`)
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold mb-2">Chọn mood</h1>
        <p className="text-muted-foreground">Chọn âm thanh yêu thích để tạo phòng chill</p>
      </div>

      <SearchBar onSearch={setSearchQuery} />

      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <MoodSkeleton key={i} />
          ))}
        </div>
      )}

      {error && !loading && <ErrorState message={error} />}

      {!loading && !error && filteredMoods.length > 0 && (
        <MoodGrid moods={filteredMoods} onCreateRoom={handleCreateRoom} />
      )}

      {!loading && !error && filteredMoods.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Không tìm thấy mood nào. Thử tìm kiếm khác.</p>
        </div>
      )}
    </div>
  )
}
