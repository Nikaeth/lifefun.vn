import { cn } from "@/lib/utils";

/**
 * Khối skeleton dùng chung khi đang tải dữ liệu.
 * Dùng aria-hidden vì đây chỉ là chỉ báo trực quan; trạng thái loading
 * thực tế nên được công bố qua role="status" ở component cha.
 */
export function Skeleton({ className }: { className?: string }) {
  return <div aria-hidden="true" className={cn("skeleton", className)} />;
}
