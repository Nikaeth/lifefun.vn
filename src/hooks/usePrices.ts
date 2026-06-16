"use client";
import useSWR from "swr";
import type { PriceItem } from "@/types";

const fetcher = (url: string) => fetch(url).then(r => r.json());

interface PricesResponse {
  items: PriceItem[];
  updatedAt: string;
  source: string;
}

/**
 * Hook lấy giá crypto realtime, tự refresh mỗi 30 giây.
 * Dùng: const { prices, isLoading, updatedAt } = usePrices();
 */
export function usePrices(ids?: string) {
  const query = ids ? `?ids=${ids}` : "";
  const { data, error, isLoading } = useSWR<PricesResponse>(
    `/api/prices${query}`,
    fetcher,
    {
      refreshInterval: 30_000, // 30 giây
      revalidateOnFocus: true,
    }
  );

  return {
    prices: data?.items || [],
    updatedAt: data?.updatedAt,
    isLoading,
    error,
  };
}
