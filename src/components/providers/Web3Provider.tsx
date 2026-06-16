"use client";
import { useMemo, type ReactNode } from "react";
import { WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RainbowKitProvider, darkTheme, lightTheme } from "@rainbow-me/rainbowkit";
import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { PhantomWalletAdapter, SolflareWalletAdapter } from "@solana/wallet-adapter-wallets";
import { wagmiConfig } from "@/lib/web3/wagmi";
import { SOLANA_RPC_URL } from "@/lib/web3/solana";
import { useTheme } from "@/components/providers/ThemeProvider";

import "@rainbow-me/rainbowkit/styles.css";
import "@solana/wallet-adapter-react-ui/styles.css";

// Một số package Solana wallet-adapter khai báo type React hơi khác phiên bản
// @types/react đang dùng, gây lỗi type giả (không phải lỗi runtime thật).
// Ép kiểu về React.FC<any> để build qua được mà không ảnh hưởng hành vi thực tế.
import type { FC, PropsWithChildren } from "react";
const SafeConnectionProvider = ConnectionProvider as unknown as FC<PropsWithChildren<{ endpoint: string }>>;
const SafeWalletProvider = WalletProvider as unknown as FC<PropsWithChildren<{ wallets: unknown[]; autoConnect?: boolean }>>;
const SafeWalletModalProvider = WalletModalProvider as unknown as FC<PropsWithChildren<Record<string, never>>>;

/**
 * Bọc toàn bộ app với providers cho EVM (wagmi + RainbowKit) và Solana (wallet-adapter).
 * Đặt bên trong ThemeProvider để đồng bộ dark/light mode với RainbowKit modal.
 */
export function Web3Provider({ children }: { children: ReactNode }) {
  const queryClient = useMemo(() => new QueryClient(), []);
  const { theme } = useTheme();

  const solanaWallets = useMemo(
    () => [new PhantomWalletAdapter(), new SolflareWalletAdapter()],
    []
  );

  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          theme={theme === "dark" ? darkTheme({ accentColor: "#2E8B4A" }) : lightTheme({ accentColor: "#2E8B4A" })}
          locale="vi-VN"
        >
          <SafeConnectionProvider endpoint={SOLANA_RPC_URL}>
            <SafeWalletProvider wallets={solanaWallets} autoConnect>
              <SafeWalletModalProvider>{children}</SafeWalletModalProvider>
            </SafeWalletProvider>
          </SafeConnectionProvider>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
