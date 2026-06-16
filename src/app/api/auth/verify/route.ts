import { NextResponse } from "next/server";
import { SiweMessage } from "siwe";
import { getSession } from "@/lib/web3/session";

/**
 * POST /api/auth/verify
 * Body: { message: string, signature: string }
 *
 * Xác thực chữ ký SIWE (Sign-In with Ethereum) theo EIP-4361.
 * Nếu hợp lệ + nonce khớp -> tạo session đăng nhập.
 */
export async function POST(request: Request) {
  try {
    const { message, signature } = await request.json();
    if (!message || !signature) {
      return NextResponse.json({ ok: false, error: "Thiếu message hoặc signature" }, { status: 400 });
    }

    const session = await getSession();
    const siweMessage = new SiweMessage(message);

    const result = await siweMessage.verify({
      signature,
      nonce: session.nonce,
    });

    if (!result.success) {
      return NextResponse.json({ ok: false, error: "Chữ ký không hợp lệ" }, { status: 401 });
    }

    session.address = siweMessage.address;
    session.chain = "evm";
    session.chainId = siweMessage.chainId;
    session.isLoggedIn = true;
    session.nonce = undefined;
    await session.save();

    return NextResponse.json({ ok: true, address: siweMessage.address, chainId: siweMessage.chainId });
  } catch (err) {
    console.error("[/api/auth/verify] error:", err);
    return NextResponse.json({ ok: false, error: "Xác thực thất bại" }, { status: 500 });
  }
}
