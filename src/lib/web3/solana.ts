import { clusterApiUrl } from "@solana/web3.js";

/**
 * Cấu hình Solana cluster.
 *
 * Mặc định dùng "mainnet-beta" public RPC (rate-limited, chỉ phù hợp dev/demo).
 * Production nên dùng RPC riêng: Helius, QuickNode, Triton, hoặc Alchemy.
 *
 * .env.local:
 *   NEXT_PUBLIC_SOLANA_RPC_URL=https://your-rpc-provider.com/...
 *   NEXT_PUBLIC_SOLANA_NETWORK=mainnet-beta | devnet
 */

export const SOLANA_NETWORK =
  (process.env.NEXT_PUBLIC_SOLANA_NETWORK as "mainnet-beta" | "devnet" | "testnet") || "mainnet-beta";

export const SOLANA_RPC_URL =
  process.env.NEXT_PUBLIC_SOLANA_RPC_URL || clusterApiUrl(SOLANA_NETWORK);
