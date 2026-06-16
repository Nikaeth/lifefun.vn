"use client";
import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then(r => r.json());

interface SwapQuote {
  chain: "evm" | "solana";
  fromToken: string;
  toToken: string;
  fromAmount: string;
  toAmount: string;
  estimatedGas?: string;
  priceImpact?: string;
  provider: string;
  note: string;
  error?: string;
}

/**
 * Hook lấy quote swap từ /api/swap.
 * amount phải ở dạng raw (smallest unit) — ví dụ "1000000000000000000" cho 1 ETH.
 */
export function useSwapQuote(params: {
  chain?: "evm" | "solana";
  from?: string;
  to?: string;
  amount?: string;
  chainId?: number;
}) {
  const { chain, from, to, amount, chainId } = params;
  const ready = chain && from && to && amount && Number(amount) > 0;

  const query = ready
    ? `/api/swap?chain=${chain}&from=${from}&to=${to}&amount=${amount}${chainId ? `&chainId=${chainId}` : ""}`
    : null;

  const { data, error, isLoading } = useSWR<SwapQuote>(query, fetcher, {
    refreshInterval: 15_000,
    revalidateOnFocus: false,
  });

  return { quote: data, isLoading, error: error || data?.error };
}
