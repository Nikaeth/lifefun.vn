import { NextResponse } from "next/server";
import { getSession } from "@/lib/web3/session";
import { addRewardEvent, getUserRewards, REDEEM_TIERS } from "@/lib/rewards/store";

/**
 * POST /api/rewards/redeem
 * Body: { tierId: string }
 * Đổi điểm thưởng lấy huy hiệu/đặc quyền (off-chain, không phải giao dịch crypto).
 */
export async function POST(request: Request) {
  const session = await getSession();

  if (!session.isLoggedIn || !session.address) {
    return NextResponse.json({ ok: false, error: "Vui lòng đăng nhập bằng ví trước." }, { status: 401 });
  }

  const { tierId } = await request.json();
  const tier = REDEEM_TIERS.find(t => t.id === tierId);

  if (!tier) {
    return NextResponse.json({ ok: false, error: "Phần thưởng không hợp lệ" }, { status: 400 });
  }

  const rewards = getUserRewards(session.address);

  if (rewards.totalPoints < tier.cost) {
    return NextResponse.json(
      { ok: false, error: `Bạn cần ${tier.cost} điểm, hiện có ${rewards.totalPoints} điểm.` },
      { status: 400 }
    );
  }

  const updated = addRewardEvent(session.address, "redeem", -tier.cost, { tierId: tier.id, tierLabel: tier.label });

  return NextResponse.json({ ok: true, redeemed: tier.label, totalPoints: updated.totalPoints });
}
