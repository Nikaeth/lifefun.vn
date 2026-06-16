import { XMLParser } from "fast-xml-parser";
import type { NewsItem } from "@/types";

/**
 * RSS feed sources - tin tài chính, chứng khoán, crypto VN + quốc tế.
 * Có thể bật/tắt từng nguồn bằng cờ `enabled`.
 */
export interface RssSource {
  name: string;
  url: string;
  cat: NewsItem["cat"];
  enabled: boolean;
}

export const RSS_SOURCES: RssSource[] = [
  { name: "CafeF - Chứng khoán", url: "https://cafef.vn/thi-truong-chung-khoan.rss",        cat: "stock",  enabled: true },
  { name: "CafeF - Vĩ mô",       url: "https://cafef.vn/vi-mo-dau-tu.rss",                   cat: "macro",  enabled: true },
  { name: "Vietstock",           url: "https://vietstock.vn/830/chung-khoan/co-phieu.rss",   cat: "stock",  enabled: true },
  { name: "CoinDesk",            url: "https://www.coindesk.com/arc/outboundfeeds/rss/",     cat: "crypto", enabled: true },
  { name: "Cointelegraph",       url: "https://cointelegraph.com/rss",                       cat: "crypto", enabled: true },
  { name: "Investing.com Forex", url: "https://www.investing.com/rss/news_1.rss",            cat: "forex",  enabled: true },
];

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: "@_",
});

const CAT_EMOJI: Record<NewsItem["cat"], string> = {
  crypto: "₿",
  stock: "📈",
  macro: "🌐",
  forex: "💵",
};

const CAT_LABEL_VI: Record<NewsItem["cat"], string> = {
  crypto: "Crypto",
  stock: "Chứng khoán",
  macro: "Vĩ mô",
  forex: "Forex",
};

function timeAgo(dateStr: string): string {
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return "";
  const diffMs = Date.now() - date.getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return "vừa xong";
  if (mins < 60) return `${mins} phút trước`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} giờ trước`;
  const days = Math.floor(hours / 24);
  return `${days} ngày trước`;
}

function stripHtml(html: string = ""): string {
  return html.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
}

/**
 * Fetch và parse 1 RSS source -> NewsItem[]
 */
export async function fetchRssSource(source: RssSource, limit = 6): Promise<NewsItem[]> {
  try {
    const res = await fetch(source.url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (LifeFunBot/1.0; +https://lifefun.vn)",
        Accept: "application/rss+xml, application/xml, text/xml",
      },
      next: { revalidate: 120 }, // cache 2 phút
    });

    if (!res.ok) {
      console.warn(`[rss] ${source.name} responded ${res.status}`);
      return [];
    }

    const xml = await res.text();
    const json = parser.parse(xml);

    const items = json?.rss?.channel?.item || json?.feed?.entry || [];
    const itemsArr = Array.isArray(items) ? items : [items];

    return itemsArr.slice(0, limit).map((item: Record<string, unknown>): NewsItem => {
      const title = String(item.title || "").trim();
      const description = stripHtml(String(item.description || item.summary || ""));
      const pubDate = String(item.pubDate || item.published || item.updated || "");

      return {
        cat: source.cat,
        catLabel: CAT_LABEL_VI[source.cat],
        emoji: CAT_EMOJI[source.cat],
        headline: title,
        excerpt: description.slice(0, 140),
        source: source.name,
        time: timeAgo(pubDate) || "mới cập nhật",
      };
    });
  } catch (err) {
    console.error(`[rss] Error fetching ${source.name}:`, err);
    return [];
  }
}

/**
 * Fetch tất cả nguồn RSS đang enabled, trộn và sắp xếp.
 */
export async function fetchAllNews(limit = 24): Promise<NewsItem[]> {
  const enabled = RSS_SOURCES.filter(s => s.enabled);
  const results = await Promise.allSettled(enabled.map(s => fetchRssSource(s, 6)));

  const all: NewsItem[] = [];
  for (const r of results) {
    if (r.status === "fulfilled") all.push(...r.value);
  }

  return all.slice(0, limit);
}
