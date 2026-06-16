import { getIronSession, type SessionOptions } from "iron-session";
import { cookies } from "next/headers";

/**
 * Session người dùng sau khi đăng nhập bằng ví (SIWE) hoặc Solana Sign-In.
 * Lưu trong cookie mã hoá (iron-session) — không cần database cho phần auth cơ bản.
 *
 * YÊU CẦU: .env.local
 *   SESSION_SECRET=<chuỗi ngẫu nhiên tối thiểu 32 ký tự>
 *   Tạo nhanh: openssl rand -base64 32
 */

export interface SessionData {
  address?: string;        // địa chỉ ví đã xác thực (EVM hoặc Solana, dạng string)
  chain?: "evm" | "solana";
  chainId?: number;        // chỉ áp dụng cho EVM
  nonce?: string;          // nonce SIWE đang chờ xác thực
  isLoggedIn?: boolean;
}

export const sessionOptions: SessionOptions = {
  password: process.env.SESSION_SECRET || "dev-only-insecure-secret-change-me-please-32chars",
  cookieName: "lifefun_session",
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 ngày
  },
};

export async function getSession() {
  return getIronSession<SessionData>(await cookies(), sessionOptions);
}
