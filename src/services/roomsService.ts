import { apiClient } from "@/lib/apiClient"
import type { RoomDetail } from "@/domain/room"

export const roomsService = {
  async createRoom(moodId: string, durationMinutes: number): Promise<string> {
    const response = await apiClient.post<{ roomId: string }>("/api/rooms", { moodId, durationMinutes })
    if (response.ok && response.data) {
      return response.data.roomId
    }
    throw new Error(response.error || "Lỗi tạo phòng")
  },

  async getRoomDetail(roomId: string): Promise<RoomDetail> {
    const response = await apiClient.get<RoomDetail>(`/api/rooms/${roomId}`)
    if (response.ok && response.data) {
      return response.data
    }
    throw new Error(response.error || "Lỗi tải phòng")
  },

  async joinRoom(roomId: string): Promise<void> {
    const response = await apiClient.post(`/api/rooms/${roomId}/join`)
    if (!response.ok) {
      throw new Error(response.error || "Lỗi tham gia phòng")
    }
  },

  async startRoom(roomId: string): Promise<void> {
    const response = await apiClient.post(`/api/rooms/${roomId}/start`)
    if (!response.ok) {
      throw new Error(response.error || "Lỗi bắt đầu phòng")
    }
  },

  async rateRoom(roomId: string, rating: "BETTER" | "SAME" | "WORSE"): Promise<void> {
    const response = await apiClient.post(`/api/rooms/${roomId}/rating`, {
      rating,
    })
    if (!response.ok) {
      throw new Error(response.error || "Lỗi đánh giá")
    }
  },
}
