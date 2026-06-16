"use client";
import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then(r => r.json());

interface MembershipResponse {
  isMember: boolean;
  reason?: "not_logged_in" | "not_configured" | "unsupported_chain" | "contract_read_error";
  balance?: string;
  minBalance?: string;
  contract?: string;
  note?: string;
}

/**
 * Hook kiểm tra quyền thành viên (NFT/token-gated) dựa trên session SIWE hiện tại.
 * Dùng: const { isMember, isLoading, reason } = useMembership();
 */
export function useMembership() {
  const { data, error, isLoading, mutate } = useSWR<MembershipResponse>(
    "/api/membership",
    fetcher,
    { refreshInterval: 60_000 }
  );

  return {
    isMember: data?.isMember ?? false,
    reason: data?.reason,
    balance: data?.balance,
    minBalance: data?.minBalance,
    note: data?.note,
    isLoading,
    error,
    refresh: mutate,
  };
}
