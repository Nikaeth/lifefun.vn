import { NextResponse } from "next/server";
import { getSession } from "@/lib/web3/session";

/**
 * GET /api/auth/session
 * Trả về trạng thái đăng nhập hiện tại (đọc từ cookie session).
 */
export async function GET() {
  const session = await getSession();

  if (!session.isLoggedIn || !session.address) {
    return NextResponse.json({ isLoggedIn: false });
  }

  return NextResponse.json({
    isLoggedIn: true,
    address: session.address,
    chain: session.chain,
    chainId: session.chainId,
  });
}
