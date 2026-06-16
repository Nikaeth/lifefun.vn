"use client";
import { useEffect, useRef } from "react";
import { useTheme } from "@/components/providers/ThemeProvider";

export default function TVTickerTape() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();

  useEffect(() => {
    if (!containerRef.current) return;
    containerRef.current.innerHTML = "";

    const widgetDiv = document.createElement("div");
    widgetDiv.className = "tradingview-widget-container__widget";
    containerRef.current.appendChild(widgetDiv);

    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-ticker-tape.js";
    script.async = true;
    script.innerHTML = JSON.stringify({
      symbols: [
        { proName: "FOREXCOM:SPXUSD", title: "S&P 500" },
        { proName: "FOREXCOM:NSXUSD", title: "Nasdaq" },
        { proName: "FX_IDC:XAUUSD", title: "Vàng" },
        { proName: "BINANCE:BTCUSDT", title: "Bitcoin" },
        { proName: "BINANCE:ETHUSDT", title: "Ethereum" },
        { proName: "BINANCE:SOLUSDT", title: "Solana" },
        { proName: "HOSE:VNM", title: "VNM" },
        { proName: "HOSE:VCB", title: "VCB" },
        { description: "USD/VND", proName: "FX_IDC:USDVND" },
      ],
      showSymbolLogo: true,
      colorTheme: theme === "dark" ? "dark" : "light",
      isTransparent: false,
      displayMode: "adaptive",
      locale: "vi_VN",
    });
    containerRef.current.appendChild(script);
  }, [theme]);

  return (
    <div className="rounded-xl overflow-hidden border border-green-100 dark:border-gray-800 mb-5" role="region" aria-label="Bảng giá thị trường TradingView">
      <div className="tradingview-widget-container" ref={containerRef} />
    </div>
  );
}
