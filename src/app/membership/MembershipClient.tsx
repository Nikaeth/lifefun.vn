"use client";
import { useAccount } from "wagmi";
import { useSiwe } from "@/hooks/useSiwe";
import { useMembership } from "@/hooks/useMembership";
import { WalletButton } from "@/components/web3/WalletButton";
import { Skeleton } from "@/components/ui/Skeleton";
import { Crown, Lock, CheckCircle2, AlertTriangle, Wallet } from "lucide-react";

const PERKS = [
  "Phân tích kỹ thuật chuyên sâu hàng tuần",
  "Cảnh báo giá realtime qua Telegram/Discord riêng",
  "Báo cáo on-chain độc quyền cho holder NFT",
  "Tham gia AMA với chuyên gia thị trường",
];

export default function MembershipClient() {
  const { isConnected } = useAccount();
  const { isLoggedIn, signIn, isSigningIn } = useSiwe();
  const { isMember, reason, balance, minBalance, note, isLoading } = useMembership();

  return (
    <div className="max-w-screen-xl mx-auto px-6 py-8">
      <div className="flex items-center gap-2 mb-2">
        <Crown className="text-green-500" size={22} aria-hidden="true" />
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-50">Khu vực thành viên</h1>
      </div>
      <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-2xl">
        Nội dung độc quyền dành cho holder NFT thành viên LifeFun.vn. Kết nối ví và đăng nhập bằng SIWE
        để hệ thống kiểm tra quyền truy cập tự động.
      </p>

      {/* Trạng thái truy cập */}
      <div className="bg-white dark:bg-gray-900 border border-green-100 dark:border-gray-800 rounded-xl p-5 mb-6">
        {!isConnected && (
          <div className="flex flex-col items-center text-center py-6">
            <Wallet className="text-gray-400 dark:text-gray-500 mb-3" size={28} aria-hidden="true" />
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">Kết nối ví EVM để kiểm tra quyền thành viên.</p>
            <WalletButton />
          </div>
        )}

        {isConnected && !isLoggedIn && (
          <div className="flex flex-col items-center text-center py-6">
            <Lock className="text-gray-400 dark:text-gray-500 mb-3" size={28} aria-hidden="true" />
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
              Đăng nhập bằng ví (SIWE) để xác thực địa chỉ trước khi kiểm tra NFT.
            </p>
            <button
              onClick={signIn}
              disabled={isSigningIn}
              className="bg-green-500 hover:bg-green-600 text-white rounded-lg px-5 py-2 text-sm font-semibold transition-colors disabled:opacity-60"
            >
              {isSigningIn ? "Đang chờ ký..." : "Đăng nhập bằng ví (SIWE)"}
            </button>
          </div>
        )}

        {isConnected && isLoggedIn && isLoading && (
          <div className="flex items-center gap-3 py-4">
            <Skeleton className="w-8 h-8 rounded-full" />
            <Skeleton className="h-4 w-48" />
          </div>
        )}

        {isConnected && isLoggedIn && !isLoading && (
          <div className="flex items-start gap-3 py-2">
            {isMember ? (
              <>
                <CheckCircle2 className="text-green-500 shrink-0 mt-0.5" size={22} aria-hidden="true" />
                <div>
                  <p className="text-sm font-semibold text-green-600 dark:text-green-400">
                    Bạn là thành viên! Đang sở hữu {balance}/{minBalance} NFT yêu cầu.
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Nội dung độc quyền đã được mở khoá bên dưới.</p>
                </div>
              </>
            ) : (
              <>
                <AlertTriangle className="text-yellow-500 shrink-0 mt-0.5" size={22} aria-hidden="true" />
                <div>
                  <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    {reason === "not_configured"
                      ? "Token-gating chưa được cấu hình"
                      : reason === "unsupported_chain"
                      ? "Chuỗi không được hỗ trợ cho kiểm tra NFT"
                      : "Bạn chưa sở hữu NFT thành viên"}
                  </p>
                  {note && <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{note}</p>}
                  {reason === "not_configured" || !reason ? null : (
                    <a
                      href="https://opensea.io"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block mt-2 text-xs text-green-600 dark:text-green-400 hover:underline"
                    >
                      Tìm hiểu cách sở hữu NFT thành viên →
                    </a>
                  )}
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* Nội dung độc quyền (blur nếu chưa phải member) */}
      <div className="relative">
        <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 ${!isMember ? "blur-sm select-none pointer-events-none" : ""}`} aria-hidden={!isMember}>
          {PERKS.map((perk, i) => (
            <div key={i} className="bg-white dark:bg-gray-900 border border-green-100 dark:border-gray-800 rounded-xl p-5 flex items-start gap-3">
              <Crown className="text-green-400 shrink-0" size={20} aria-hidden="true" />
              <div>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-50 mb-1">Đặc quyền #{i + 1}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{perk}</p>
              </div>
            </div>
          ))}
        </div>

        {!isMember && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur px-6 py-4 rounded-xl border border-green-100 dark:border-gray-800 text-center">
              <Lock className="mx-auto mb-2 text-gray-400 dark:text-gray-500" size={24} aria-hidden="true" />
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Nội dung dành riêng cho thành viên</p>
            </div>
          </div>
        )}
      </div>

      <div className="mt-6 bg-green-50 dark:bg-gray-900 border border-green-100 dark:border-gray-800 rounded-xl p-4 text-xs text-gray-500 dark:text-gray-400">
        <p className="font-semibold text-gray-700 dark:text-gray-300 mb-1">Cấu hình Token-Gating</p>
        <p>
          Đặt <code className="font-mono">MEMBERSHIP_NFT_CONTRACT</code> và{" "}
          <code className="font-mono">MEMBERSHIP_MIN_BALANCE</code> trong <code className="font-mono">.env.local</code>{" "}
          để kiểm tra số dư NFT (ERC-721) thực tế trên Ethereum mainnet. Xem README để biết chi tiết và cách mở rộng
          sang ERC-1155 hoặc các chain khác.
        </p>
      </div>
    </div>
  );
}
