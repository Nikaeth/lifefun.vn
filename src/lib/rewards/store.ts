/**
 * Lưu trữ điểm thưởng (LifeFun Points) — HỆ THỐNG OFF-CHAIN, KHÔNG PHẢI TOKEN/CRYPTO.
 *
 * Đây là điểm loyalty nội bộ, không có giá trị quy đổi tiền tệ, không giao dịch
 * được trên blockchain. Mục đích: gamification, mở khoá đặc quyền nội dung.
 *
 * ⚠️ PRODUCTION: thay thế Map in-memory này bằng database thật (Postgres/Supabase/
 * PlanetScale/Redis...). Dữ liệu hiện tại MẤT khi server restart — chỉ dùng để demo.
 *
 * Khoá lưu trữ: địa chỉ ví đã xác thực qua SIWE (session.address), lowercase.
 */

export interface RewardEvent {
  type: RewardEventType;
  points: number;
  timestamp: string;
  meta?: Record<string, string>;
}

export type RewardEventType =
  | "daily_login"
  | "read_news"
  | "connect_wallet"
  | "referral"
  | "redeem";

export interface UserRewards {
  address: string;
  totalPoints: number;
  events: RewardEvent[];
  lastDailyClaim?: string; // ISO date (yyyy-mm-dd) của lần daily check-in gần nhất
}

// Điểm cho mỗi loại hành động
export const POINT_RULES: Record<RewardEventType, number> = {
  daily_login: 10,
  read_news: 2,
  connect_wallet: 20,
  referral: 50,
  redeem: 0, // số điểm trừ được tính riêng khi redeem
};

export const REDEEM_TIERS = [
  { id: "badge_bronze", label: "Huy hiệu Đồng", cost: 100, description: "Hiển thị huy hiệu Đồng trên hồ sơ" },
  { id: "badge_silver", label: "Huy hiệu Bạc",  cost: 300, description: "Hiển thị huy hiệu Bạc + ưu tiên hỗ trợ" },
  { id: "badge_gold",   label: "Huy hiệu Vàng", cost: 800, description: "Hiển thị huy hiệu Vàng + báo cáo phân tích độc quyền hàng tuần" },
] as const;

// In-memory store (demo only)
const userStore = new Map<string, UserRewards>();

export function getUserRewards(address: string): UserRewards {
  const key = address.toLowerCase();
  let rec = userStore.get(key);
  if (!rec) {
    rec = { address: key, totalPoints: 0, events: [] };
    userStore.set(key, rec);
  }
  return rec;
}

export function addRewardEvent(address: string, type: RewardEventType, points: number, meta?: Record<string, string>): UserRewards {
  const rec = getUserRewards(address);
  rec.totalPoints += points;
  rec.events.unshift({ type, points, timestamp: new Date().toISOString(), meta });
  rec.events = rec.events.slice(0, 50); // giữ 50 sự kiện gần nhất
  userStore.set(rec.address, rec);
  return rec;
}

export function todayStr(): string {
  return new Date().toISOString().slice(0, 10); // yyyy-mm-dd
}
