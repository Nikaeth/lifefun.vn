"use client";
import type { NewsItem } from "@/types";
import { NEWS_ITEMS } from "@/lib/data";
import { useNews } from "@/hooks/useNews";
import { ChevronRight, RefreshCw } from "lucide-react";
import Link from "next/link";
import { Skeleton } from "@/components/ui/Skeleton";
import { useRewards } from "@/hooks/useRewards";

const catStyles: Record<NewsItem["cat"], string> = {
  crypto: "bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-300",
  stock:  "bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300",
  macro:  "bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300",
  forex:  "bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300",
};

const catLabelMap: Record<NewsItem["cat"], string> = {
  crypto: "Tin Crypto",
  stock: "Tin chứng khoán",
  macro: "Tin vĩ mô",
  forex: "Tin Forex",
};

export default function NewsGrid() {
  const { news, isLoading, error } = useNews(undefined, 6);
  const { isLoggedIn, track } = useRewards();

  function handleNewsClick(headline: string) {
    if (isLoggedIn) track("read_news", { headline: headline.slice(0, 60) });
  }

  const firstLoad = isLoading && news.length === 0;
  const useMock = !isLoading && (error || news.length === 0);
  const items = useMock ? NEWS_ITEMS : news;

  return (
    <section className="mb-8" aria-labelledby="news-heading">
      <div className="flex items-center justify-between mb-4">
        <h2
          id="news-heading"
          className="text-lg font-bold text-gray-900 dark:text-gray-50 flex items-center gap-2 before:block before:w-1 before:h-5 before:rounded before:bg-green-400"
        >
          Tin tức nổi bật
        </h2>
        <div className="flex items-center gap-3">
          {!useMock && !firstLoad && (
            <span className="flex items-center gap-1 text-[11px] text-gray-400 dark:text-gray-500">
              <RefreshCw size={11} aria-hidden="true" /> Tự động cập nhật mỗi 2 phút
            </span>
          )}
          {useMock && <span className="text-[10px] text-gray-400 dark:text-gray-500">mock</span>}
          <Link href="/tin-tuc" className="text-sm font-medium text-green-600 dark:text-green-400 flex items-center gap-1 hover:underline">
            Xem tất cả <ChevronRight size={15} aria-hidden="true" />
          </Link>
        </div>
      </div>

      {firstLoad ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" role="status" aria-label="Đang tải tin tức">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-white dark:bg-gray-900 border border-green-100 dark:border-gray-800 rounded-xl overflow-hidden">
              <Skeleton className="h-36 w-full rounded-none" />
              <div className="p-4">
                <Skeleton className="h-4 w-20 mb-2 rounded" />
                <Skeleton className="h-3.5 w-full mb-1.5" />
                <Skeleton className="h-3.5 w-4/5 mb-3" />
                <div className="flex justify-between">
                  <Skeleton className="h-2.5 w-16" />
                  <Skeleton className="h-2.5 w-12" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 list-none">
          {items.slice(0, 6).map((n, i) => (
            <li key={i}>
              <article
                onClick={() => handleNewsClick(n.headline)}
                className="bg-white dark:bg-gray-900 border border-green-100 dark:border-gray-800 rounded-xl overflow-hidden hover:-translate-y-0.5 hover:shadow-lg hover:shadow-green-100 dark:hover:shadow-none transition-all cursor-pointer h-full"
              >
                <div className="h-36 bg-gradient-to-br from-green-100 to-green-200 dark:from-gray-800 dark:to-gray-700 flex items-center justify-center text-4xl select-none" aria-hidden="true">
                  {n.emoji}
                </div>
                <div className="p-4">
                  <span className={`inline-block text-[10px] font-semibold tracking-widest uppercase px-2 py-0.5 rounded mb-2 ${catStyles[n.cat]}`}>
                    <span className="sr-only">{catLabelMap[n.cat]}: </span>
                    {n.catLabel}
                  </span>
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-50 leading-snug mb-2 line-clamp-2">{n.headline}</h3>
                  {n.excerpt && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed mb-3 line-clamp-2">{n.excerpt}</p>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-semibold text-gray-400 dark:text-gray-500">{n.source}</span>
                    <span className="text-[11px] text-gray-400 dark:text-gray-500">
                      <span className="sr-only">Đăng </span>{n.time}
                    </span>
                  </div>
                </div>
              </article>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
