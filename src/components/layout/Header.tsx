"use client";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { Search, TrendingUp, Sun, Moon, Menu, X } from "lucide-react";
import Link from "next/link";
import { useTheme } from "@/components/providers/ThemeProvider";
import { WalletButton } from "@/components/web3/WalletButton";
import { RewardsWidget } from "@/components/rewards/RewardsWidget";

const NAV = [
  { href: "/",            label: "Tổng quan"   },
  { href: "/chung-khoan", label: "Chứng khoán" },
  { href: "/crypto",      label: "Crypto"      },
  { href: "/tin-tuc",     label: "Tin tức"     },
  { href: "/portfolio",   label: "Portfolio"   },
  { href: "/rewards",     label: "Điểm thưởng" },
  { href: "/membership",  label: "Thành viên"  },
];

export default function Header() {
  const pathname = usePathname();
  const active = pathname || "/";
  const [searching, setSearching] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="bg-white dark:bg-gray-900 border-b border-green-200 dark:border-gray-800 sticky top-0 z-50 transition-colors">
      <div className="max-w-screen-xl mx-auto px-6 h-[60px] flex items-center justify-between gap-6">
        <Link href="/" className="flex items-center gap-2 shrink-0" aria-label="LifeFun.vn - Trang chủ">
          <div className="w-8 h-8 rounded-lg bg-green-500 flex items-center justify-center" aria-hidden="true">
            <TrendingUp size={17} className="text-white" />
          </div>
          <span className="text-xl font-bold text-green-600 dark:text-green-400">
            Life<span className="text-green-400 dark:text-green-300">Fun</span>.vn
          </span>
          <span className="hidden sm:inline text-[10px] font-semibold tracking-wider bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300 px-2 py-0.5 rounded-full">
            Finance
          </span>
        </Link>

        <nav className="hidden md:flex gap-1" aria-label="Điều hướng chính">
          {NAV.map(n => (
            <Link
              key={n.href}
              href={n.href}
              aria-current={active === n.href ? "page" : undefined}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                active === n.href
                  ? "bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300"
                  : "text-gray-600 dark:text-gray-300 hover:bg-green-50 dark:hover:bg-gray-800 hover:text-green-600 dark:hover:text-green-300"
              }`}
            >
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2 shrink-0">
          {searching ? (
            <input
              autoFocus
              onBlur={() => setSearching(false)}
              placeholder="Tìm kiếm cổ phiếu, crypto..."
              aria-label="Tìm kiếm cổ phiếu, crypto"
              className="border border-green-300 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 rounded-lg px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-green-300 dark:focus:ring-green-700 w-56 transition-all"
            />
          ) : (
            <button
              onClick={() => setSearching(true)}
              aria-label="Mở tìm kiếm"
              className="flex items-center gap-2 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-1.5 text-sm text-gray-600 dark:text-gray-300 hover:border-green-400 hover:text-green-600 dark:hover:text-green-300 transition-colors"
            >
              <Search size={14} aria-hidden="true" />
              <span className="hidden sm:inline">Tìm kiếm</span>
            </button>
          )}

          {/* Dark mode toggle */}
          <button
            onClick={toggleTheme}
            aria-label={theme === "dark" ? "Chuyển sang giao diện sáng" : "Chuyển sang giao diện tối"}
            aria-pressed={theme === "dark"}
            className="flex items-center justify-center w-9 h-9 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-600 dark:text-gray-300 hover:border-green-400 hover:text-green-600 dark:hover:text-green-300 transition-colors"
          >
            {theme === "dark" ? <Sun size={15} aria-hidden="true" /> : <Moon size={15} aria-hidden="true" />}
          </button>

          <RewardsWidget />
          <WalletButton />

          {/* Mobile nav toggle */}
          <button
            onClick={() => setMobileNavOpen(v => !v)}
            aria-label={mobileNavOpen ? "Đóng menu" : "Mở menu"}
            aria-expanded={mobileNavOpen}
            className="md:hidden flex items-center justify-center w-9 h-9 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-600 dark:text-gray-300"
          >
            {mobileNavOpen ? <X size={16} aria-hidden="true" /> : <Menu size={16} aria-hidden="true" />}
          </button>
        </div>
      </div>

      {/* Mobile nav drawer */}
      {mobileNavOpen && (
        <nav
          aria-label="Điều hướng (di động)"
          className="md:hidden border-t border-green-100 dark:border-gray-800 bg-white dark:bg-gray-900 px-4 py-2 flex flex-col gap-1"
        >
          {NAV.map(n => (
            <Link
              key={n.href}
              href={n.href}
              onClick={() => setMobileNavOpen(false)}
              aria-current={active === n.href ? "page" : undefined}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                active === n.href
                  ? "bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300"
                  : "text-gray-600 dark:text-gray-300 hover:bg-green-50 dark:hover:bg-gray-800"
              }`}
            >
              {n.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
