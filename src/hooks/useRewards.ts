"use client";
import useSWR from "swr";
import { useCallback, useState } from "react";

const fetcher = (url: string) => fetch(url).then(r => r.json());

export interface RewardEvent {
  type: string;
  points: number;
  timestamp: string;
  meta?: Record<string, string>;
}

export interface RewardTier {
  id: string;
  label: string;
  cost: number;
  description: string;
}

interface RewardsResponse {
  isLoggedIn: boolean;
  address?: string;
  totalPoints: number;
  events: RewardEvent[];
  canCheckIn?: boolean;
  tiers?: RewardTier[];
}

/**
 * Hook quản lý LifeFun Points (hệ thống điểm thưởng off-chain).
 * Yêu cầu người dùng đã đăng nhập bằng SIWE (xem useSiwe).
 */
export function useRewards() {
  const { data, isLoading, mutate } = useSWR<RewardsResponse>("/api/rewards", fetcher, {
    refreshInterval: 60_000,
  });
  const [actionError, setActionError] = useState<string | null>(null);
  const [isCheckingIn, setIsCheckingIn] = useState(false);

  const checkIn = useCallback(async () => {
    setActionError(null);
    setIsCheckingIn(true);
    try {
      const res = await fetch("/api/rewards/checkin", { method: "POST" });
      const result = await res.json();
      if (!result.ok) throw new Error(result.error);
      await mutate();
      return result;
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "Lỗi không xác định");
    } finally {
      setIsCheckingIn(false);
    }
  }, [mutate]);

  const redeem = useCallback(async (tierId: string) => {
    setActionError(null);
    try {
      const res = await fetch("/api/rewards/redeem", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tierId }),
      });
      const result = await res.json();
      if (!result.ok) throw new Error(result.error);
      await mutate();
      return result;
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "Lỗi không xác định");
    }
  }, [mutate]);

  const track = useCallback(async (type: string, meta?: Record<string, string>) => {
    try {
      const res = await fetch("/api/rewards/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, meta }),
      });
      const result = await res.json();
      if (result.ok) await mutate();
      return result;
    } catch {
      // Im lặng bỏ qua lỗi tracking để không ảnh hưởng UX chính
      return { ok: false };
    }
  }, [mutate]);

  return {
    isLoggedIn: data?.isLoggedIn ?? false,
    totalPoints: data?.totalPoints ?? 0,
    events: data?.events ?? [],
    canCheckIn: data?.canCheckIn ?? false,
    tiers: data?.tiers ?? [],
    isLoading,
    isCheckingIn,
    actionError,
    checkIn,
    redeem,
    track,
  };
}
