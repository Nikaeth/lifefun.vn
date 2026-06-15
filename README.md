# LifeFun.vn – Tài chính · Chứng khoán · Crypto

Trang web tin tức tài chính xây dựng bằng **Next.js 14 App Router + TypeScript + Tailwind CSS**.

## Cài đặt & Chạy

```bash
# 1. Cài dependencies
npm install

# 2. Chạy môi trường dev
npm run dev
# → Mở http://localhost:3000

# 3. Build production
npm run build
npm start
```

## Cấu trúc dự án

```
src/
├── app/                        # Next.js App Router
│   ├── layout.tsx              # Root layout (TickerBar + Header + Footer)
│   ├── page.tsx                # Trang chủ
│   ├── globals.css             # Tailwind + animations
│   ├── chung-khoan/page.tsx    # Route chứng khoán
│   ├── crypto/page.tsx         # Route crypto
│   └── tin-tuc/page.tsx        # Route tin tức
│
├── components/
│   ├── layout/
│   │   ├── TickerBar.tsx       # Dải giá chạy realtime
│   │   ├── Header.tsx          # Thanh điều hướng sticky
│   │   └── Footer.tsx          # Footer đa cột
│   ├── market/
│   │   ├── LiveBadge.tsx       # Badge "Live" nhấp nháy
│   │   ├── StatRow.tsx         # 5 thẻ thống kê thị trường
│   │   ├── CryptoTable.tsx     # Bảng giá crypto (cập nhật mỗi 2.5s)
│   │   └── TradingViewChart.tsx # Biểu đồ TradingView chuyển đổi symbol
│   ├── news/
│   │   └── NewsGrid.tsx        # Lưới 6 tin tức theo danh mục
│   └── widgets/
│       ├── XFeed.tsx           # Feed X/Twitter + fallback
│       ├── TVTickerTape.tsx    # Dải ticker TradingView
│       ├── TVScreener.tsx      # Bảng lọc crypto TradingView
│       └── TVHeatmap.tsx       # Heatmap crypto TradingView
│
├── lib/
│   ├── data.ts                 # Mock data (tickers, news, crypto...)
│   └── utils.ts                # Helper functions
│
└── types/
    └── index.ts                # TypeScript interfaces
```

## Tích hợp

### TradingView
- **Ticker Tape** – dải giá tự động cuộn
- **Advanced Chart** – biểu đồ nến có thể chuyển symbol (BTC, ETH, S&P500, VNM)
- **Crypto Screener** – bảng lọc toàn thị trường
- **Crypto Heatmap** – bản đồ nhiệt theo vốn hóa

### X (Twitter)
- Embed timeline tìm kiếm `#crypto OR #chungkhoan`
- Tự động fallback sang feed nội bộ nếu X widget bị chặn

## Deploy lên lifefun.vn

### Vercel (khuyến nghị)
```bash
npx vercel --prod
# Thêm domain lifefun.vn trong Vercel Dashboard → Domains
```

### VPS tự quản lý
```bash
npm run build
# Dùng PM2 hoặc nginx + node
pm2 start npm --name lifefun-vn -- start
```

## Biến môi trường (.env.local)
```env
NEXT_PUBLIC_SITE_URL=https://lifefun.vn
# Nếu dùng API thực từ TradingView hoặc X:
# TRADINGVIEW_API_KEY=...
# X_BEARER_TOKEN=...
```

## Công nghệ sử dụng
- **Next.js 14** (App Router, Server Components, Metadata API)
- **TypeScript** – type-safe toàn bộ
- **Tailwind CSS** – utility-first, responsive
- **TradingView Embed Widgets** – charts & data
- **X Widgets + X API v2** – social feed
- **fast-xml-parser** – parse RSS feeds
- **lucide-react** – icons
- **SWR** – data fetching tự động refresh

---

## 🔄 Tự động cập nhật dữ liệu (Realtime / theo lịch)

Website đã tích hợp 3 API routes tự refresh, không cần cron job thủ công vì Next.js ISR + SWR đảm nhiệm:

