import type { Metadata } from "next";
import "./globals.css";
import TickerBar from "@/components/layout/TickerBar";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { Web3Provider } from "@/components/providers/Web3Provider";

export const metadata: Metadata = {
  metadataBase: new URL("https://lifefun.vn"),
  title: {
    default: "LifeFun.vn – Tài chính · Chứng khoán · Crypto",
    template: "%s",
  },
  description:
    "Nền tảng thông tin tài chính, chứng khoán và crypto hàng đầu Việt Nam. Dữ liệu realtime, phân tích chuyên sâu, tin tức cập nhật 24/7.",
  keywords: ["chứng khoán", "crypto", "bitcoin", "tài chính", "VN-INDEX", "đầu tư", "tin tức tài chính"],
  authors: [{ name: "LifeFun Vietnam JSC" }],
  alternates: { canonical: "https://lifefun.vn" },
  robots: { index: true, follow: true },
  openGraph: {
    title: "LifeFun.vn – Tài chính · Chứng khoán · Crypto",
    description: "Dữ liệu tài chính realtime, tin tức chứng khoán và crypto Việt Nam",
    url: "https://lifefun.vn",
    siteName: "LifeFun.vn",
    locale: "vi_VN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "LifeFun.vn – Tài chính · Chứng khoán · Crypto",
    description: "Dữ liệu tài chính realtime, tin tức chứng khoán và crypto Việt Nam",
  },
};

// Script chạy trước khi React hydrate để tránh flash sai theme (FOUC)
const themeScript = `
(function() {
  try {
    var stored = localStorage.getItem('lifefun-theme');
    var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    var theme = stored || (prefersDark ? 'dark' : 'light');
    if (theme === 'dark') document.documentElement.classList.add('dark');
  } catch (e) {}
})();
`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="flex flex-col min-h-screen bg-green-50 dark:bg-gray-950 transition-colors">
        <ThemeProvider>
          <Web3Provider>
            <a
              href="#main-content"
              className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[100] focus:bg-white focus:text-green-700 focus:px-3 focus:py-2 focus:rounded-md focus:shadow-lg"
            >
              Bỏ qua đến nội dung chính
            </a>
            <TickerBar />
            <Header />
            <main id="main-content" className="flex-1">
              {children}
            </main>
            <Footer />
          </Web3Provider>
        </ThemeProvider>
      </body>
    </html>
  );
}
