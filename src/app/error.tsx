"use client";
import { useEffect } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

/**
 * Error boundary cho App Router. Bắt lỗi runtime trong cây route hiện tại
 * (ví dụ: lỗi render component, lỗi fetch không được catch trong server component).
 */
export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error("[App Error]", error);
  }, [error]);

  return (
    <div className="max-w-screen-xl mx-auto px-6 py-20 flex flex-col items-center text-center">
      <div className="w-14 h-14 rounded-full bg-red-100 dark:bg-red-900 flex items-center justify-center mb-4">
        <AlertTriangle className="text-red-500 dark:text-red-300" size={26} aria-hidden="true" />
      </div>
      <h1 className="text-xl font-bold text-gray-900 dark:text-gray-50 mb-2">Đã có lỗi xảy ra</h1>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 max-w-md">
        Rất tiếc, đã có lỗi khi tải nội dung này. Vui lòng thử lại sau, hoặc quay về trang chủ.
        {error.digest && (
          <span className="block mt-2 text-[11px] text-gray-400 dark:text-gray-600 font-mono">
            Mã lỗi: {error.digest}
          </span>
        )}
      </p>
      <div className="flex gap-3">
        <button
          onClick={reset}
          className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white rounded-lg px-4 py-2 text-sm font-semibold transition-colors"
        >
          <RefreshCw size={14} aria-hidden="true" />
          Thử lại
        </button>
        <a
          href="/"
          className="flex items-center gap-2 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 rounded-lg px-4 py-2 text-sm font-semibold hover:border-green-400 transition-colors"
        >
          Về trang chủ
        </a>
      </div>
    </div>
  );
}
