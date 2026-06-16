import type { Metadata } from "next";
import StatRow from "@/components/market/StatRow";
import TradingViewChart from "@/components/market/TradingViewChart";
import CryptoTable from "@/components/market/CryptoTable";
import XFeed from "@/components/widgets/XFeed";
import TVTickerTape from "@/components/widgets/TVTickerTape";
import TVScreener from "@/components/widgets/TVScreener";
import TVHeatmap from "@/components/widgets/TVHeatmap";
import NewsGrid from "@/components/news/NewsGrid";

export const metadata: Metadata = {
  title: "LifeFun.vn – Tài chính · Chứng khoán · Crypto Việt Nam",
  description:
    "Tổng quan thị trường tài chính realtime: giá Bitcoin, Ethereum, VN-INDEX, vàng, USD/VND. Tin tức cập nhật 24/7, biểu đồ và heatmap crypto.",
  alternates: { canonical: "https://lifefun.vn" },
};

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-lg font-bold text-gray-900 dark:text-gray-50 flex items-center gap-2 mb-4 before:block before:w-1 before:h-5 before:rounded before:bg-green-400">
      {children}
    </h2>
  );
}

export default function HomePage() {
  return (
    <div className="max-w-screen-xl mx-auto px-4 sm:px-6 py-6 pb-16">

      {/* Market overview stats */}
      <StatRow />

      {/* TradingView Ticker Tape */}
      <TVTickerTape />

      {/* Main grid: chart + sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-5 mb-8">
        <TradingViewChart />
        <div className="flex flex-col gap-4">
          <CryptoTable />
          <XFeed />
        </div>
      </div>

      {/* News */}
      <NewsGrid />

      {/* Crypto screener */}
      <section className="mb-8">
        <SectionTitle>Bảng giá thị trường Crypto</SectionTitle>
        <TVScreener />
      </section>

      {/* Heatmap */}
      <section>
        <SectionTitle>Heatmap thị trường Crypto</SectionTitle>
        <TVHeatmap />
      </section>

    </div>
  );
}
