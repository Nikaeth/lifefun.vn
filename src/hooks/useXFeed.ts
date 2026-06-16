"use client";
import useSWR from "swr";
import type { Tweet } from "@/types";

const fetcher = (url: string) => fetch(url).then(r => r.json());

interface XFeedResponse {
  items: Tweet[];
  count: number;
  mock: boolean;
  note?: string;
  updatedAt: string;
}

/**
 * Hook lấy tweets gần nhất theo hashtag, tự refresh mỗi 2 phút.
 * Dùng: const { tweets, isMock } = useXFeed();
 */
export function useXFeed(query?: string, limit = 10) {
  const params = new URLSearchParams();
  if (query) params.set("q", query);
  params.set("limit", String(limit));

  const { data, error, isLoading } = useSWR<XFeedResponse>(
    `/api/x-feed?${params.toString()}`,
    fetcher,
    {
      refreshInterval: 2 * 60_000, // 2 phút
      revalidateOnFocus: false,
    }
  );

  return {
    tweets: data?.items || [],
    isMock: data?.mock ?? true,
    note: data?.note,
    updatedAt: data?.updatedAt,
    isLoading,
    error,
  };
}
