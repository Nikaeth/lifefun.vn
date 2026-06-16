"use client";
import { useState } from "react";
import { useAccount } from "wagmi";
import { useSiwe } from "@/hooks/useSiwe";
import { useRewards } from "@/hooks/useRewards";
import { WalletButton } from "@/components/web3/WalletButton";
import { Skeleton } from "@/components/ui/Skeleton";
import { Gift, Sparkles, Award, Loader2, Wallet, Lock, CheckCircle2 } from "lucide-react";

const EVENT_LABEL: Record<string, string> = {
  daily_login: "Check-in hàng ngày",
  read_news: "Đọc tin tức",
  connect_wallet: "Kết nối ví lần đầu",
  referral: "Giới thiệu bạn bè",
  redeem: "Đổi điểm thưởng",
};

const TIER_ICON: Record<string, string> = {
  badge_bronze: "🥉",
  badge_silver: "🥈",
  badge_gold: "🥇",
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

export default function RewardsClient() {
  const { isConnected } = useAccount();
  const { isLoggedIn: siweLoggedIn, signIn, isSigningIn } = useSiwe();
  const {
    isLoggedIn, totalPoints, events, canCheckIn, tiers,
    isLoading, isCheckingIn, actionError, checkIn, redeem,
  } = useRewards();
  const [redeeming, setRedeeming] = useState<string | null>(null);
  const [redeemMsg, setRedeemMsg] = useState<string | null>(null);

  async function handleRedeem(tierId: string) {
    setRedeeming(tierId);
    setRedeemMsg(null);
    const result = await redeem(tierId);
    if (result?.ok) setRedeemMsg(`Đã đổi: ${result.redeemed}!`);
    setRedeeming(null);
  }

  return (
    <div className="max-w-screen-xl mx-auto px-6 py-8">
      <div className="flex items-center gap-2 mb-2">
        <Gift className="text-yellow-500" size={22} aria-hidden="true" />
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-50">LifeFun Points</h1>
      </div>
      <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-2xl">
        Hệ thống điểm thưởng nội bộ cho hoạt động trên LifeFun.vn. Đây <strong>không phải</strong> token
        hoặc tài sản số — điểm không có giá trị quy đổi tiền tệ và chỉ dùng để mở khoá huy hiệu/đặc quyền
        trên nền tảng.
      </p>

      {/* Trạng thái đăng nhập */}
      {!isConnected && (
        <div className="bg-white dark:bg-gray-900 border border-green-100 dark:border-gray-800 rounded-xl p-10 flex flex-col items-center text-center mb-6">
          <Wallet className="text-gray-400 dark:text-gray-500 mb-3" size={28} aria-hidden="true" />
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">Kết nối ví để bắt đầu kiếm điểm.</p>
          <WalletButton />
        </div>
      )}

      {isConnected && !siweLoggedIn && (
        <div className="bg-white dark:bg-gray-900 border border-green-100 dark:border-gray-800 rounded-xl p-10 flex flex-col items-center text-center mb-6">
          <Lock className="text-gray-400 dark:text-gray-500 mb-3" size={28} aria-hidden="true" />
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">Đăng nhập bằng ví (SIWE) để theo dõi điểm thưởng.</p>
          <button
            onClick={signIn}
            disabled={isSigningIn}
            className="bg-green-500 hover:bg-green-600 text-white rounded-lg px-5 py-2 text-sm font-semibold transition-colors disabled:opacity-60"
          >
            {isSigningIn ? "Đang chờ ký..." : "Đăng nhập bằng ví (SIWE)"}
          </button>
        </div>
      )}

      {isLoggedIn && (
        <>
          {/* Tổng điểm + check-in */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white dark:bg-gray-900 border border-green-100 dark:border-gray-800 rounded-xl p-5 flex flex-col items-center justify-center">
              <Sparkles className="text-yellow-500 mb-2" size={24} aria-hidden="true" />
              {isLoading ? <Skeleton className="h-8 w-20" /> : (
                <div className="text-3xl font-mono font-bold text-gray-900 dark:text-gray-50">{totalPoints}</div>
              )}
              <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">Tổng điểm hiện có</div>
            </div>

            <div className="md:col-span-2 bg-white dark:bg-gray-900 border border-green-100 dark:border-gray-800 rounded-xl p-5 flex flex-col items-center justify-center text-center">
              {canCheckIn ? (
                <>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">Check-in hôm nay để nhận điểm thưởng!</p>
                  <button
                    onClick={checkIn}
                    disabled={isCheckingIn}
                    className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white rounded-lg px-5 py-2 text-sm font-semibold transition-colors disabled:opacity-60"
                  >
                    {isCheckingIn && <Loader2 size={14} className="animate-spin" aria-hidden="true" />}
                    {isCheckingIn ? "Đang xử lý..." : "Check-in (+10 điểm)"}
                  </button>
                </>
              ) : (
                <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                  <CheckCircle2 size={20} aria-hidden="true" />
                  <span className="text-sm font-medium">Đã check-in hôm nay — quay lại vào ngày mai!</span>
                </div>
              )}
              {actionError && <p className="text-xs text-red-500 mt-2">{actionError}</p>}
            </div>
          </div>

          {/* Cách kiếm điểm */}
          <div className="bg-white dark:bg-gray-900 border border-green-100 dark:border-gray-800 rounded-xl p-5 mb-6">
            <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-50 mb-3">Cách kiếm điểm</h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-600 dark:text-gray-300">
              <li className="flex justify-between border-b border-green-50 dark:border-gray-800 pb-1.5">
                <span>Check-in hàng ngày</span><span className="font-mono font-semibold text-green-600 dark:text-green-400">+10</span>
              </li>
              <li className="flex justify-between border-b border-green-50 dark:border-gray-800 pb-1.5">
                <span>Đọc tin tức (tối đa 5/ngày)</span><span className="font-mono font-semibold text-green-600 dark:text-green-400">+2</span>
              </li>
              <li className="flex justify-between border-b border-green-50 dark:border-gray-800 pb-1.5">
                <span>Kết nối ví lần đầu</span><span className="font-mono font-semibold text-green-600 dark:text-green-400">+20</span>
              </li>
              <li className="flex justify-between border-b border-green-50 dark:border-gray-800 pb-1.5">
                <span>Giới thiệu bạn bè</span><span className="font-mono font-semibold text-green-600 dark:text-green-400">+50</span>
              </li>
            </ul>
          </div>

          {/* Đổi điểm */}
          <div className="mb-6">
            <h2 className="text-lg font-bold text-gray-900 dark:text-gray-50 flex items-center gap-2 mb-4 before:block before:w-1 before:h-5 before:rounded before:bg-yellow-400">
              Đổi điểm thưởng
            </h2>
            {redeemMsg && (
              <div className="mb-3 text-sm text-green-600 dark:text-green-400 bg-green-50 dark:bg-gray-800 rounded-lg p-3">
                ✓ {redeemMsg}
              </div>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {tiers.map(tier => {
                const canAfford = totalPoints >= tier.cost;
                return (
                  <div key={tier.id} className="bg-white dark:bg-gray-900 border border-green-100 dark:border-gray-800 rounded-xl p-5 text-center">
                    <div className="text-3xl mb-2">{TIER_ICON[tier.id] || <Award className="mx-auto" />}</div>
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-50 mb-1">{tier.label}</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">{tier.description}</p>
                    <div className="font-mono text-sm font-bold text-gray-900 dark:text-gray-50 mb-3">{tier.cost} điểm</div>
                    <button
                      onClick={() => handleRedeem(tier.id)}
                      disabled={!canAfford || redeeming === tier.id}
                      className="w-full bg-green-500 hover:bg-green-600 disabled:bg-gray-200 dark:disabled:bg-gray-800 disabled:text-gray-400 text-white rounded-lg py-2 text-sm font-semibold transition-colors"
                    >
                      {redeeming === tier.id ? "Đang xử lý..." : canAfford ? "Đổi ngay" : "Chưa đủ điểm"}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Lịch sử */}
          {events.length > 0 && (
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-gray-50 flex items-center gap-2 mb-4 before:block before:w-1 before:h-5 before:rounded before:bg-green-400">
                Lịch sử hoạt động
              </h2>
              <div className="bg-white dark:bg-gray-900 border border-green-100 dark:border-gray-800 rounded-xl overflow-hidden">
                <ul className="divide-y divide-green-50 dark:divide-gray-800 list-none">
                  {events.map((e, i) => (
                    <li key={i} className="flex items-center justify-between px-4 py-3 text-sm">
                      <div>
                        <span className="text-gray-700 dark:text-gray-300">{EVENT_LABEL[e.type] || e.type}</span>
                        <span className="text-xs text-gray-400 dark:text-gray-500 ml-2">{timeAgo(e.timestamp)}</span>
                      </div>
                      <span className={`font-mono font-semibold ${e.points >= 0 ? "text-green-600 dark:text-green-400" : "text-red-500"}`}>
                        {e.points >= 0 ? "+" : ""}{e.points}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </>
      )}

      {/* Disclaimer */}
      <div className="mt-8 bg-green-50 dark:bg-gray-900 border border-green-100 dark:border-gray-800 rounded-xl p-4 text-xs text-gray-500 dark:text-gray-400">
        <p className="font-semibold text-gray-700 dark:text-gray-300 mb-1">Lưu ý quan trọng</p>
        <p>
          LifeFun Points là điểm tích lũy nội bộ, <strong>không phải tiền điện tử, token hoặc tài sản số</strong>,
          không thể chuyển nhượng, mua bán hoặc quy đổi thành tiền mặt. Điểm được lưu off-chain (tạm thời
          trong bộ nhớ server cho bản demo — production cần database thật). Tham khảo README phần
          &ldquo;Hệ thống điểm thưởng&rdquo; để biết cách mở rộng hoặc tích hợp on-chain trong tương lai.
        </p>
      </div>
    </div>
  );
}
