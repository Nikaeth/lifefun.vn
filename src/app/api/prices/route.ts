import { NextResponse } from "next/server";
import type { PriceItem } from "@/types";

/**
 * GET /api/prices
 * Trả về giá crypto + chỉ số tài chính realtime.
 * Nguồn: CoinGecko (crypto, free, không cần API key) + cache 30s.
 *
 * Query params:
 *   ?ids=bitcoin,ethereum,solana   (mặc định: bitcoin,ethereum,solana,binancecoin,ripple,avalanche-2)
 */

export const revalidate = 30; // ISR cache 30 giây

const DEFAULT_IDS = "bitcoin,ethereum,solana,binancecoin,ripple,avalanche-2";

const COIN_META: Record<string, { sym: string; full: string; icon: string; bg: string; col: string }> = {
  bitcoin:       { sym: "BTC",  full: "Bitcoin",   icon: "₿", bg: "#FEF9C3", col: "#854D0E" },
  ethereum:      { sym: "ETH",  full: "Ethereum",  icon: "Ξ", bg: "#EDE9FE", col: "#5B21B6" },
  solana:        { sym: "SOL",  full: "Solana",    icon: "◎", bg: "#DCFCE7", col: "#166534" },
  binancecoin:   { sym: "BNB",  full: "BNB",       icon: "●", bg: "#FEE2E2", col: "#991B1B" },
  ripple:        { sym: "XRP",  full: "Ripple",    icon: "✕", bg: "#E0F2FE", col: "#0369A1" },
  "avalanche-2": { sym: "AVAX", full: "Avalanche", icon: "▲", bg: "#F3F4F6", col: "#374151" },
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const ids = searchParams.get("ids") || DEFAULT_IDS;

  try {
    const url = `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd&include_24hr_change=true`;

    const res = await fetch(url, {
      headers: { Accept: "application/json" },
      // cache theo Next.js ISR
      next: { revalidate: 30 },
    });

    if (!res.ok) {
      throw new Error(`CoinGecko responded ${res.status}`);
    }

    const data: Record<string, { usd: number; usd_24h_change: number }> = await res.json();

    const items: PriceItem[] = Object.entries(data).map(([id, val]) => {
      const meta = COIN_META[id] || { sym: id.toUpperCase(), full: id, icon: "●", bg: "#F3F4F6", col: "#374151" };
      return {
        id,
        sym: meta.sym,
        full: meta.full,
        icon: meta.icon,
        bg: meta.bg,
        col: meta.col,
        price: val.usd,
        changePct24h: val.usd_24h_change,
        up: val.usd_24h_change >= 0,
      };
    });

    return NextResponse.json(
      { items, updatedAt: new Date().toISOString(), source: "coingecko" },
      { headers: { "Cache-Control": "public, s-maxage=30, stale-while-revalidate=60" } }
    );
  } catch (err) {
    console.error("[/api/prices] error:", err);
    return NextResponse.json(
      { items: [], updatedAt: new Date().toISOString(), source: "error", error: String(err) },
      { status: 502 }
    );
  }
}
