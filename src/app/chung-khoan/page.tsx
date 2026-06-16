import type { Metadata } from "next";
import { TVScreener } from "@/components/widgets/TVScreener";

export const metadata: Metadata = {
  title: "Chứng khoán Việt Nam & Quốc tế | LifeFun.vn",
  description:
    "Cập nhật giá cổ phiếu VN-INDEX, HNX, VN30, cổ phiếu Mỹ realtime. Phân tích kỹ thuật, tin tức thị trường chứng khoán mới nhất từ LifeFun.vn.",
  keywords: ["chứng khoán Việt Nam", "VN-INDEX", "VN30", "cổ phiếu", "HOSE", "HNX", "phân tích kỹ thuật"],
  alternates: { canonical: "https://lifefun.vn/chung-khoan" },
  openGraph: {
    title: "Chứng khoán Việt Nam & Quốc tế | LifeFun.vn",
    description: "Giá cổ phiếu realtime, phân tích kỹ thuật và tin tức thị trường chứng khoán.",
    url: "https://lifefun.vn/chung-khoan",
    type: "website",
    locale: "vi_VN",
  },
};

export default function StockPage() {
  return (
    <div className="max-w-screen-xl mx-auto px-6 py-8">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-50 mb-2">Chứng khoán</h1>
      <p className="text-gray-500 dark:text-gray-400 mb-6">
        Thông tin thị trường chứng khoán Việt Nam và quốc tế.
      </p>
      <TVScreener market="vietnam" />
    </div>
  );
}
