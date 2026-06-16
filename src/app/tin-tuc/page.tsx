import type { Metadata } from "next";
import NewsPageClient from "./NewsPageClient";

export const metadata: Metadata = {
  title: "Tin tức Tài chính, Chứng khoán & Crypto mới nhất | LifeFun.vn",
  description:
    "Cập nhật tin tức chứng khoán Việt Nam, thị trường crypto, vĩ mô và ngoại hối liên tục 24/7 từ các nguồn uy tín: CafeF, Vietstock, CoinDesk, Cointelegraph.",
  keywords: ["tin tức chứng khoán", "tin tức crypto", "tin tài chính", "VN-INDEX hôm nay", "giá bitcoin hôm nay"],
  alternates: { canonical: "https://lifefun.vn/tin-tuc" },
  openGraph: {
    title: "Tin tức Tài chính, Chứng khoán & Crypto mới nhất | LifeFun.vn",
    description: "Tổng hợp tin tức tài chính, chứng khoán và crypto cập nhật liên tục.",
    url: "https://lifefun.vn/tin-tuc",
    type: "website",
    locale: "vi_VN",
  },
};

export default function NewsPage() {
  return <NewsPageClient />;
}
