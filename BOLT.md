# Chạy thử trên Bolt.new

## Cách import

1. Vào https://bolt.new
2. Chọn **"Import folder"** hoặc kéo thả file `lifefun-vn-nextjs.zip` (giải nén trước) vào khung chat
3. Bolt sẽ tự nhận diện đây là project Next.js và chạy `npm install` + `npm run dev`

## ⚠️ Lưu ý quan trọng khi chạy trên Bolt (WebContainer)

Bolt chạy Node trong browser (WebContainer) — có một số khác biệt so với máy thật:

### 1. Cài đặt có thể chậm
Project có nhiều dependency Web3 (`wagmi`, `@rainbow-me/rainbowkit`, `@solana/web3.js`...).
Lần `npm install` đầu tiên có thể mất 1-2 phút.

### 2. Biến môi trường (.env.local)
Bolt không tự đọc `.env.local.example`. Sau khi import:
1. Tạo file `.env.local` mới (copy từ `.env.local.example`)
2. Điền tối thiểu để app không lỗi khi load:
   ```env
   SESSION_SECRET=bolt-demo-secret-change-me-1234567890abcdef
   NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=
   ```
   Không có `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` thì nút Connect Wallet vẫn hiển thị nhưng
   WalletConnect QR sẽ không hoạt động (MetaMask injected vẫn OK nếu trình duyệt có extension —
   nhưng Bolt preview là iframe nên extension thường KHÔNG truy cập được).

### 3. Các tính năng có thể KHÔNG hoạt động đầy đủ trong Bolt preview
- **Connect Wallet (MetaMask)**: preview chạy trong iframe sandbox, extension ví thường bị chặn.
  → Mở preview ở **tab riêng** (nút "Open in new tab") để MetaMask hoạt động.
- **TradingView widgets**: cần load script từ `s3.tradingview.com` — phụ thuộc Bolt có cho phép
  outbound request tới domain này không (thường OK vì chỉ là script tag, không phải fetch).
- **RSS news (`/api/news`)**: server-side fetch tới CafeF/CoinDesk — WebContainer cho phép fetch
  ra ngoài, nên thường hoạt động được.
- **CoinGecko prices (`/api/prices`)**: tương tự, nên hoạt động.

### 4. Nếu gặp lỗi install
Nếu `npm install` lỗi do một package Solana nào đó (hiếm gặp nhưng có thể xảy ra với
WebContainer + native deps), thử:
```bash
npm install --legacy-peer-deps
```

### 5. Khởi động
```bash
npm run dev
```
Bolt sẽ tự mở preview tại port 3000.

## Trang để test nhanh

| Trang | Kiểm tra gì |
|---|---|
| `/` | Giá crypto realtime, tin tức, dark mode toggle |
| `/tin-tuc` | RSS tin tức tự động cập nhật |
| `/portfolio` | Connect Wallet (mở tab riêng để MetaMask hoạt động) |
| `/rewards` | LifeFun Points (cần đăng nhập SIWE trước) |
| `/membership` | NFT-gating demo (sẽ hiện "chưa cấu hình" nếu chưa set `MEMBERSHIP_NFT_CONTRACT`) |
