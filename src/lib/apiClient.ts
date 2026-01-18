import { env } from "./env"

export interface ApiResponse<T> {
  ok: boolean
  data?: T
  error?: string
  errorCode?: string
}

const normalizeApiResponse = <T>(payload: any): ApiResponse<T> => {
  if (!payload || typeof payload !== "object") {
    return { ok: false, error: "Phản hồi không hợp lệ từ máy chủ" }
  }

  if (payload.ok === false && payload.error && typeof payload.error === "object") {
    return {
      ok: false,
      error: payload.error.message,
      errorCode: payload.error.code,
    }
  }

  return payload as ApiResponse<T>
}

const getGuestId = (): string => {
  if (typeof window === "undefined") return ""

  let guestId = localStorage.getItem("guest-id")
  if (!guestId) {
    guestId = generateUUID()
    localStorage.setItem("guest-id", guestId)
  }
  return guestId
}

const generateUUID = (): string => {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0
    const v = c === "x" ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

const buildHeaders = (additionalHeaders: Record<string, string> = {}) => {
  const guestId = getGuestId()
  return {
    "Content-Type": "application/json",
    "x-guest-id": guestId,
    ...additionalHeaders,
  }
}

export const apiClient = {
  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${env.backendUrl}${endpoint}`, {
        method: "GET",
        headers: buildHeaders(),
      })
      const payload = await response.json()
      return normalizeApiResponse<T>(payload)
    } catch (error) {
      console.error("API GET Error:", error)
      return {
        ok: false,
        error: "Lỗi kết nối. Vui lòng thử lại.",
      }
    }
  },

  async post<T>(endpoint: string, body?: Record<string, any>): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${env.backendUrl}${endpoint}`, {
        method: "POST",
        headers: buildHeaders(),
        body: body ? JSON.stringify(body) : undefined,
      })
      const payload = await response.json()
      return normalizeApiResponse<T>(payload)
    } catch (error) {
      console.error("API POST Error:", error)
      return {
        ok: false,
        error: "Lỗi kết nối. Vui lòng thử lại.",
      }
    }
  },

  streamSSE<T>(endpoint: string, onMessage: (event: T) => void, onError?: () => void): EventSource | null {
    if (typeof window === "undefined") return null

    try {
      const guestId = getGuestId()
      const eventSource = new EventSource(`${env.backendUrl}${endpoint}?x-guest-id=${guestId}`)

      eventSource.addEventListener("room_updated", (event) => {
        const data = JSON.parse(event.data)
        onMessage(data)
      })

      eventSource.addEventListener("participants_updated", (event) => {
        const data = JSON.parse(event.data)
        onMessage(data)
      })

      eventSource.onerror = () => {
        eventSource.close()
        onError?.()
      }

      return eventSource
    } catch (error) {
      console.error("SSE Error:", error)
      onError?.()
      return null
    }
  },
}
