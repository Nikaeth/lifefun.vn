"use client";
import { useState } from "react";
import { useRewards } from "@/hooks/useRewards";
import { Gift, Sparkles, Loader2 } from "lucide-react";
import Link from "next/link";

const EVENT_LABEL: Record<string, string> = {
  daily_login: "Check-in hàng ngày",
  read_news: "Đọc tin tức",
  connect_wallet: "Kết nối ví lần đầu",
  referral: "Giới thiệu bạn bè",
  redeem: "Đổi điểm",
};

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "vừa xong";
  if (mins < 60) return `${mins} phút trước`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} giờ trước`;
  return `${Math.floor(hours / 24)} ngày trước`;
}

/**
 * Badge điểm thưởng trên header. Chỉ hiển thị khi người dùng đã đăng nhập SIWE.
 * Click để mở dropdown: check-in nhanh + 3 hoạt động gần nhất.
 */
export function RewardsWidget() {
  const [open, setOpen] = useState(false);
  const { isLoggedIn, totalPoints, events, canCheckIn, isCheckingIn, actionError, checkIn, isLoading } = useRewards();

  if (!isLoggedIn || isLoading) return null;

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(v => !v)}
        aria-expanded={open}
        aria-haspopup="dialog"
        className="flex items-center gap-1.5 bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-900 rounded-lg px-2.5 py-1.5 text-sm font-semibold text-yellow-700 dark:text-yellow-300 transition-colors hover:bg-yellow-100 dark:hover:bg-yellow-900"
      >
        <Sparkles size={14} aria-hidden="true" />
        <span className="font-mono">{totalPoints}</span>
        <span className="hidden sm:inline text-xs">điểm</span>
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} aria-hidden="true" />
          <div
            role="dialog"
            aria-label="LifeFun Points"
            className="absolute right-0 top-full mt-2 w-72 bg-white dark:bg-gray-900 border border-green-100 dark:border-gray-800 rounded-xl shadow-xl z-50 p-4"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Gift className="text-yellow-500" size={18} aria-hidden="true" />
                <span className="text-sm font-bold text-gray-900 dark:text-gray-50">LifeFun Points</span>
              </div>
              <span className="font-mono text-lg font-bold text-green-600 dark:text-green-400">{totalPoints}</span>
            </div>

            {canCheckIn ? (
              <button
                onClick={checkIn}
                disabled={isCheckingIn}
                className="w-full flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white rounded-lg py-2 text-sm font-semibold transition-colors disabled:opacity-60 mb-3"
              >
                {isCheckingIn && <Loader2 size={14} className="animate-spin" aria-hidden="true" />}
                {isCheckingIn ? "Đang xử lý..." : "Check-in hôm nay (+10 điểm)"}
              </button>
            ) : (
              <div className="text-center text-xs text-gray-400 dark:text-gray-500 bg-green-50 dark:bg-gray-800 rounded-lg py-2 mb-3">
                ✓ Đã check-in hôm nay — quay lại vào ngày mai!
              </div>
            )}

            {actionError && <p className="text-[11px] text-red-500 mb-2">{actionError}</p>}

            {events.length > 0 && (
              <div className="space-y-1.5 mb-3">
                <p className="text-[11px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide">Hoạt động gần đây</p>
                {events.slice(0, 3).map((e, i) => (
                  <div key={i} className="flex items-center justify-between text-xs">
                    <span className="text-gray-600 dark:text-gray-300">{EVENT_LABEL[e.type] || e.type}</span>
                    <span className={`font-mono font-semibold ${e.points >= 0 ? "text-green-600 dark:text-green-400" : "text-red-500"}`}>
                      {e.points >= 0 ? "+" : ""}{e.points}
                    </span>
                  </div>
                ))}
                <span className="sr-only">{events[0] && `Gần nhất: ${EVENT_LABEL[events[0].type]} ${timeAgo(events[0].timestamp)}`}</span>
              </div>
            )}

            <Link
              href="/rewards"
              onClick={() => setOpen(false)}
              className="block text-center text-xs text-green-600 dark:text-green-400 hover:underline"
            >
              Xem tất cả & đổi quà →
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
