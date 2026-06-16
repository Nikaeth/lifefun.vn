"use client";
import { useEffect, useRef, useState } from "react";
import { useXFeed } from "@/hooks/useXFeed";
import { useTheme } from "@/components/providers/ThemeProvider";
import { RefreshCw } from "lucide-react";
import { Skeleton } from "@/components/ui/Skeleton";

declare global {
  interface Window {
    twttr?: { widgets?: { load: (el?: HTMLElement) => void } };
  }
}

export default function XFeed() {
  const ref = useRef<HTMLDivElement>(null);
  const [embedFailed, setEmbedFailed] = useState(false);
  const { tweets, isMock, note, isLoading } = useXFeed();
  const { theme } = useTheme();

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://platform.twitter.com/widgets.js";
    script.async = true;
    script.charset = "utf-8";
    document.body.appendChild(script);

    const timer = setTimeout(() => {
      const el = ref.current?.querySelector("iframe");
      if (!el || el.offsetHeight < 20) setEmbedFailed(true);
    }, 4000);

    return () => {
      clearTimeout(timer);
      document.body.removeChild(script);
    };
  }, []);

  // X embed timeline cần reload lại widget khi đổi theme
  useEffect(() => {
    if (!embedFailed && window.twttr?.widgets?.load && ref.current) {
      window.twttr.widgets.load(ref.current);
    }
  }, [theme, embedFailed]);

  const showApiFeed = embedFailed; // X embed widget thất bại -> fallback sang X API v2 (live hoặc mock)
  const showSkeleton = showApiFeed && isLoading && tweets.length === 0;

  return (
    <div className="bg-white dark:bg-gray-900 border border-green-100 dark:border-gray-800 rounded-xl overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3.5 border-b border-green-100 dark:border-gray-800">
        <h2 className="flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-gray-50">
          <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor" aria-hidden="true">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.741l7.73-8.835L1.254 2.25H8.08l4.259 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
          Tin tức X
        </h2>
        <div className="flex items-center gap-2">
          {showApiFeed && !isMock && (
            <span className="flex items-center gap-1 text-[10px] text-gray-400 dark:text-gray-500">
              <RefreshCw size={10} aria-hidden="true" /> 2 phút
            </span>
          )}
          {showApiFeed && isMock && <span className="text-[10px] text-gray-400 dark:text-gray-500">mock</span>}
          <a
            href="https://twitter.com/search?q=%23crypto+OR+%23chungkhoan"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-green-600 dark:text-green-400 hover:underline"
          >
            Xem tất cả →<span className="sr-only"> (mở trong tab mới)</span>
          </a>
        </div>
      </div>

      {/* Primary: X embedded timeline */}
      <div ref={ref} className={showApiFeed ? "hidden" : "px-3 py-2"}>
        <a
          className="twitter-timeline"
          data-theme={theme === "dark" ? "dark" : "light"}
          data-height="400"
          data-chrome="noheader nofooter noborders transparent"
          data-tweet-limit="5"
          href="https://twitter.com/search?q=%23crypto%20OR%20%23chungkhoan%20lang%3Avi&src=typed_query&f=live"
        >
          Đang tải...
        </a>
      </div>

      {/* Fallback: X API v2 search (real tweets via X_BEARER_TOKEN, hoặc mock nếu chưa cấu hình) */}
      {showSkeleton && (
        <div className="divide-y divide-green-50 dark:divide-gray-800 p-4 space-y-4" role="status" aria-label="Đang tải tin tức X">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i}>
              <div className="flex items-center gap-2 mb-2">
                <Skeleton className="w-7 h-7 rounded-full shrink-0" />
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-3 w-16" />
              </div>
              <Skeleton className="h-3 w-full mb-1" />
              <Skeleton className="h-3 w-3/4" />
            </div>
          ))}
        </div>
      )}

      {showApiFeed && !showSkeleton && (
        <ul className="divide-y divide-green-50 dark:divide-gray-800 list-none">
          {tweets.map((t, i) => (
            <li key={i} className="px-4 py-3 hover:bg-green-50 dark:hover:bg-gray-800 transition-colors">
              <div className="flex items-center gap-2 mb-1.5">
                <div className="w-7 h-7 rounded-full bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300 text-[11px] font-bold flex items-center justify-center shrink-0" aria-hidden="true">
                  {t.av}
                </div>
                <span className="text-sm font-semibold text-gray-900 dark:text-gray-50">{t.author}</span>
                <span className="text-xs text-gray-400 dark:text-gray-500">{t.handle}</span>
                <span className="text-xs text-gray-400 dark:text-gray-500 ml-auto">{t.time}</span>
              </div>
              <p
                className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed"
                dangerouslySetInnerHTML={{
                  __html: t.body.replace(/#(\w+)/g, '<span class="text-green-500 dark:text-green-400 font-medium">#$1</span>'),
                }}
              />
              <div className="flex gap-4 mt-2">
                <span className="text-xs text-gray-400 dark:text-gray-500">
                  <span className="sr-only">Lượt thích: </span>♡ {t.likes}
                </span>
                <span className="text-xs text-gray-400 dark:text-gray-500">
                  <span className="sr-only">Lượt chia sẻ lại: </span>↺ {t.retweets}
                </span>
              </div>
            </li>
          ))}
          {isMock && note && (
            <li className="px-4 py-2 text-[11px] text-gray-400 dark:text-gray-500 border-t border-green-50 dark:border-gray-800">{note}</li>
          )}
        </ul>
      )}
    </div>
  );
}
