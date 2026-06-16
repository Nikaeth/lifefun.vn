"use client";
import { useState, useCallback, useEffect } from "react";
import { useAccount, useSignMessage, useChainId } from "wagmi";
import { SiweMessage } from "siwe";
import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then(r => r.json());

interface SessionResponse {
  isLoggedIn: boolean;
  address?: string;
  chain?: "evm" | "solana";
  chainId?: number;
}

/**
 * Hook quản lý flow Sign-In with Ethereum (SIWE / EIP-4361).
 *
 * Dùng: const { session, signIn, signOut, isSigningIn } = useSiwe();
 */
export function useSiwe() {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const { signMessageAsync } = useSignMessage();
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { data: session, mutate } = useSWR<SessionResponse>("/api/auth/session", fetcher);

  const signIn = useCallback(async () => {
    if (!address) return;
    setIsSigningIn(true);
    setError(null);

    try {
      // 1. Lấy nonce từ server
      const nonceRes = await fetch("/api/auth/nonce");
      const { nonce } = await nonceRes.json();

      // 2. Tạo message SIWE theo chuẩn EIP-4361
      const message = new SiweMessage({
        domain: window.location.host,
        address,
        statement: "Đăng nhập vào LifeFun.vn bằng ví của bạn.",
        uri: window.location.origin,
        version: "1",
        chainId,
        nonce,
      });

      const messageToSign = message.prepareMessage();

      // 3. Yêu cầu người dùng ký message (mở popup MetaMask/wallet)
      const signature = await signMessageAsync({ message: messageToSign });

      // 4. Gửi message + signature lên server để xác thực
      const verifyRes = await fetch("/api/auth/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: messageToSign, signature }),
      });

      const result = await verifyRes.json();
      if (!result.ok) throw new Error(result.error || "Xác thực thất bại");

      await mutate(); // refresh session
    } catch (err) {
      console.error("[useSiwe] signIn error:", err);
      setError(err instanceof Error ? err.message : "Đăng nhập thất bại");
    } finally {
      setIsSigningIn(false);
    }
  }, [address, chainId, signMessageAsync, mutate]);

  const signOut = useCallback(async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    await mutate();
  }, [mutate]);

  // Tự đăng xuất session nếu người dùng disconnect wallet hoặc đổi địa chỉ
  useEffect(() => {
    if (!isConnected && session?.isLoggedIn) {
      signOut();
    }
  }, [isConnected, session?.isLoggedIn, signOut]);

  return {
    session,
    isLoggedIn: session?.isLoggedIn ?? false,
    signIn,
    signOut,
    isSigningIn,
    error,
  };
}
