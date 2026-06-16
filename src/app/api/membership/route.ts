import { NextResponse } from "next/server";
import { createPublicClient, http, isAddress, parseAbi } from "viem";
import { mainnet } from "viem/chains";
import { getSession } from "@/lib/web3/session";

/**
 * GET /api/membership
 * Kiểm tra session hiện tại có sở hữu NFT/token thành viên không.
 *
 * CẤU HÌNH (.env.local):
 *   MEMBERSHIP_NFT_CONTRACT=0x...   (địa chỉ contract ERC-721/ERC-1155 trên Ethereum mainnet)
 *   MEMBERSHIP_MIN_BALANCE=1        (số lượng NFT tối thiểu để được coi là member)
 *
 * Nếu MEMBERSHIP_NFT_CONTRACT chưa được set, route trả về isMember: false
 * kèm hướng dẫn cấu hình — KHÔNG chặn truy cập (an toàn mặc định).
 *
 * Hỗ trợ ERC-721 (balanceOf) và ERC-1155 cần thêm tokenId — xem ghi chú dưới.
 */

const ERC721_ABI = parseAbi([
  "function balanceOf(address owner) view returns (uint256)",
]);

const evmClient = createPublicClient({
  chain: mainnet,
  transport: http(process.env.NEXT_PUBLIC_EVM_RPC_URL),
});

export async function GET() {
  const session = await getSession();

  if (!session.isLoggedIn || !session.address) {
    return NextResponse.json({ isMember: false, reason: "not_logged_in" });
  }

  const contractAddress = process.env.MEMBERSHIP_NFT_CONTRACT;
  const minBalance = BigInt(process.env.MEMBERSHIP_MIN_BALANCE || "1");

  if (!contractAddress || !isAddress(contractAddress)) {
    return NextResponse.json({
      isMember: false,
      reason: "not_configured",
      note: "Chưa cấu hình MEMBERSHIP_NFT_CONTRACT trong .env.local. Xem README phần Token-gating.",
    });
  }

  if (session.chain !== "evm" || !isAddress(session.address)) {
    return NextResponse.json({
      isMember: false,
      reason: "unsupported_chain",
      note: "Token-gating hiện chỉ hỗ trợ địa chỉ EVM (ERC-721/ERC-1155).",
    });
  }

  try {
    const balance = await evmClient.readContract({
      address: contractAddress as `0x${string}`,
      abi: ERC721_ABI,
      functionName: "balanceOf",
      args: [session.address as `0x${string}`],
    });

    const isMember = balance >= minBalance;

    return NextResponse.json({
      isMember,
      balance: balance.toString(),
      minBalance: minBalance.toString(),
      contract: contractAddress,
    });
  } catch (err) {
    console.error("[/api/membership] error:", err);
    return NextResponse.json(
      { isMember: false, reason: "contract_read_error", detail: String(err) },
      { status: 502 }
    );
  }
}
