import { apiClient } from "@/lib/apiClient"
import type { Mood } from "@/domain/mood"

export const moodsService = {
  async getMoods(): Promise<Mood[]> {
    const response = await apiClient.get<Mood[]>("/api/moods")
    if (response.ok && response.data) {
      return response.data
    }
    throw new Error(response.error || "Lỗi tải moods")
  },

  async getMoodById(moodId: string): Promise<Mood> {
    const response = await apiClient.get<Mood>(`/api/moods/${moodId}`)
    if (response.ok && response.data) {
      return response.data
    }
    throw new Error(response.error || "Lỗi tải mood")
  },
}
