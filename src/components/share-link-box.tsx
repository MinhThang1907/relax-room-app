"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface ShareLinkBoxProps {
  roomId: string
}

export function ShareLinkBox({ roomId }: ShareLinkBoxProps) {
  const [copied, setCopied] = useState(false)

  const roomUrl = typeof window !== "undefined" ? `${window.location.origin}/room/${roomId}` : `${roomId}`

  const handleCopy = () => {
    navigator.clipboard.writeText(roomUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Card className="bg-slate-50">
      <CardContent className="pt-6">
        <p className="text-sm font-medium text-muted-foreground mb-3">Chia sẻ link với bạn bè</p>
        <div className="flex gap-2">
          <Input value={roomUrl} readOnly className="text-sm" />
          <Button onClick={handleCopy} size="sm" className="shrink-0">
            {copied ? "✓ Đã sao chép" : "Sao chép"}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
