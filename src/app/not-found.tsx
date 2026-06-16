import Link from "next/link";
import { Home, Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="max-w-screen-xl mx-auto px-6 py-20 flex flex-col items-center text-center">
      <div className="text-6xl font-bold text-green-200 dark:text-green-900 mb-2 font-mono">404</div>
      <h1 className="text-xl font-bold text-gray-900 dark:text-gray-50 mb-2">Không tìm thấy trang</h1>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 max-w-md">
        Trang bạn tìm không tồn tại hoặc đã bị di chuyển. Hãy quay lại trang chủ hoặc tìm kiếm thông tin bạn cần.
      </p>
      <div className="flex gap-3">
        <Link
          href="/"
          className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white rounded-lg px-4 py-2 text-sm font-semibold transition-colors"
        >
          <Home size={14} aria-hidden="true" />
          Về trang chủ
        </Link>
        <Link
          href="/tin-tuc"
          className="flex items-center gap-2 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 rounded-lg px-4 py-2 text-sm font-semibold hover:border-green-400 transition-colors"
        >
          <Search size={14} aria-hidden="true" />
          Xem tin tức
        </Link>
      </div>
    </div>
  );
}
