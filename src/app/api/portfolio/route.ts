import { NextResponse } from "next/server";
import { createPublicClient, http, formatEther, isAddress } from "viem";
import { mainnet } from "viem/chains";
import { Connection, PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { SOLANA_RPC_URL } from "@/lib/web3/solana";

/**
 * GET /api/portfolio?address=0x...&chain=evm|solana
 *
 * Trả về số dư native token + một số token phổ biến (nếu cấu hình).
 *
 * EVM: dùng public RPC viem (mainnet). Để có dữ liệu ERC-20/portfolio đầy đủ,
 *      nên dùng Alchemy/Covalent/Moralis Portfolio API (xem placeholder dưới).
 * Solana: dùng @solana/web3.js đọc balance SOL + SPL token accounts.
 */

export const revalidate = 30;

const evmClient = createPublicClient({
  chain: mainnet,
  transport: http(process.env.NEXT_PUBLIC_EVM_RPC_URL),
});

interface PortfolioToken {
  symbol: string;
  name: string;
  balance: string;
  decimals: number;
  usdValue?: number;
}

interface PortfolioResponse {
  address: string;
  chain: "evm" | "solana";
  nativeBalance: PortfolioToken;
  tokens: PortfolioToken[];
  source: string;
  note?: string;
}

async function getEvmPortfolio(address: `0x${string}`): Promise<PortfolioResponse> {
  const balanceWei = await evmClient.getBalance({ address });

  // === PLACEHOLDER: ERC-20 token balances ===
  // Để lấy đầy đủ danh sách token ERC-20 + giá trị USD, tích hợp một trong:
  //   - Alchemy Portfolio API: https://docs.alchemy.com/reference/getting-token-balances
  //   - Covalent API: https://www.covalenthq.com/docs/api/balances/get-token-balances-for-address/
  //   - Moralis Web3 API: https://docs.moralis.io/web3-data-api/evm/reference/wallet-api/get-wallet-token-balances
  // Set biến môi trường tương ứng (ALCHEMY_API_KEY, COVALENT_API_KEY...) và implement ở đây.
  const tokens: PortfolioToken[] = [];

  return {
    address,
    chain: "evm",
    nativeBalance: {
      symbol: "ETH",
      name: "Ethereum",
      balance: formatEther(balanceWei),
      decimals: 18,
    },
    tokens,
    source: "viem (public RPC)",
    note: tokens.length === 0
      ? "Chưa cấu hình API key cho danh sách token ERC-20 (Alchemy/Covalent/Moralis). Chỉ hiển thị số dư ETH native."
      : undefined,
  };
}

async function getSolanaPortfolio(address: string): Promise<PortfolioResponse> {
  const connection = new Connection(SOLANA_RPC_URL, "confirmed");
  const pubkey = new PublicKey(address);

  const lamports = await connection.getBalance(pubkey);

  // === PLACEHOLDER: SPL token accounts ===
  // const tokenAccounts = await connection.getParsedTokenAccountsByOwner(pubkey, {
  //   programId: TOKEN_PROGRAM_ID,
  // });
  // Map tokenAccounts -> PortfolioToken[] (cần thêm metadata token: Jupiter Token List, Helius DAS API...)
  const tokens: PortfolioToken[] = [];

  return {
    address,
    chain: "solana",
    nativeBalance: {
      symbol: "SOL",
      name: "Solana",
      balance: (lamports / LAMPORTS_PER_SOL).toString(),
      decimals: 9,
    },
    tokens,
    source: "@solana/web3.js (public RPC)",
    note: "Chưa lấy danh sách SPL token. Tích hợp Helius DAS API hoặc getParsedTokenAccountsByOwner để mở rộng.",
  };
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const address = searchParams.get("address");
  const chain = searchParams.get("chain") as "evm" | "solana" | null;

  if (!address || !chain) {
    return NextResponse.json({ error: "Thiếu address hoặc chain" }, { status: 400 });
  }

  try {
    if (chain === "evm") {
      if (!isAddress(address)) {
        return NextResponse.json({ error: "Địa chỉ EVM không hợp lệ" }, { status: 400 });
      }
      const data = await getEvmPortfolio(address as `0x${string}`);
      return NextResponse.json(data, { headers: { "Cache-Control": "private, s-maxage=30" } });
    }

    if (chain === "solana") {
      let pubkey: PublicKey;
      try {
        pubkey = new PublicKey(address);
      } catch {
        return NextResponse.json({ error: "Địa chỉ Solana không hợp lệ" }, { status: 400 });
      }
      const data = await getSolanaPortfolio(pubkey.toBase58());
      return NextResponse.json(data, { headers: { "Cache-Control": "private, s-maxage=30" } });
    }

    return NextResponse.json({ error: "chain phải là 'evm' hoặc 'solana'" }, { status: 400 });
  } catch (err) {
    console.error("[/api/portfolio] error:", err);
    return NextResponse.json({ error: "Không thể tải portfolio", detail: String(err) }, { status: 502 });
  }
}
