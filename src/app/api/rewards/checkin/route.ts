import { NextResponse } from "next/server";
import { getSession } from "@/lib/web3/session";
import { addRewardEvent, getUserRewards, POINT_RULES, todayStr } from "@/lib/rewards/store";

/**
 * POST /api/rewards/checkin
 * Daily check-in: cộng điểm 1 lần/ngày cho người dùng đã đăng nhập SIWE.
 */
export async function POST() {
  const session = await getSession();

  if (!session.isLoggedIn || !session.address) {
    return NextResponse.json({ ok: false, error: "Vui lòng đăng nhập bằng ví trước." }, { status: 401 });
  }

  const rewards = getUserRewards(session.address);
  const today = todayStr();

  if (rewards.lastDailyClaim === today) {
    return NextResponse.json({ ok: false, error: "Bạn đã check-in hôm nay rồi. Quay lại vào ngày mai!" }, { status: 409 });
  }

  const points = POINT_RULES.daily_login;
  const updated = addRewardEvent(session.address, "daily_login", points);
  updated.lastDailyClaim = today;

  return NextResponse.json({ ok: true, pointsEarned: points, totalPoints: updated.totalPoints });
}
