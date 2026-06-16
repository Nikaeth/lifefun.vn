import { NextResponse } from "next/server";

/**
 * GET /api/swap/quote?chain=evm|solana&from=...&to=...&amount=...
 *
 * Lấy quote giá swap từ DEX aggregator. ĐÂY LÀ PLACEHOLDER — cần điền API key
 * và logic thực tế trước khi dùng cho production. KHÔNG xử lý giao dịch thật
 * trên server; mọi giao dịch swap phải được người dùng tự ký trong wallet
 * (client-side), server chỉ cung cấp quote/route.
 *
 * === EVM: 1inch Swap API ===
 *   Đăng ký API key: https://portal.1inch.dev
 *   Docs: https://docs.1inch.io/docs/aggregation-protocol/api/swagger
 *   Endpoint ví dụ: https://api.1inch.dev/swap/v6.0/{chainId}/quote
 *   Header: Authorization: Bearer <1INCH_API_KEY>
 *
 * === Solana: Jupiter Aggregator API ===
 *   Miễn phí, không cần key: https://station.jup.ag/docs/apis/swap-api
 *   Endpoint: https://quote-api.jup.ag/v6/quote?inputMint=...&outputMint=...&amount=...
 *
 * LƯU Ý PHÁP LÝ: Tính năng swap tích hợp có thể chịu quy định tài chính tùy
 * khu vực pháp lý (VD: yêu cầu giấy phép VASP tại một số quốc gia). Tham khảo
 * ý kiến pháp lý trước khi triển khai production tại Việt Nam.
 */

export const revalidate = 0; // không cache giá swap

interface SwapQuoteResponse {
  chain: "evm" | "solana";
  fromToken: string;
  toToken: string;
  fromAmount: string;
  toAmount: string;
  estimatedGas?: string;
  priceImpact?: string;
  provider: string;
  note: string;
}

const JUPITER_QUOTE_URL = "https://quote-api.jup.ag/v6/quote";
const ONEINCH_BASE_URL = "https://api.1inch.dev/swap/v6.0";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const chain = searchParams.get("chain") as "evm" | "solana" | null;
  const from = searchParams.get("from");
  const to = searchParams.get("to");
  const amount = searchParams.get("amount");
  const chainId = searchParams.get("chainId") || "1"; // default Ethereum mainnet

  if (!chain || !from || !to || !amount) {
    return NextResponse.json(
      { error: "Thiếu tham số: chain, from, to, amount" },
      { status: 400 }
    );
  }

  if (chain === "solana") {
    try {
      const url = `${JUPITER_QUOTE_URL}?inputMint=${from}&outputMint=${to}&amount=${amount}&slippageBps=50`;
      const res = await fetch(url, { next: { revalidate: 0 } });

      if (!res.ok) {
        throw new Error(`Jupiter API responded ${res.status}`);
      }

      const data = await res.json();

      const result: SwapQuoteResponse = {
        chain: "solana",
        fromToken: from,
        toToken: to,
        fromAmount: amount,
        toAmount: data.outAmount || "0",
        priceImpact: data.priceImpactPct,
        provider: "Jupiter v6",
        note: "Quote thực tế từ Jupiter. Giao dịch swap cần được ký bởi người dùng qua wallet (client-side), KHÔNG thực hiện trên server.",
      };

      return NextResponse.json(result);
    } catch (err) {
      console.error("[/api/swap] Jupiter error:", err);
      return NextResponse.json({ error: "Không thể lấy quote từ Jupiter", detail: String(err) }, { status: 502 });
    }
  }

  if (chain === "evm") {
    const apiKey = process.env.ONEINCH_API_KEY;

    if (!apiKey) {
      // Trả về mock quote để frontend vẫn hoạt động khi demo
      const mock: SwapQuoteResponse = {
        chain: "evm",
        fromToken: from,
        toToken: to,
        fromAmount: amount,
        toAmount: "0",
        provider: "1inch (mock - chưa cấu hình ONEINCH_API_KEY)",
        note: "Đăng ký API key tại https://portal.1inch.dev và thêm ONEINCH_API_KEY vào .env.local để lấy quote thực.",
      };
      return NextResponse.json(mock);
    }

    try {
      const url = `${ONEINCH_BASE_URL}/${chainId}/quote?src=${from}&dst=${to}&amount=${amount}`;
      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${apiKey}` },
        next: { revalidate: 0 },
      });

      if (!res.ok) {
        throw new Error(`1inch API responded ${res.status}`);
      }

      const data = await res.json();

      const result: SwapQuoteResponse = {
        chain: "evm",
        fromToken: from,
        toToken: to,
        fromAmount: amount,
        toAmount: data.dstAmount || "0",
        estimatedGas: data.gas?.toString(),
        provider: "1inch v6",
        note: "Quote thực tế từ 1inch. Giao dịch swap cần được ký bởi người dùng qua wallet (client-side), KHÔNG thực hiện trên server.",
      };

      return NextResponse.json(result);
    } catch (err) {
      console.error("[/api/swap] 1inch error:", err);
      return NextResponse.json({ error: "Không thể lấy quote từ 1inch", detail: String(err) }, { status: 502 });
    }
  }

  return NextResponse.json({ error: "chain phải là 'evm' hoặc 'solana'" }, { status: 400 });
}