| Dữ liệu | API Route | Nguồn | Tần suất refresh | Cần API key? |
|---|---|---|---|---|
| Giá Crypto (BTC, ETH, SOL...) | `/api/prices` | CoinGecko Public API | 30 giây | Không |
| Tin tức tài chính | `/api/news` | RSS: CafeF, Vietstock, CoinDesk, Cointelegraph, Investing.com | 2 phút | Không |
| Feed X (Twitter) | `/api/x-feed` | X API v2 Recent Search (fallback: embed widget) | 2 phút | Có (tùy chọn) |
| Chart, Ticker Tape, Heatmap, Screener | TradingView embed | TradingView | Realtime (do TradingView quản lý) | Không |

### Cách hoạt động
1. **`usePrices()`, `useNews()`, `useXFeed()`** – các React hooks dùng SWR, tự động gọi lại API theo `refreshInterval` đã định nghĩa, không cần reload trang.
2. **ISR (`revalidate`)** trong mỗi route — Next.js cache kết quả ở server, tránh gọi nguồn ngoài quá nhiều lần (đặc biệt quan trọng vì CoinGecko free tier giới hạn ~10-30 request/phút).
3. **Mock fallback** — nếu API lỗi hoặc chưa cấu hình (đặc biệt `X_BEARER_TOKEN`), component tự chuyển sang dữ liệu mẫu trong `lib/data.ts` để trang không bị vỡ layout.

> **Lưu ý về tần suất 2 phút**: với ISR `revalidate = 120`, Next.js chỉ gọi lại các RSS feed nguồn
> (CafeF, CoinDesk...) **tối đa 1 lần/2 phút trên toàn server**, dù có bao nhiêu người dùng truy cập —
> SWR ở client chỉ refetch từ cache server, không gọi trực tiếp RSS. Nếu cần tần suất nhanh hơn nữa
> (ví dụ 30 giây), nên thêm cơ chế chống dội (debounce) hoặc chuyển sang job nền (cron) ghi vào DB/cache
> riêng để tránh bị các nguồn RSS chặn do truy cập quá thường xuyên.

### Thêm / xóa nguồn tin tức RSS
Sửa file `src/lib/rss.ts`:
```ts
export const RSS_SOURCES: RssSource[] = [
  { name: "CafeF - Chứng khoán", url: "https://cafef.vn/thi-truong-chung-khoan.rss", cat: "stock", enabled: true },
  // Thêm nguồn mới ở đây...
];
```

### Bật X API thật (thay mock data)
1. Đăng ký Developer account tại https://developer.x.com
2. Lấy **Bearer Token** (cần tier Basic trở lên cho Recent Search)
3. Thêm vào `.env.local`:
   ```env
   X_BEARER_TOKEN=your_token_here
   ```
4. Restart server — `/api/x-feed` sẽ tự chuyển từ mock sang dữ liệu thật.

### Mở rộng: thêm nguồn giá VN-INDEX / chứng khoán Việt Nam
`/api/prices` hiện chỉ hỗ trợ crypto qua CoinGecko (miễn phí). Để có VN-INDEX, VCB, HPG... realtime, cần một trong:
- **vnstock** (Python lib, cần server riêng chạy song song)
- **SSI FastConnect API** / **Vietstock API** (cần đăng ký, có phí)
- **TradingView widget** (đã có sẵn — đủ cho hiển thị, không cần thêm code)

### Deploy & cron (nếu muốn chủ động thay vì ISR)
Nếu muốn pre-fetch dữ liệu vào database mỗi ngày (ví dụ lưu lịch sử giá), dùng **Vercel Cron**:
```ts
// vercel.json
{
  "crons": [
    { "path": "/api/news", "schedule": "0 */1 * * *" }
  ]
}
```


---

## 🔗 Tích hợp Web3 (Kết nối ví, SIWE, Portfolio, Swap, NFT)

### Tổng quan tính năng

