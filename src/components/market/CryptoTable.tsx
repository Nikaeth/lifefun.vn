"use client";
import { CRYPTOS } from "@/lib/data";
import { usePrices } from "@/hooks/usePrices";
import LiveBadge from "./LiveBadge";
import { Skeleton } from "@/components/ui/Skeleton";

function fmtPrice(v: number): string {
  if (v < 1) return "$" + v.toFixed(4);
  if (v < 100) return "$" + v.toFixed(2);
  return "$" + v.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export default function CryptoTable() {
  const { prices, isLoading, error } = usePrices();

  const firstLoad = isLoading && prices.length === 0;
  const useMock = (!isLoading && (error || prices.length === 0));

  const rows = useMock
    ? CRYPTOS.map(c => ({
        sym: c.sym,
        full: c.full,
        icon: c.icon,
        bg: c.bg,
        col: c.col,
        priceLabel: c.price,
        chgLabel: c.chg,
        up: c.up,
      }))
    : prices.map(p => ({
        sym: p.sym,
        full: p.full,
        icon: p.icon,
        bg: p.bg,
        col: p.col,
        priceLabel: fmtPrice(p.price),
        chgLabel: `${p.changePct24h >= 0 ? "+" : ""}${p.changePct24h.toFixed(2)}%`,
        up: p.up,
      }));

  return (
    <div className="bg-white dark:bg-gray-900 border border-green-100 dark:border-gray-800 rounded-xl overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3.5 border-b border-green-100 dark:border-gray-800">
        <span className="text-sm font-semibold text-gray-900 dark:text-gray-50">Giá Crypto</span>
        <div className="flex items-center gap-2">
          {useMock && (
            <span className="text-[10px] text-gray-400 dark:text-gray-500" title="Đang dùng dữ liệu mẫu">mock</span>
          )}
          <LiveBadge label="Realtime" />
        </div>
      </div>

      {firstLoad ? (
        <div className="p-4 space-y-3" role="status" aria-label="Đang tải giá crypto">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3">
              <Skeleton className="w-7 h-7 rounded-full shrink-0" />
              <div className="flex-1">
                <Skeleton className="h-3 w-14 mb-1.5" />
                <Skeleton className="h-2.5 w-20" />
              </div>
              <Skeleton className="h-3 w-14" />
              <Skeleton className="h-4 w-12 rounded-full" />
            </div>
          ))}
        </div>
      ) : (
        <table className="w-full">
          <caption className="sr-only">Giá và biến động 24 giờ của các loại tiền điện tử phổ biến</caption>
          <thead>
            <tr>
              <th scope="col" className="text-[11px] font-semibold tracking-widest uppercase text-gray-400 dark:text-gray-500 px-4 py-2 text-left border-b border-green-50 dark:border-gray-800">
                Tài sản
              </th>
              <th scope="col" className="text-[11px] font-semibold tracking-widest uppercase text-gray-400 dark:text-gray-500 px-4 py-2 text-right border-b border-green-50 dark:border-gray-800">
                Giá
              </th>
              <th scope="col" className="text-[11px] font-semibold tracking-widest uppercase text-gray-400 dark:text-gray-500 px-4 py-2 text-right border-b border-green-50 dark:border-gray-800">
                24h
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map(a => (
              <tr key={a.sym} className="hover:bg-green-50 dark:hover:bg-gray-800 transition-colors">
                <th scope="row" className="px-4 py-2.5 text-left font-normal">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0"
                      style={{ background: a.bg, color: a.col }}
                      aria-hidden="true"
                    >
                      {a.icon}
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-gray-900 dark:text-gray-50">{a.sym}</div>
                      <div className="text-[11px] text-gray-400 dark:text-gray-500">{a.full}</div>
                    </div>
                  </div>
                </th>
                <td className="px-4 py-2.5 text-right font-mono text-sm font-medium text-gray-900 dark:text-gray-50 tabular-nums">
                  {a.priceLabel}
                </td>
                <td className="px-4 py-2.5 text-right">
                  <span
                    className={`inline-block text-[11px] font-semibold font-mono px-2 py-0.5 rounded-full ${
                      a.up
                        ? "bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300"
                        : "bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300"
                    }`}
                  >
                    <span className="sr-only">{a.up ? "tăng " : "giảm "}</span>
                    {a.chgLabel}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
