import { NextResponse } from "next/server";
import { getSession } from "@/lib/web3/session";
import { getUserRewards, REDEEM_TIERS, todayStr } from "@/lib/rewards/store";

/**
 * GET /api/rewards
 * Trả về điểm thưởng + lịch sử hoạt động của người dùng đã đăng nhập (qua SIWE).
 * Yêu cầu session.isLoggedIn === true (đăng nhập bằng ví ở header).
 */
export async function GET() {
  const session = await getSession();

  if (!session.isLoggedIn || !session.address) {
    return NextResponse.json({ isLoggedIn: false, totalPoints: 0, events: [] });
  }

  const rewards = getUserRewards(session.address);
  const canCheckIn = rewards.lastDailyClaim !== todayStr();

  return NextResponse.json({
    isLoggedIn: true,
    address: rewards.address,
    totalPoints: rewards.totalPoints,
    events: rewards.events,
    canCheckIn,
    tiers: REDEEM_TIERS,
  });
}
