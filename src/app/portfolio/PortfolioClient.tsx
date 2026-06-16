"use client";
import { useAccount } from "wagmi";
import { useWallet } from "@solana/wallet-adapter-react";
import { usePortfolio } from "@/hooks/usePortfolio";
import { Skeleton } from "@/components/ui/Skeleton";
import { WalletButton } from "@/components/web3/WalletButton";
import { SwapWidget } from "@/components/web3/SwapWidget";
import { Wallet, AlertCircle } from "lucide-react";

function PortfolioCard({ address, chain, label }: { address: string; chain: "evm" | "solana"; label: string }) {
  const { portfolio, isLoading, error } = usePortfolio(address, chain);

  return (
    <div className="bg-white dark:bg-gray-900 border border-green-100 dark:border-gray-800 rounded-xl overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3.5 border-b border-green-100 dark:border-gray-800">
        <span className="text-sm font-semibold text-gray-900 dark:text-gray-50">{label}</span>
        <span className="text-[11px] font-mono text-gray-400 dark:text-gray-500">
          {address.slice(0, 6)}...{address.slice(-4)}
        </span>
      </div>

      {isLoading && (
        <div className="p-4 space-y-3" role="status" aria-label="Đang tải portfolio">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      )}

      {!isLoading && error && (
        <div className="p-4 flex items-start gap-2 text-sm text-red-500 dark:text-red-300">
          <AlertCircle size={16} className="shrink-0 mt-0.5" aria-hidden="true" />
          <span>Không thể tải portfolio. Vui lòng thử lại sau.</span>
        </div>
      )}

      {!isLoading && portfolio && !error && (
        <div className="p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-lg font-semibold font-mono text-gray-900 dark:text-gray-50">
                {Number(portfolio.nativeBalance.balance).toFixed(6)} {portfolio.nativeBalance.symbol}
              </div>
              <div className="text-xs text-gray-400 dark:text-gray-500">{portfolio.nativeBalance.name} (native)</div>
            </div>
          </div>

          {portfolio.tokens.length > 0 ? (
            <ul className="space-y-2">
              {portfolio.tokens.map(t => (
                <li key={t.symbol} className="flex justify-between text-sm">
                  <span className="text-gray-700 dark:text-gray-300">{t.name}</span>
                  <span className="font-mono text-gray-900 dark:text-gray-50">{t.balance} {t.symbol}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-gray-400 dark:text-gray-500 border-t border-green-50 dark:border-gray-800 pt-2">
              Chưa có dữ liệu token. {portfolio.note}
            </p>
          )}

          <p className="text-[10px] text-gray-300 dark:text-gray-600">Nguồn: {portfolio.source}</p>
        </div>
      )}
    </div>
  );
}

export default function PortfolioClient() {
  const { isConnected: evmConnected, address: evmAddress } = useAccount();
  const { connected: solConnected, publicKey: solPubkey } = useWallet();

  const anyConnected = evmConnected || solConnected;

  return (
    <div className="max-w-screen-xl mx-auto px-6 py-8">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-50 mb-2">Portfolio</h1>
      <p className="text-gray-500 dark:text-gray-400 mb-6">
        Xem số dư ví crypto của bạn trên Ethereum và Solana. Kết nối ví để bắt đầu.
      </p>

      {!anyConnected ? (
        <div className="bg-white dark:bg-gray-900 border border-green-100 dark:border-gray-800 rounded-xl p-10 flex flex-col items-center text-center">
          <div className="w-14 h-14 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center mb-4">
            <Wallet className="text-green-600 dark:text-green-300" size={26} aria-hidden="true" />
          </div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-50 mb-2">Chưa kết nối ví</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 max-w-md">
            Kết nối ví MetaMask, WalletConnect, Phantom hoặc Solflare để xem số dư và danh sách token của bạn.
          </p>
          <WalletButton />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {evmConnected && evmAddress && (
            <PortfolioCard address={evmAddress} chain="evm" label="Ethereum (EVM)" />
          )}
          {solConnected && solPubkey && (
            <PortfolioCard address={solPubkey.toBase58()} chain="solana" label="Solana" />
          )}
          <SwapWidget />
        </div>
      )}

      <div className="mt-6 bg-green-50 dark:bg-gray-900 border border-green-100 dark:border-gray-800 rounded-xl p-4 text-xs text-gray-500 dark:text-gray-400">
        <p className="font-semibold text-gray-700 dark:text-gray-300 mb-1">Lưu ý kỹ thuật</p>
        <p>
          Hiện tại chỉ hiển thị số dư native (ETH/SOL) qua RPC công khai. Để hiển thị đầy đủ danh sách token
          ERC-20/SPL và giá trị USD, cần tích hợp Alchemy/Covalent/Moralis (EVM) hoặc Helius DAS API (Solana).
          Xem chi tiết trong README phần &ldquo;Portfolio API&rdquo;.
        </p>
      </div>
    </div>
  );
}
