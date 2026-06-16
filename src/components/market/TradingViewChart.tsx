"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import { CHART_SYMBOLS } from "@/lib/data";
import { useTheme } from "@/components/providers/ThemeProvider";
import LiveBadge from "./LiveBadge";

declare global {
  interface Window {
    TradingView: {
      widget: new (config: Record<string, unknown>) => void;
    };
  }
}

export default function TradingViewChart() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(CHART_SYMBOLS[0]);
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const widgetRef = useRef<unknown>(null);
  const { theme } = useTheme();

  const buildChart = useCallback((symbol: string) => {
    if (!containerRef.current || !window.TradingView) return;
    containerRef.current.innerHTML = "";
    const id = "tv_chart_" + Date.now();
    const div = document.createElement("div");
    div.id = id;
    div.style.height = "100%";
    containerRef.current.appendChild(div);
    widgetRef.current = new window.TradingView.widget({
      autosize: true,
      symbol,
      interval: "D",
      timezone: "Asia/Ho_Chi_Minh",
      theme: theme === "dark" ? "dark" : "light",
      style: "1",
      locale: "vi_VN",
      toolbar_bg: theme === "dark" ? "#111827" : "#f1fbf3",
      enable_publishing: false,
      hide_top_toolbar: false,
      container_id: id,
    });
  }, [theme]);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/tv.js";
    script.async = true;
    script.onload = () => setScriptLoaded(true);
    document.head.appendChild(script);
    return () => { document.head.removeChild(script); };
  }, []);

  // Build / rebuild chart khi script đã load, hoặc khi theme/symbol đổi
  useEffect(() => {
    if (scriptLoaded) buildChart(active.symbol);
  }, [scriptLoaded, theme, active.symbol, buildChart]);

  return (
    <div className="bg-white dark:bg-gray-900 border border-green-100 dark:border-gray-800 rounded-xl overflow-hidden">
      <div className="flex items-center justify-between px-4 pt-4 pb-0">
        <div className="flex items-center gap-3">
          <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-50">Biểu đồ thị trường</h2>
          <LiveBadge />
        </div>
        <div className="flex gap-1" role="group" aria-label="Chọn mã giao dịch để xem biểu đồ">
          {CHART_SYMBOLS.map(s => (
            <button
              key={s.symbol}
              onClick={() => setActive(s)}
              aria-pressed={active.symbol === s.symbol}
              className={`px-3 py-1 rounded-md text-xs font-medium border transition-colors ${
                active.symbol === s.symbol
                  ? "bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800"
                  : "text-gray-500 dark:text-gray-400 border-transparent hover:bg-green-50 dark:hover:bg-gray-800"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>
      <div
        ref={containerRef}
        className="h-[380px] w-full"
        role="img"
        aria-label={`Biểu đồ giá ${active.label} theo TradingView`}
      >
        {!scriptLoaded && (
          <div className="h-full w-full flex items-center justify-center text-sm text-gray-400 dark:text-gray-500" role="status">
            Đang tải biểu đồ...
          </div>
        )}
      </div>
    </div>
  );
}
