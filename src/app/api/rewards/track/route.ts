import { NextResponse } from "next/server";
import { getSession } from "@/lib/web3/session";
import { addRewardEvent, getUserRewards, POINT_RULES, type RewardEventType } from "@/lib/rewards/store";

const TRACKABLE: RewardEventType[] = ["read_news", "connect_wallet", "referral"];

// Giới hạn đơn giản để chống spam: tối đa N lần/loại/ngày
const DAILY_LIMIT: Partial<Record<RewardEventType, number>> = {
  read_news: 5,
};

/**
 * POST /api/rewards/track
 * Body: { type: "read_news" | "connect_wallet" | "referral", meta?: object }
 * Ghi nhận hành động và cộng điểm tương ứng (off-chain).
 */
export async function POST(request: Request) {
  const session = await getSession();

  if (!session.isLoggedIn || !session.address) {
    return NextResponse.json({ ok: false, error: "Chưa đăng nhập" }, { status: 401 });
  }

  const { type, meta } = await request.json();

  if (!TRACKABLE.includes(type)) {
    return NextResponse.json({ ok: false, error: "Loại hành động không hợp lệ" }, { status: 400 });
  }

  const rewards = getUserRewards(session.address);

  const limit = DAILY_LIMIT[type as RewardEventType];
  if (limit) {
    const today = new Date().toISOString().slice(0, 10);
    const countToday = rewards.events.filter(e => e.type === type && e.timestamp.startsWith(today)).length;
    if (countToday >= limit) {
      return NextResponse.json({ ok: false, error: "Đã đạt giới hạn điểm cho hành động này hôm nay" }, { status: 429 });
    }
  }

  const points = POINT_RULES[type as RewardEventType] || 0;
  const updated = addRewardEvent(session.address, type as RewardEventType, points, meta);

  return NextResponse.json({ ok: true, pointsEarned: points, totalPoints: updated.totalPoints });
}
