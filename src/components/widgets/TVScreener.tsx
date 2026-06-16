"use client";
import { useEffect, useRef } from "react";
import { useTheme } from "@/components/providers/ThemeProvider";

export interface TVScreenerProps {
  /** "crypto" hiển thị bảng lọc thị trường crypto, "vietnam" hiển thị cổ phiếu Việt Nam */
  market?: "crypto" | "vietnam";
}

const SCREENER_CONFIG = {
  crypto: { screenerType: "crypto_mkt", displayCurrency: "USD", market: undefined },
  vietnam: { screenerType: "stock", displayCurrency: "VND", market: "vietnam" },
} as const;

export function TVScreener({ market = "crypto" }: TVScreenerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();
  const cfg = SCREENER_CONFIG[market];

  useEffect(() => {
    if (!containerRef.current) return;
    containerRef.current.innerHTML = "";

    const widgetDiv = document.createElement("div");
    widgetDiv.className = "tradingview-widget-container__widget h-full";
    containerRef.current.appendChild(widgetDiv);

    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-screener.js";
    script.async = true;
    script.innerHTML = JSON.stringify({
      width: "100%",
      height: 420,
      defaultColumn: "overview",
      screenerType: cfg.screenerType,
      displayCurrency: cfg.displayCurrency,
      ...(cfg.market ? { market: cfg.market } : {}),
      colorTheme: theme === "dark" ? "dark" : "light",
      locale: "vi_VN",
      isTransparent: false,
    });
    containerRef.current.appendChild(script);
  }, [theme, market, cfg]);

  const label = market === "vietnam" ? "Bảng lọc cổ phiếu Việt Nam (TradingView)" : "Bảng lọc thị trường Crypto (TradingView)";

  return (
    <div className="bg-white dark:bg-gray-900 border border-green-100 dark:border-gray-800 rounded-xl overflow-hidden h-[420px]" role="region" aria-label={label}>
      <div className="tradingview-widget-container h-full" ref={containerRef} />
    </div>
  );
}

export default TVScreener;
