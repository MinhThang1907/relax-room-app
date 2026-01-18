"use client"

export function Footer() {
  return (
    <footer className="bg-slate-50 border-t border-slate-200 mt-12">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="font-semibold text-foreground mb-3">Relax Room</h3>
            <p className="text-sm text-muted-foreground">Tạo không gian chill, thư giãn cùng bạn bè.</p>
          </div>
          <div>
            <h4 className="font-semibold text-foreground mb-3">Chính sách</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="#" className="hover:text-foreground">
                  Điều khoản sử dụng
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground">
                  Chính sách bảo mật
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-foreground mb-3">Liên hệ</h4>
            <p className="text-sm text-muted-foreground">support@relaxroom.com</p>
          </div>
        </div>
        <div className="border-t border-slate-200 pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; 2026 Relax Room. Tất cả quyền được bảo vệ.</p>
        </div>
      </div>
    </footer>
  )
}