| Tính năng | Trang/Route | Trạng thái |
|---|---|---|
| Connect Wallet (EVM + Solana) | Header (mọi trang) | ✅ Hoạt động ngay (cần `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` cho WalletConnect QR) |
| Sign-In with Ethereum (SIWE) | Header dropdown | ✅ Hoạt động ngay (cần `SESSION_SECRET`) |
| Portfolio (số dư native) | `/portfolio` | ✅ Hoạt động ngay qua RPC công khai |
| Portfolio (token ERC-20/SPL đầy đủ) | `/portfolio` | 🟡 Placeholder — cần Alchemy/Covalent/Moralis/Helius |
| Swap quote | `/portfolio` (widget) | 🟡 Solana qua Jupiter (free); EVM qua 1inch (cần API key) |
| Swap thực thi giao dịch | — | ⚪ Chưa triển khai — chỉ hiển thị quote |
| Membership / NFT-gating | `/membership` | 🟡 Placeholder — cần `MEMBERSHIP_NFT_CONTRACT` |

### Cài đặt nhanh để chạy được Connect Wallet + SIWE

```bash
# 1. Tạo WalletConnect Project ID (miễn phí)
#    -> https://cloud.walletconnect.com -> Create Project -> copy Project ID

# 2. Tạo session secret
openssl rand -base64 32

# 3. Thêm vào .env.local
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=<project_id>
SESSION_SECRET=<chuỗi vừa tạo>
```

Sau bước này: nút **"Kết nối ví"** trên header hoạt động đầy đủ với MetaMask, WalletConnect (mobile QR),
Coinbase Wallet, Phantom, Solflare. Nút **"Đăng nhập bằng ví (SIWE)"** xác thực chữ ký EIP-4361 và tạo
session cookie (`lifefun_session`, mã hoá bằng iron-session).

### Kiến trúc SIWE flow

```
Client                          Server
  │  GET /api/auth/nonce          │
  ├──────────────────────────────>│  tạo nonce, lưu vào session
  │<─────────────────────────────┤  trả về { nonce }
  │                                │
  │  user ký SIWE message          │
  │  (wallet popup)                │
  │                                │
  │  POST /api/auth/verify         │
  │  { message, signature }        │
  ├──────────────────────────────>│  SiweMessage.verify()
  │                                │  -> session.isLoggedIn = true
  │<─────────────────────────────┤  { ok: true, address }
```

### Portfolio API — mở rộng để có đầy đủ token

`/api/portfolio` hiện chỉ trả về số dư native (ETH/SOL) qua RPC công khai. Để hiển thị đầy đủ
danh sách token ERC-20/SPL kèm giá trị USD:

**EVM (chọn 1):**
- **Alchemy Token API** — `alchemy_getTokenBalances` + `alchemy_getTokenMetadata`
- **Covalent** — endpoint `GET /v1/{chain}/address/{address}/balances_v2/`
- **Moralis** — endpoint `GET /wallets/{address}/tokens`

**Solana:**
- `connection.getParsedTokenAccountsByOwner(pubkey, { programId: TOKEN_PROGRAM_ID })` — lấy số dư SPL token
- **Helius DAS API** — để có metadata token + giá trị USD đầy đủ

Sau khi có API key, implement logic trong `src/app/api/portfolio/route.ts` tại các vị trí đã đánh dấu `PLACEHOLDER`.

### Swap — Jupiter (Solana) & 1inch (EVM)

- **Solana**: `/api/swap?chain=solana&from=<mint>&to=<mint>&amount=<raw>` gọi Jupiter v6 Quote API,
  **miễn phí, không cần key**.
- **EVM**: cần `ONEINCH_API_KEY` từ https://portal.1inch.dev. Nếu chưa có, route trả về mock quote
  để UI vẫn hoạt động.

⚠️ **Quan trọng**: route `/api/swap` chỉ trả **quote** (giá tham khảo). Component `SwapWidget` hiện
**không** build/gửi transaction thật. Để thực thi swap thật:
1. EVM: dùng `wagmi useSendTransaction` với data từ 1inch `/swap` endpoint (không phải `/quote`)
2. Solana: dùng Jupiter `/swap` endpoint để lấy serialized transaction, sau đó
   `wallet.sendTransaction()` từ `@solana/wallet-adapter-react`

⚖️ **Lưu ý pháp lý**: tính năng swap tích hợp có thể yêu cầu giấy phép VASP (Virtual Asset Service
Provider) tùy khu vực pháp lý tại Việt Nam. Tham khảo ý kiến pháp lý trước khi triển khai production.

