import { NextResponse } from "next/server";
import { generateNonce } from "siwe";
import { getSession } from "@/lib/web3/session";

/**
 * GET /api/auth/nonce
 * Tạo nonce ngẫu nhiên, lưu vào session, trả về cho client để client
 * đưa vào message SIWE trước khi yêu cầu người dùng ký.
 */
export async function GET() {
  const session = await getSession();
  const nonce = generateNonce();
  session.nonce = nonce;
  await session.save();

  return NextResponse.json({ nonce });
}
