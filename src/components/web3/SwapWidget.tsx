"use client";
import { useState, useMemo } from "react";
import { useAccount } from "wagmi";
import { useWallet } from "@solana/wallet-adapter-react";
import { useSwapQuote } from "@/hooks/useSwapQuote";
import { ArrowDownUp, Info, Loader2 } from "lucide-react";

// Token phổ biến để demo (địa chỉ thật trên Ethereum mainnet / Solana mainnet-beta)
const EVM_TOKENS = [
  { symbol: "ETH",  address: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE", decimals: 18 }, // native placeholder (1inch dùng địa chỉ này cho ETH)
  { symbol: "USDC", address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48", decimals: 6 },
  { symbol: "USDT", address: "0xdAC17F958D2ee523a2206206994597C13D831ec7", decimals: 6 },
];

const SOL_TOKENS = [
  { symbol: "SOL",  address: "So11111111111111111111111111111111111111112", decimals: 9 },
  { symbol: "USDC", address: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v", decimals: 6 },
];

/**
 * Widget swap demo — lấy quote thực từ Jupiter (Solana) hoặc 1inch (EVM, cần API key).
 * KHÔNG thực hiện giao dịch swap thật ở phiên bản này — chỉ hiển thị quote.
 * Để thực thi swap, cần thêm bước build & gửi transaction qua wallet (wagmi useSendTransaction /
 * Solana wallet-adapter sendTransaction) — xem ghi chú trong README.
 */
export function SwapWidget() {
  const { isConnected: evmConnected, chainId } = useAccount();
  const { connected: solConnected } = useWallet();

  const [chain, setChain] = useState<"evm" | "solana">(solConnected ? "solana" : "evm");
  const tokens = chain === "evm" ? EVM_TOKENS : SOL_TOKENS;

  const [fromIdx, setFromIdx] = useState(0);
  const [toIdx, setToIdx] = useState(1);
  const [amount, setAmount] = useState("1");

  const fromToken = tokens[fromIdx];
  const toToken = tokens[toIdx];

  const rawAmount = useMemo(() => {
    const n = Number(amount);
    if (isNaN(n) || n <= 0) return "0";
    return Math.floor(n * 10 ** fromToken.decimals).toString();
  }, [amount, fromToken.decimals]);

  const { quote, isLoading, error } = useSwapQuote({
    chain,
    from: fromToken.address,
    to: toToken.address,
    amount: rawAmount,
    chainId: chain === "evm" ? chainId : undefined,
  });

  const displayToAmount = quote && Number(quote.toAmount) > 0
    ? (Number(quote.toAmount) / 10 ** toToken.decimals).toFixed(6)
    : "—";

  function flip() {
    setFromIdx(toIdx);
    setToIdx(fromIdx);
  }

  const anyConnected = evmConnected || solConnected;

  return (
    <div className="bg-white dark:bg-gray-900 border border-green-100 dark:border-gray-800 rounded-xl overflow-hidden">
      <div className="px-4 py-3.5 border-b border-green-100 dark:border-gray-800 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-50">Swap (Quote)</h2>
        <div className="flex gap-1 bg-green-50 dark:bg-gray-800 rounded-lg p-0.5">
          {(["evm", "solana"] as const).map(c => (
            <button
              key={c}
              onClick={() => { setChain(c); setFromIdx(0); setToIdx(1); }}
              className={`text-[11px] font-semibold px-2.5 py-1 rounded-md transition-colors ${
                chain === c ? "bg-white dark:bg-gray-900 text-green-600 dark:text-green-400 shadow-sm" : "text-gray-500 dark:text-gray-400"
              }`}
            >
              {c === "evm" ? "EVM" : "Solana"}
            </button>
          ))}
        </div>
      </div>

      <div className="p-4 space-y-3">
        {/* From */}
        <div className="bg-green-50 dark:bg-gray-800 rounded-lg p-3">
          <label className="text-[11px] text-gray-400 dark:text-gray-500 block mb-1" htmlFor="swap-from-amount">Từ</label>
          <div className="flex items-center gap-2">
            <input
              id="swap-from-amount"
              type="number"
              min="0"
              step="any"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              className="bg-transparent text-lg font-mono font-semibold text-gray-900 dark:text-gray-50 outline-none w-full"
              aria-label="Số lượng muốn swap"
            />
            <select
              value={fromIdx}
              onChange={e => setFromIdx(Number(e.target.value))}
              className="bg-white dark:bg-gray-900 border border-green-200 dark:border-gray-700 rounded-md px-2 py-1 text-sm font-semibold text-gray-700 dark:text-gray-300"
              aria-label="Token nguồn"
            >
              {tokens.map((t, i) => (
                <option key={t.symbol} value={i} disabled={i === toIdx}>{t.symbol}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Flip button */}
        <div className="flex justify-center">
          <button
            onClick={flip}
            aria-label="Đảo chiều swap"
            className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300 flex items-center justify-center hover:bg-green-200 dark:hover:bg-green-800 transition-colors"
          >
            <ArrowDownUp size={14} aria-hidden="true" />
          </button>
        </div>

        {/* To */}
        <div className="bg-green-50 dark:bg-gray-800 rounded-lg p-3">
          <label className="text-[11px] text-gray-400 dark:text-gray-500 block mb-1">Nhận (ước tính)</label>
          <div className="flex items-center gap-2">
            <div className="text-lg font-mono font-semibold text-gray-900 dark:text-gray-50 flex-1">
              {isLoading ? <Loader2 size={18} className="animate-spin text-gray-400" aria-hidden="true" /> : displayToAmount}
            </div>
            <span className="bg-white dark:bg-gray-900 border border-green-200 dark:border-gray-700 rounded-md px-2 py-1 text-sm font-semibold text-gray-700 dark:text-gray-300">
              {toToken.symbol}
            </span>
          </div>
        </div>

        {error && <p className="text-xs text-red-500">Không thể lấy quote: {String(error)}</p>}

        {quote?.note && (
          <div className="flex items-start gap-2 text-[11px] text-gray-400 dark:text-gray-500 bg-green-50 dark:bg-gray-800 rounded-lg p-2.5">
            <Info size={13} className="shrink-0 mt-0.5" aria-hidden="true" />
            <span>{quote.note}</span>
          </div>
        )}

        <button
          disabled={!anyConnected}
          className="w-full bg-green-500 hover:bg-green-600 disabled:bg-gray-200 dark:disabled:bg-gray-800 disabled:text-gray-400 text-white rounded-lg py-2.5 text-sm font-semibold transition-colors"
        >
          {anyConnected ? "Xem chi tiết giao dịch (demo)" : "Kết nối ví để swap"}
        </button>
        <p className="text-[10px] text-gray-300 dark:text-gray-600 text-center">
          Đây là quote tham khảo. Chức năng ký & gửi giao dịch swap chưa được kích hoạt trong bản demo này.
        </p>
      </div>
    </div>
  );
}
