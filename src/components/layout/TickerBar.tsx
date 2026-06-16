"use client";
import { TICKERS } from "@/lib/data";

export default function TickerBar() {
  const doubled = [...TICKERS, ...TICKERS];
  return (
    <div
      className="bg-green-700 dark:bg-gray-900 text-white overflow-hidden flex items-center h-9 shrink-0"
      role="region"
      aria-label="Bảng giá thị trường trực tiếp"
    >
      <div
        className="bg-green-500 dark:bg-green-700 px-4 h-full flex items-center text-[11px] font-semibold tracking-widest uppercase shrink-0"
        aria-hidden="true"
      >
        🔴 LIVE
      </div>
      <div className="overflow-hidden flex-1">
        <div className="flex animate-ticker whitespace-nowrap" aria-hidden="true">
          {doubled.map((t, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-2 px-5 border-r border-white/15 font-mono text-[12px]"
            >
              <span className="font-semibold">{t.sym}</span>
              <span>{t.price}</span>
              <span className={t.up ? "text-green-300" : "text-red-300"}>{t.chg}</span>
            </span>
          ))}
        </div>
        {/* Phiên bản tĩnh cho screen reader, ticker chạy được đánh dấu aria-hidden */}
        <span className="sr-only">
          {TICKERS.map(t => `${t.sym}: ${t.price} (${t.chg})`).join(", ")}
        </span>
      </div>
    </div>
  );
}
