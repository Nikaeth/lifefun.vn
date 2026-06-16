"use client";
import { NEWS_ITEMS } from "@/lib/data";
import { useNews } from "@/hooks/useNews";
import { Skeleton } from "@/components/ui/Skeleton";
import { RefreshCw } from "lucide-react";
import type { NewsItem } from "@/types";

const catStyles: Record<NewsItem["cat"], string> = {
  crypto: "bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-300",
  stock:  "bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300",
  macro:  "bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300",
  forex:  "bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300",
};

const CATS: { key?: NewsItem["cat"]; label: string }[] = [
  { key: undefined, label: "Tất cả" },
  { key: "stock",   label: "Chứng khoán" },
  { key: "crypto",  label: "Crypto" },
  { key: "macro",   label: "Vĩ mô" },
  { key: "forex",   label: "Forex" },
];

export default function NewsPageClient() {
  const { news, isLoading, error } = useNews(undefined, 24);
  const firstLoad = isLoading && news.length === 0;
  const useMock = !isLoading && (error || news.length === 0);
  const items = useMock ? NEWS_ITEMS : news;

  return (
    <div className="max-w-screen-xl mx-auto px-6 py-8">
      <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-50">Tin tức tài chính</h1>
        {!useMock && !firstLoad && (
          <span className="flex items-center gap-1 text-[11px] text-gray-400 dark:text-gray-500">
            <RefreshCw size={11} aria-hidden="true" /> Tự động cập nhật mỗi 2 phút
          </span>
        )}
        {useMock && <span className="text-[10px] text-gray-400 dark:text-gray-500">dữ liệu mẫu</span>}
      </div>
      <p className="text-gray-500 dark:text-gray-400 mb-6">
        Tổng hợp tin tức chứng khoán, crypto, vĩ mô và ngoại hối từ các nguồn uy tín.
      </p>

      <div className="flex gap-2 mb-6 overflow-x-auto" role="tablist" aria-label="Lọc tin tức theo danh mục">
        {CATS.map(c => (
          <span
            key={c.label}
            role="tab"
            className="px-3 py-1.5 rounded-full text-xs font-medium border border-green-100 dark:border-gray-800 text-gray-600 dark:text-gray-300 whitespace-nowrap"
          >
            {c.label}
          </span>
        ))}
      </div>

      {firstLoad ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5" role="status" aria-label="Đang tải tin tức">
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={i} className="bg-white dark:bg-gray-900 border border-green-100 dark:border-gray-800 rounded-xl overflow-hidden">
              <Skeleton className="h-32 w-full rounded-none" />
              <div className="p-4">
                <Skeleton className="h-4 w-20 mb-2" />
                <Skeleton className="h-3.5 w-full mb-1.5" />
                <Skeleton className="h-3.5 w-3/4" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 list-none">
          {items.map((n, i) => (
            <li key={i}>
              <article className="bg-white dark:bg-gray-900 border border-green-100 dark:border-gray-800 rounded-xl overflow-hidden hover:shadow-md dark:hover:shadow-none hover:-translate-y-0.5 transition-all cursor-pointer h-full">
                <div className="h-32 bg-gradient-to-br from-green-100 to-green-200 dark:from-gray-800 dark:to-gray-700 flex items-center justify-center text-4xl" aria-hidden="true">
                  {n.emoji}
                </div>
                <div className="p-4">
                  <span className={`inline-block text-[10px] font-semibold tracking-widest uppercase px-2 py-0.5 rounded mb-2 ${catStyles[n.cat]}`}>
                    {n.catLabel}
                  </span>
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-50 leading-snug mb-2 line-clamp-2">{n.headline}</h3>
                  {n.excerpt && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed mb-2 line-clamp-2">{n.excerpt}</p>
                  )}
                  <div className="flex justify-between mt-3">
                    <span className="text-[11px] font-semibold text-gray-400 dark:text-gray-500">{n.source}</span>
                    <span className="text-[11px] text-gray-400 dark:text-gray-500">{n.time}</span>
                  </div>
                </div>
              </article>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