### Token-gating / Membership NFT

`/api/membership` đọc `balanceOf(address)` từ contract ERC-721 đã cấu hình qua `MEMBERSHIP_NFT_CONTRACT`,
so sánh với `MEMBERSHIP_MIN_BALANCE`. Trang `/membership` blur nội dung nếu `isMember = false`.

Mở rộng cho ERC-1155: thay ABI `balanceOf(address)` bằng `balanceOf(address, uint256 tokenId)` và
truyền thêm `MEMBERSHIP_TOKEN_ID` qua env.

Mở rộng đa chain: thêm logic chọn `publicClient` theo `session.chainId` thay vì hardcode `mainnet`.

### Bảo mật

- Session cookie `httpOnly`, `sameSite: lax`, mã hoá bằng `SESSION_SECRET` — không lưu private key
  hoặc seed phrase ở bất kỳ đâu trên server.
- Mọi chữ ký giao dịch diễn ra **client-side** trong wallet extension của người dùng.
- `/api/portfolio`, `/api/membership` chỉ đọc dữ liệu on-chain công khai — không yêu cầu quyền ghi.

---

## 🎁 Hệ thống điểm thưởng (LifeFun Points) — KHÔNG PHẢI TOKEN/CRYPTO

### Tại sao không phát hành token thật?

Phát hành "token thưởng" có thể quy đổi giá trị tiền tệ tại Việt Nam vướng các quy định về tiền ảo/tài sản
số chưa được pháp luật công nhận đầy đủ. **LifeFun Points** là giải pháp thay thế an toàn:
- Điểm tích lũy off-chain, không giao dịch, không chuyển nhượng, không quy đổi tiền
- Dùng để gamification: check-in, đọc tin, mở khoá huy hiệu
- Vẫn yêu cầu đăng nhập qua **SIWE** (tận dụng hạ tầng Web3 đã có) → tạo trải nghiệm "Web3-native"
  mà không phát hành tài sản số

### Route & Trang

| Route | Mục đích |
|---|---|
| `GET /api/rewards` | Lấy tổng điểm + lịch sử + trạng thái check-in |
| `POST /api/rewards/checkin` | Daily check-in (+10đ, 1 lần/ngày) |
| `POST /api/rewards/track` | Ghi nhận hành động (đọc tin +2đ, tối đa 5 lần/ngày) |
| `POST /api/rewards/redeem` | Đổi điểm lấy huy hiệu (Đồng/Bạc/Vàng) |
| `/rewards` | Trang tổng quan: điểm, check-in, đổi quà, lịch sử |
| Header → badge điểm | Dropdown nhanh: check-in + 3 hoạt động gần nhất |

### ⚠️ QUAN TRỌNG: thay in-memory store bằng database

`src/lib/rewards/store.ts` hiện dùng `Map` in-memory — **mất dữ liệu khi server restart**, chỉ
dùng để demo. Production cần:

```ts
// Ví dụ thay bằng Postgres (Prisma) hoặc Supabase
// Bảng: user_rewards (address PK, total_points, last_daily_claim)
// Bảng: reward_events (id, address FK, type, points, timestamp, meta JSON)
```

Thay các hàm `getUserRewards`, `addRewardEvent` bằng query database tương ứng — interface giữ nguyên
nên các API routes không cần sửa.

### Mở rộng trong tương lai (nếu pháp lý cho phép)

Nếu sau này có cơ sở pháp lý rõ ràng để phát hành token thật:
1. Deploy ERC-20/SPL token (ngoài phạm vi web app — cần Solidity/Anchor + audit)
2. Thay `redeem` bằng smart contract `claim()` — người dùng tự ký giao dịch nhận token vào ví
   (giống flow `SwapWidget`: server chỉ tạo signature/voucher, không tự ý chuyển token)
3. Tham khảo chuẩn **Merkle Distributor** (Uniswap) cho airdrop hàng loạt tiết kiệm gas
4. Bắt buộc tham khảo ý kiến pháp lý về VASP/tài sản số trước khi triển khai
