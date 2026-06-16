import type { Metadata } from "next";
import { TVScreener } from "@/components/widgets/TVScreener";
import { TVHeatmap } from "@/components/widgets/TVHeatmap";

export const metadata: Metadata = {
  title: "Giá Crypto Realtime - Bitcoin, Ethereum, Solana | LifeFun.vn",
  description:
    "Giá Bitcoin, Ethereum, Solana và hơn 500 đồng coin realtime. Heatmap thị trường crypto, phân tích kỹ thuật và tin tức cập nhật 24/7.",
  keywords: ["crypto", "bitcoin", "ethereum", "tiền điện tử", "giá BTC", "giá ETH", "blockchain"],
  alternates: { canonical: "https://lifefun.vn/crypto" },
  openGraph: {
    title: "Giá Crypto Realtime - Bitcoin, Ethereum, Solana | LifeFun.vn",
    description: "Giá crypto realtime, heatmap thị trường và phân tích chuyên sâu.",
    url: "https://lifefun.vn/crypto",
    type: "website",
    locale: "vi_VN",
  },
};

export default function CryptoPage() {
  return (
    <div className="max-w-screen-xl mx-auto px-6 py-8">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-50 mb-2">Tiền điện tử</h1>
      <p className="text-gray-500 dark:text-gray-400 mb-6">
        Giá crypto realtime – Bitcoin, Ethereum và hơn 500 đồng coin.
      </p>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <TVScreener market="crypto" />
        <TVHeatmap />
      </div>
    </div>
  );
}
