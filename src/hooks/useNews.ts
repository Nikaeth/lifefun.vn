"use client";
import useSWR from "swr";
import type { NewsItem } from "@/types";

const fetcher = (url: string) => fetch(url).then(r => r.json());

interface NewsResponse {
  items: NewsItem[];
  count: number;
  updatedAt: string;
}

/**
 * Hook lấy tin tức tổng hợp từ RSS, tự refresh mỗi 2 phút.
 * Dùng: const { news, isLoading } = useNews("crypto");
 */
export function useNews(cat?: NewsItem["cat"], limit = 12) {
  const params = new URLSearchParams();
  if (cat) params.set("cat", cat);
  params.set("limit", String(limit));

  const { data, error, isLoading } = useSWR<NewsResponse>(
    `/api/news?${params.toString()}`,
    fetcher,
    {
      refreshInterval: 2 * 60_000, // 2 phút
      revalidateOnFocus: true,     // refetch ngay khi người dùng quay lại tab
    }
  );

  return {
    news: data?.items || [],
    count: data?.count || 0,
    updatedAt: data?.updatedAt,
    isLoading,
    error,
  };
}
