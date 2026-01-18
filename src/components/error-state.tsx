"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface ErrorStateProps {
  message: string
  onRetry?: () => void
}

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <Card className="border-destructive/50 bg-destructive/10">
      <div className="flex items-center justify-between p-6">
        <div>
          <p className="font-semibold text-destructive mb-1">Có lỗi xảy ra</p>
          <p className="text-sm text-muted-foreground">{message}</p>
        </div>
        {onRetry && (
          <Button onClick={onRetry} variant="outline" size="sm">
            Thử lại
          </Button>
        )}
      </div>
    </Card>
  )
}
