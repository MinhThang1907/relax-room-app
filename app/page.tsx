"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function Home() {
  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="text-center space-y-6 py-12">
        <h1 className="text-5xl md:text-6xl font-bold text-balance">Relax Room</h1>
        <p className="text-xl md:text-2xl text-muted-foreground text-balance">Chill 10 phút cùng bạn bè</p>
        <div className="pt-4">
          <Link href="/moods">
            <Button size="lg" className="text-lg h-12 px-8">
              Chọn mood
            </Button>
          </Link>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 border border-slate-200 rounded-lg hover:shadow-md transition-shadow">
          <div className="text-3xl mb-3">✨</div>
          <h3 className="font-semibold text-foreground mb-2">Tạo phòng chill trong 1 chạm</h3>
          <p className="text-sm text-muted-foreground">Chọn mood yêu thích, đặt thời gian, xong!</p>
        </div>

        <div className="p-6 border border-slate-200 rounded-lg hover:shadow-md transition-shadow">
          <div className="text-3xl mb-3">⏱️</div>
          <h3 className="font-semibold text-foreground mb-2">Hẹn giờ 5/10/25 phút</h3>
          <p className="text-sm text-muted-foreground">Linh hoạt chọn thời gian phù hợp với bạn</p>
        </div>

        <div className="p-6 border border-slate-200 rounded-lg hover:shadow-md transition-shadow">
          <div className="text-3xl mb-3">👥</div>
          <h3 className="font-semibold text-foreground mb-2">Chia sẻ link — bạn bè vào xem cùng</h3>
          <p className="text-sm text-muted-foreground">Mời bạn bè tham gia phòng chill của bạn</p>
        </div>
      </section>
    </div>
  )
}
