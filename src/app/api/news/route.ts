import { NextResponse } from "next/server";
import { fetchAllNews, fetchRssSource, RSS_SOURCES } from "@/lib/rss";

/**
 * GET /api/news
 * Trả về tin tức tổng hợp từ RSS feeds (CafeF, Vietstock, CoinDesk, Cointelegraph...).
 * Tự động cache 2 phút (ISR revalidate trong rss.ts).
 *
 * Query params:
 *   ?cat=crypto|stock|macro|forex   - lọc theo danh mục
 *   ?limit=12                       - số lượng tối đa (mặc định 24)
 */

export const revalidate = 120; // 2 phút

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const cat = searchParams.get("cat");
  const limit = Number(searchParams.get("limit")) || 24;

  try {
    let news;

    if (cat) {
      const sources = RSS_SOURCES.filter(s => s.enabled && s.cat === cat);
      const results = await Promise.allSettled(sources.map(s => fetchRssSource(s, limit)));
      news = results
        .filter((r): r is PromiseFulfilledResult<Awaited<ReturnType<typeof fetchRssSource>>> => r.status === "fulfilled")
        .flatMap(r => r.value)
        .slice(0, limit);
    } else {
      news = await fetchAllNews(limit);
    }

    return NextResponse.json(
      { items: news, count: news.length, updatedAt: new Date().toISOString() },
      { headers: { "Cache-Control": "public, s-maxage=120, stale-while-revalidate=300" } }
    );
  } catch (err) {
    console.error("[/api/news] error:", err);
    return NextResponse.json(
      { items: [], count: 0, updatedAt: new Date().toISOString(), error: String(err) },
      { status: 502 }
    );
  }
}
