import type { Metadata } from "next";
import PortfolioClient from "./PortfolioClient";

export const metadata: Metadata = {
  title: "Portfolio - Số dư ví của bạn | LifeFun.vn",
  description: "Kết nối ví Ethereum hoặc Solana để xem số dư và danh sách token trong portfolio của bạn.",
  robots: { index: false, follow: false }, // trang cá nhân, không cần index
};

export default function PortfolioPage() {
  return <PortfolioClient />;
}
