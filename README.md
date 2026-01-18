# Relax Room - Frontend

Ứng dụng web Next.js 14+ cho Relax Room - nơi tạo không gian chill, thư giãn cùng bạn bè.

## 🚀 Công nghệ sử dụng

- **Next.js 14+** (App Router)
- **TypeScript**
- **TailwindCSS**
- **shadcn/ui**
- **Zod** (validation)
- **React Hooks** (state management)

## 📁 Cấu trúc thư mục

```
src/
├── app/                      # Pages & layouts
│   ├── page.tsx             # Trang chủ
│   ├── moods/page.tsx       # Chọn mood
│   ├── create/page.tsx      # Tạo phòng
│   └── room/[roomId]/page.tsx  # Chi tiết phòng
├── components/              # React components
│   ├── navbar.tsx
│   ├── footer.tsx
│   ├── mood-card.tsx
│   ├── audio-player.tsx
│   └── ...
├── domain/                  # Type definitions
│   ├── mood.ts
│   └── room.ts
├── services/               # API services
│   ├── moodsService.ts
│   └── roomsService.ts
├── hooks/                  # Custom React hooks
│   ├── useGuestId.ts
│   ├── useMoods.ts
│   └── useRoom.ts
└── lib/                    # Utilities
    ├── env.ts
    ├── apiClient.ts
    └── utils.ts
```

## 🔧 Cài đặt

### 1. Clone & cài đặt dependencies

```bash
git clone <repo-url>
cd relax-room-frontend
npm install
# hoặc
pnpm install
```

### 2. Cấu hình environment

Tạo file `.env.local` từ `.env.example`:

```bash
cp .env.example .env.local
```

Sau đó chỉnh sửa `.env.local`:

```env
NEXT_PUBLIC_BACKEND_URL=http://localhost:4000
```

**Lưu ý:** 
- Đảm bảo backend đang chạy tại `http://localhost:4000`
- Hoặc thay đổi URL phù hợp với địa chỉ backend của bạn

### 3. Chạy development server

```bash
npm run dev
# hoặc
pnpm dev
```

Mở [http://localhost:3000](http://localhost:3000) trong trình duyệt.

## 📋 Các tính năng chính

### Trang chủ (/)
- Hero section với CTA "Chọn mood"
- Hiển thị 3 lợi ích chính

### Chọn mood (/moods)
- Danh sách tất cả moods dưới dạng grid
- Tìm kiếm mood theo tên/tags
- Preview âm thanh "Nghe thử"
- Button "Tạo phòng" cho mỗi mood

### Tạo phòng (/create?moodId=...)
- Hiển thị mood được chọn
- Chọn thời gian (5/10/25 phút)
- Button "Tạo phòng" gọi API

### Chi tiết phòng (/room/[roomId])

#### Trạng thái Lobby (LOBBY)
- Chia sẻ link phòng (copy clipboard)
- Danh sách người tham gia
- Button "Bắt đầu" (chỉ host)

#### Trạng thái Chạy (RUNNING)
- Countdown timer (mm:ss)
- Audio player (play/pause, volume)
- Danh sách người đang chill

#### Trạng thái Kết thúc (ENDED)
- Đánh giá phòng (Tốt hơn / Bình thường / Tệ hơn)
- Suggest 3 mood khác
- Button "Tạo phòng mới"

## 🔌 API Integration

### Guest ID
- Tự động tạo UUID khi user vào lần đầu
- Lưu trong `localStorage` với key `guest-id`
- Gửi qua header `x-guest-id` ở mỗi request

### Realtime Updates
- **Ưu tiên:** Server-Sent Events (SSE) tới `/api/rooms/:roomId/stream`
- **Fallback:** Polling mỗi 3 giây nếu SSE fail
- Events: `room_updated`, `participants_updated`

### API Endpoints
```
GET  /api/moods
GET  /api/moods/:id
POST /api/rooms
GET  /api/rooms/:roomId
POST /api/rooms/:roomId/join
POST /api/rooms/:roomId/start
POST /api/rooms/:roomId/end
POST /api/rooms/:roomId/rating
GET  /api/rooms/:roomId/stream (SSE)
```

## 🎨 Design

- **Vibe:** Chill/Relax - spacing thoáng, typography rõ, card mềm mại
- **Colors:** Cyan primary (#06b6d4), purple secondary (#8b5cf6), pink accent (#ec4899)
- **Responsive:** Mobile-first, 1 cột → 2 cột → 3-4 cột grid
- **Accessibility:** Focus ring rõ, keyboard navigation

## 📱 Responsive Breakpoints

- **Mobile:** 1 cột moods, button to dễ bấm
- **Tablet (md):** 2 cột moods
- **Desktop (lg):** 3-4 cột moods; room page layout 2 cột

## 🚀 Deployment

### Vercel (Recommended)

```bash
vercel
```

### Docker

```bash
docker build -t relax-room-frontend .
docker run -p 3000:3000 relax-room-frontend
```

## 🐛 Troubleshooting

### "NEXT_PUBLIC_BACKEND_URL is not set"
- Kiểm tra file `.env.local`
- Đảm bảo biến được set đúng

### "SSE connection failed"
- Frontend sẽ fallback sang polling
- Kiểm tra backend có enable CORS

### Audio không phát
- Trình duyệt có chặn autoplay không? 
- Click vào button "Phát nhạc" để kích hoạt
- Kiểm tra volume & browser permissions

## 📖 Tài liệu thêm

- [Next.js Docs](https://nextjs.org)
- [TailwindCSS Docs](https://tailwindcss.com)
- [shadcn/ui](https://ui.shadcn.com)
- [TypeScript](https://www.typescriptlang.org)

## 📝 License

MIT
