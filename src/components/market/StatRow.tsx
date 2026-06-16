"use client";
import { STATS } from "@/lib/data";
import { usePrices } from "@/hooks/usePrices";
import { TrendingUp, TrendingDown } from "lucide-react";
import { Skeleton } from "@/components/ui/Skeleton";

function fmtBtc(v: number): string {
  return "$" + v.toLocaleString("en-US", { maximumFractionDigits: 0 });
}

export default function StatRow() {
  // Chỉ BTC có nguồn API miễn phí (CoinGecko). Các chỉ số VN-INDEX / S&P500 / Vàng / USD-VND
  // cần nguồn dữ liệu trả phí (TradingView Pro feed, Investing.com API, vnstock...).
  const { prices, isLoading, error } = usePrices("bitcoin");
  const btc = prices.find(p => p.id === "bitcoin");
  const hasLiveBtc = !isLoading && !error && btc;
  const btcLoading = isLoading && !error;

  return (
    <div
      className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-5"
      role="status"
      aria-label="Thống kê thị trường"
    >
      {STATS.map((s, i) => {
        const isBtc = i === 0;

        if (isBtc && btcLoading) {
          return (
            <div key={s.label} className="bg-white dark:bg-gray-900 border border-green-100 dark:border-gray-800 rounded-xl p-3.5">
              <Skeleton className="h-3 w-16 mb-2" />
              <Skeleton className="h-5 w-20 mb-1.5" />
              <Skeleton className="h-3 w-12" />
            </div>
          );
        }

        const value = isBtc && hasLiveBtc ? fmtBtc(btc!.price) : s.value;
        const chgNum = isBtc && hasLiveBtc ? btc!.changePct24h : Number(s.chg.replace(/[+%]/g, ""));
        const up = isBtc && hasLiveBtc ? btc!.up : s.up;
        const chgLabel = `${chgNum >= 0 ? "+" : ""}${chgNum.toFixed(2)}%`;

        return (
          <div key={s.label} className="bg-white dark:bg-gray-900 border border-green-100 dark:border-gray-800 rounded-xl p-3.5">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] font-semibold tracking-widest uppercase text-gray-400 dark:text-gray-500">{s.label}</span>
              {isBtc && hasLiveBtc && <span className="text-[9px] text-green-500 dark:text-green-400 font-semibold">LIVE</span>}
            </div>
            <div className="font-mono text-[18px] font-semibold text-gray-900 dark:text-gray-50">{value}</div>
            <div className={`flex items-center gap-1 text-xs font-mono mt-0.5 ${up ? "text-green-500 dark:text-green-400" : "text-red-500 dark:text-red-400"}`}>
              {up ? <TrendingUp size={12} aria-hidden="true" /> : <TrendingDown size={12} aria-hidden="true" />}
              <span className="sr-only">{up ? "tăng" : "giảm"}</span>
              {chgLabel}
            </div>
          </div>
        );
      })}
    </div>
  );
}
