import { NextResponse } from "next/server";
import { getSession } from "@/lib/web3/session";

/**
 * POST /api/auth/logout
 * Xoá session đăng nhập.
 */
export async function POST() {
  const session = await getSession();
  session.destroy();
  return NextResponse.json({ ok: true });
}
