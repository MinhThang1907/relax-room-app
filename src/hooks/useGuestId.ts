"use client"

import { useEffect, useState } from "react"

export const useGuestId = (): string | null => {
  const [guestId, setGuestId] = useState<string | null>(null)

  useEffect(() => {
    let id = localStorage.getItem("guest-id")
    if (!id) {
      id = generateUUID()
      localStorage.setItem("guest-id", id)
    }
    setGuestId(id)
  }, [])

  return guestId
}

const generateUUID = (): string => {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0
    const v = c === "x" ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}
