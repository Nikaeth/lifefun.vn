import { Skeleton } from "@/components/ui/Skeleton";

/**
 * Hiển thị khi điều hướng giữa các route (App Router tự động dùng file này).
 */
export default function Loading() {
  return (
    <div className="max-w-screen-xl mx-auto px-4 sm:px-6 py-6 pb-16" role="status" aria-label="Đang tải trang">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-5">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="bg-white dark:bg-gray-900 border border-green-100 dark:border-gray-800 rounded-xl p-3.5">
            <Skeleton className="h-3 w-16 mb-2" />
            <Skeleton className="h-5 w-20 mb-1.5" />
            <Skeleton className="h-3 w-12" />
          </div>
        ))}
      </div>
      <Skeleton className="h-9 w-full rounded-xl mb-5" />
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-5">
        <Skeleton className="h-[420px] rounded-xl" />
        <div className="flex flex-col gap-4">
          <Skeleton className="h-[260px] rounded-xl" />
          <Skeleton className="h-[260px] rounded-xl" />
        </div>
      </div>
      <span className="sr-only">Đang tải nội dung trang...</span>
    </div>
  );
}
