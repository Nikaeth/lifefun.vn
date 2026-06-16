import type { Metadata } from "next";
import MembershipClient from "./MembershipClient";

export const metadata: Metadata = {
  title: "Khu vực thành viên (NFT-gated) | LifeFun.vn",
  description: "Nội dung độc quyền dành cho holder NFT thành viên LifeFun.vn. Kết nối ví và xác thực để truy cập.",
  robots: { index: false, follow: false },
};

export default function MembershipPage() {
  return <MembershipClient />;
}
