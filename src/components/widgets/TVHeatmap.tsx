"use client";
import { useEffect, useRef } from "react";
import { useTheme } from "@/components/providers/ThemeProvider";

export function TVHeatmap() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();

  useEffect(() => {
    if (!containerRef.current) return;
    containerRef.current.innerHTML = "";

    const widgetDiv = document.createElement("div");
    widgetDiv.className = "tradingview-widget-container__widget h-full";
    containerRef.current.appendChild(widgetDiv);

    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-crypto-coins-heatmap.js";
    script.async = true;
    script.innerHTML = JSON.stringify({
      dataSource: "Crypto",
      blockSize: "market_cap_calc",
      blockColor: "change",
      locale: "vi_VN",
      colorTheme: theme === "dark" ? "dark" : "light",
      hasTopBar: false,
      isZoomEnabled: true,
      hasSymbolTooltip: true,
      width: "100%",
      height: "420",
    });
    containerRef.current.appendChild(script);
  }, [theme]);

  return (
    <div className="bg-white dark:bg-gray-900 border border-green-100 dark:border-gray-800 rounded-xl overflow-hidden h-[420px]" role="region" aria-label="Heatmap thị trường Crypto (TradingView)">
      <div className="tradingview-widget-container h-full" ref={containerRef} />
    </div>
  );
}

export default TVHeatmap;
