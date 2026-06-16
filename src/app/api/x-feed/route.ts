import { NextResponse } from "next/server";
import type { Tweet } from "@/types";

/**
 * GET /api/x-feed
 * Lấy tweets gần nhất theo hashtag/từ khóa qua X API v2 (Recent Search).
 *
 * YÊU CẦU: biến môi trường X_BEARER_TOKEN (X API v2 - Basic/Pro tier).
 * Đăng ký tại: https://developer.x.com
 *
 * Query params:
 *   ?q=%23crypto+OR+%23chungkhoan  (mặc định: query về chứng khoán & crypto VN)
 *   ?limit=10
 *
 * Nếu chưa có X_BEARER_TOKEN, trả về mock data + flag "mock: true"
 * để frontend vẫn hoạt động bình thường khi dev / chưa cấu hình.
 */

export const revalidate = 120; // 2 phút

const DEFAULT_QUERY = "(#chungkhoan OR #crypto OR #BTC OR #VNINDEX) lang:vi -is:retweet";

const MOCK_TWEETS: Tweet[] = [
  { av: "VF", author: "VietFin",     handle: "@VietFinance",     time: "2m",  body: "#Bitcoin vượt ngưỡng kháng cự $68K, xu hướng tăng vẫn mạnh. #BTC #Crypto", likes: 234, retweets: 87 },
  { av: "AN", author: "Anh Nguyen",  handle: "@anhnguyentrader", time: "8m",  body: "VN-INDEX hồi phục tốt, nhóm #BankStocks dẫn dắt phiên. #chungkhoan",     likes: 156, retweets: 42 },
  { av: "CT", author: "CryptoToday", handle: "@CryptoTodayVN",   time: "15m", body: "#ETH consolidating near $3,800. Watch for breakout #Ethereum #DeFi",   likes: 89,  retweets: 31 },
];

interface XApiUser {
  id: string;
  name: string;
  username: string;
}

interface XApiTweet {
  id: string;
  text: string;
  author_id: string;
  created_at: string;
  public_metrics: {
    like_count: number;
    retweet_count: number;
  };
}

function timeAgo(dateStr: string): string {
  const diffMs = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return "vừa xong";
  if (mins < 60) return `${mins}m`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h`;
  return `${Math.floor(hours / 24)}d`;
}

function initials(name: string): string {
  return name
    .split(" ")
    .map(w => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q") || DEFAULT_QUERY;
  const limit = Math.min(Number(searchParams.get("limit")) || 10, 50);

  const token = process.env.X_BEARER_TOKEN;

  if (!token) {
    return NextResponse.json({
      items: MOCK_TWEETS,
      count: MOCK_TWEETS.length,
      mock: true,
      note: "X_BEARER_TOKEN chưa được cấu hình. Đang trả về mock data. Xem README để cấu hình X API v2.",
      updatedAt: new Date().toISOString(),
    });
  }

  try {
    const url = new URL("https://api.twitter.com/2/tweets/search/recent");
    url.searchParams.set("query", query);
    url.searchParams.set("max_results", String(Math.max(limit, 10)));
    url.searchParams.set("tweet.fields", "created_at,public_metrics,author_id");
    url.searchParams.set("expansions", "author_id");
    url.searchParams.set("user.fields", "name,username");

    const res = await fetch(url.toString(), {
      headers: { Authorization: `Bearer ${token}` },
      next: { revalidate: 120 },
    });

    if (!res.ok) {
      throw new Error(`X API responded ${res.status}`);
    }

    const json = await res.json();
    const tweets: XApiTweet[] = json.data || [];
    const users: XApiUser[] = json.includes?.users || [];
    const userMap = new Map(users.map(u => [u.id, u]));

    const items: Tweet[] = tweets.slice(0, limit).map(t => {
      const user = userMap.get(t.author_id);
      return {
        av: initials(user?.name || "??"),
        author: user?.name || "Unknown",
        handle: `@${user?.username || "unknown"}`,
        time: timeAgo(t.created_at),
        body: t.text,
        likes: t.public_metrics?.like_count || 0,
        retweets: t.public_metrics?.retweet_count || 0,
      };
    });

    return NextResponse.json(
      { items, count: items.length, mock: false, updatedAt: new Date().toISOString() },
      { headers: { "Cache-Control": "public, s-maxage=120, stale-while-revalidate=240" } }
    );
  } catch (err) {
    console.error("[/api/x-feed] error:", err);
    return NextResponse.json({
      items: MOCK_TWEETS,
      count: MOCK_TWEETS.length,
      mock: true,
      error: String(err),
      updatedAt: new Date().toISOString(),
    });
  }
}
