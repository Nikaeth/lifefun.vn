"use client";
import { useState } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useSiwe } from "@/hooks/useSiwe";
import { Wallet, ChevronDown, LogOut, Loader2 } from "lucide-react";

type ChainTab = "evm" | "solana";

function truncate(addr: string, len = 4): string {
  return `${addr.slice(0, len + 2)}...${addr.slice(-len)}`;
}

/**
 * Nút "Connect Wallet" tổng hợp: hỗ trợ EVM (qua RainbowKit) và Solana
 * (qua wallet-adapter), kèm flow Sign-In with Ethereum (SIWE) cho EVM.
 */
export function WalletButton() {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<ChainTab>("evm");

  const { isConnected: evmConnected, address: evmAddress } = useAccount();
  const { connected: solConnected, publicKey: solPubkey } = useWallet();
  const { isLoggedIn, signIn, signOut, isSigningIn, error } = useSiwe();

  const anyConnected = evmConnected || solConnected;

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(v => !v)}
        aria-expanded={open}
        aria-haspopup="dialog"
        className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-semibold transition-colors ${
          anyConnected
            ? "bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300"
            : "bg-green-500 hover:bg-green-600 text-white"
        }`}
      >
        <Wallet size={15} aria-hidden="true" />
        <span className="hidden sm:inline">
          {evmConnected && evmAddress
            ? truncate(evmAddress)
            : solConnected && solPubkey
            ? truncate(solPubkey.toBase58())
            : "Kết nối ví"}
        </span>
        <ChevronDown size={14} aria-hidden="true" />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} aria-hidden="true" />
          <div
            role="dialog"
            aria-label="Kết nối ví điện tử"
            className="absolute right-0 top-full mt-2 w-80 bg-white dark:bg-gray-900 border border-green-100 dark:border-gray-800 rounded-xl shadow-xl z-50 p-4"
          >
            {/* Tabs */}
            <div className="flex gap-1 mb-4 bg-green-50 dark:bg-gray-800 rounded-lg p-1" role="tablist">
              <button
                role="tab"
                aria-selected={tab === "evm"}
                onClick={() => setTab("evm")}
                className={`flex-1 text-xs font-semibold py-1.5 rounded-md transition-colors ${
                  tab === "evm" ? "bg-white dark:bg-gray-900 text-green-600 dark:text-green-400 shadow-sm" : "text-gray-500 dark:text-gray-400"
                }`}
              >
                EVM (ETH, BSC, Polygon)
              </button>
              <button
                role="tab"
                aria-selected={tab === "solana"}
                onClick={() => setTab("solana")}
                className={`flex-1 text-xs font-semibold py-1.5 rounded-md transition-colors ${
                  tab === "solana" ? "bg-white dark:bg-gray-900 text-green-600 dark:text-green-400 shadow-sm" : "text-gray-500 dark:text-gray-400"
                }`}
              >
                Solana
              </button>
            </div>

            {/* EVM tab */}
            {tab === "evm" && (
              <div className="space-y-3">
                <ConnectButton.Custom>
                  {({ account, chain, openConnectModal, openAccountModal, openChainModal, mounted }) => {
                    if (!mounted) return null;
                    if (!account || !chain) {
                      return (
                        <button
                          onClick={openConnectModal}
                          className="w-full bg-green-500 hover:bg-green-600 text-white rounded-lg py-2 text-sm font-semibold transition-colors"
                        >
                          Kết nối MetaMask / WalletConnect
                        </button>
                      );
                    }
                    return (
                      <div className="space-y-2">
                        <button
                          onClick={openChainModal}
                          className="w-full flex items-center justify-between text-xs border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-gray-600 dark:text-gray-300"
                        >
                          <span>Mạng: {chain.name}</span>
                          <ChevronDown size={12} aria-hidden="true" />
                        </button>
                        <button
                          onClick={openAccountModal}
                          className="w-full flex items-center justify-between text-xs border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-gray-600 dark:text-gray-300"
                        >
                          <span className="font-mono">{truncate(account.address, 6)}</span>
                          <span>{account.displayBalance}</span>
                        </button>
                      </div>
                    );
                  }}
                </ConnectButton.Custom>

                {/* SIWE Sign-In */}
                {evmConnected && (
                  <div className="border-t border-green-50 dark:border-gray-800 pt-3">
                    {isLoggedIn ? (
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-green-600 dark:text-green-400 font-medium">✓ Đã đăng nhập (SIWE)</span>
                        <button
                          onClick={signOut}
                          className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 hover:text-red-500"
                        >
                          <LogOut size={12} aria-hidden="true" /> Đăng xuất
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={signIn}
                        disabled={isSigningIn}
                        className="w-full flex items-center justify-center gap-2 border border-green-400 dark:border-green-700 text-green-600 dark:text-green-400 rounded-lg py-2 text-sm font-semibold hover:bg-green-50 dark:hover:bg-gray-800 transition-colors disabled:opacity-60"
                      >
                        {isSigningIn && <Loader2 size={14} className="animate-spin" aria-hidden="true" />}
                        {isSigningIn ? "Đang chờ ký..." : "Đăng nhập bằng ví (SIWE)"}
                      </button>
                    )}
                    {error && <p className="text-[11px] text-red-500 mt-1">{error}</p>}
                  </div>
                )}
              </div>
            )}

            {/* Solana tab */}
            {tab === "solana" && (
              <div className="space-y-2">
                <div className="wallet-adapter-wrapper">
                  <WalletMultiButton style={{ width: "100%", justifyContent: "center" }} />
                </div>
                <p className="text-[11px] text-gray-400 dark:text-gray-500">
                  Hỗ trợ Phantom, Solflare. Sign-In with Solana (SIWS) chưa được kích hoạt — chỉ hiển thị địa chỉ và số dư.
                </p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
