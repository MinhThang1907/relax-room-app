"use client"

import type { RoomStatus } from "@/domain/room"
import { Badge } from "@/components/ui/badge"

interface RoomStatusBadgeProps {
  status: RoomStatus
}

const statusConfig: Record<RoomStatus, { label: string; variant: any }> = {
  LOBBY: { label: "Sảnh", variant: "secondary" },
  RUNNING: { label: "Đang chạy", variant: "default" },
  ENDED: { label: "Kết thúc", variant: "outline" },
}

export function RoomStatusBadge({ status }: RoomStatusBadgeProps) {
  const config = statusConfig[status]
  return <Badge variant={config.variant}>{config.label}</Badge>
}
