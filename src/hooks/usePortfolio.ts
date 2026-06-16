"use client";
import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then(r => r.json());

interface PortfolioToken {
  symbol: string;
  name: string;
  balance: string;
  decimals: number;
  usdValue?: number;
}

interface PortfolioData {
  address: string;
  chain: "evm" | "solana";
  nativeBalance: PortfolioToken;
  tokens: PortfolioToken[];
  source: string;
  note?: string;
  error?: string;
}

/**
 * Hook lấy portfolio (số dư native + token) cho một địa chỉ ví.
 * Dùng: const { portfolio, isLoading } = usePortfolio(address, "evm");
 */
export function usePortfolio(address: string | undefined, chain: "evm" | "solana" | undefined) {
  const { data, error, isLoading } = useSWR<PortfolioData>(
    address && chain ? `/api/portfolio?address=${address}&chain=${chain}` : null,
    fetcher,
    { refreshInterval: 30_000 }
  );

  return {
    portfolio: data,
    isLoading,
    error: error || data?.error,
  };
}
