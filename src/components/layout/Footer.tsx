import Link from "next/link";

export default function Footer() {
  const cols = [
    { title: "Thị trường",  links: ["Chứng khoán VN","Chứng khoán Mỹ","Tiền điện tử","Ngoại hối","Hàng hóa"] },
    { title: "Phân tích",   links: ["Phân tích kỹ thuật","Phân tích cơ bản","Tín hiệu giao dịch","Báo cáo tuần"] },
    { title: "Hỗ trợ",      links: ["Về chúng tôi","Liên hệ","Quảng cáo","Điều khoản","Bảo mật"] },
  ];
  return (
    <footer className="bg-green-700 dark:bg-gray-900 text-white/70 pt-10 pb-6 px-6 border-t border-transparent dark:border-gray-800">
      <div className="max-w-screen-xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="text-xl font-bold text-white mb-2">LifeFun.vn</div>
            <p className="text-sm leading-relaxed">
              Nền tảng thông tin tài chính, chứng khoán và crypto hàng đầu Việt Nam.
              Dữ liệu realtime, phân tích chuyên sâu, tin tức cập nhật 24/7.
            </p>
            <a href="https://x.com" className="inline-flex items-center gap-2 mt-4 text-sm text-white/60 hover:text-white transition-colors">
              <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor" aria-hidden="true">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.741l7.73-8.835L1.254 2.25H8.08l4.259 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
              X (Twitter)
            </a>
          </div>
          {cols.map(col => (
            <nav key={col.title} aria-label={col.title}>
              <h4 className="text-white text-sm font-semibold mb-3 tracking-wide">{col.title}</h4>
              <ul className="space-y-2">
                {col.links.map(l => (
                  <li key={l}><Link href="#" className="text-sm text-white/60 hover:text-white transition-colors">{l}</Link></li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
        <div className="border-t border-white/10 pt-4 flex flex-col sm:flex-row justify-between gap-2 text-xs">
          <span>© 2025 LifeFun.vn – Bản quyền thuộc về LifeFun Vietnam JSC</span>
          <span>Dữ liệu cung cấp bởi TradingView</span>
        </div>
        <p className="text-[11px] text-white/40 mt-2">
          ⚠ Thông tin chỉ mang tính tham khảo, không phải lời khuyên đầu tư. Đầu tư tiềm ẩn rủi ro cao.
        </p>
      </div>
    </footer>
  );
}
