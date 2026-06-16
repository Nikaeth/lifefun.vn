import type { Metadata } from "next";
import RewardsClient from "./RewardsClient";

export const metadata: Metadata = {
  title: "LifeFun Points - Điểm thưởng thành viên | LifeFun.vn",
  description: "Tích điểm thưởng nội bộ qua check-in hàng ngày, đọc tin tức, kết nối ví. Đổi điểm lấy huy hiệu và đặc quyền.",
  robots: { index: false, follow: false },
};

export default function RewardsPage() {
  return <RewardsClient />;
}
