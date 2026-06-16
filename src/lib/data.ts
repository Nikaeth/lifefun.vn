import type { TickerItem, StatCard, CryptoAsset, NewsItem, Tweet, ChartSymbol } from "@/types";

export const TICKERS: TickerItem[] = [
  { sym: "BTC/USDT",  price: "$68,420", chg: "+2.34%", up: true  },
  { sym: "ETH/USDT",  price: "$3,812",  chg: "+1.87%", up: true  },
  { sym: "BNB/USDT",  price: "$612",    chg: "-0.45%", up: false },
  { sym: "SOL/USDT",  price: "$183",    chg: "+4.21%", up: true  },
  { sym: "VN-INDEX",  price: "1,298",   chg: "+0.68%", up: true  },
  { sym: "HNX",       price: "228",     chg: "-0.12%", up: false },
  { sym: "S&P 500",   price: "5,304",   chg: "+0.42%", up: true  },
  { sym: "NASDAQ",    price: "18,692",  chg: "+0.61%", up: true  },
  { sym: "XAU/USD",   price: "$2,338",  chg: "+0.18%", up: true  },
  { sym: "USD/VND",   price: "25,180",  chg: "-0.05%", up: false },
];

export const STATS: StatCard[] = [
  { label: "BTC/USDT",  value: "$68,420", chg: "+2.34%", up: true  },
  { label: "VN-INDEX",  value: "1,298",   chg: "+0.68%", up: true  },
  { label: "S&P 500",   value: "5,304",   chg: "+0.42%", up: true  },
  { label: "Vàng XAU",  value: "$2,338",  chg: "+0.18%", up: true  },
  { label: "USD/VND",   value: "25,180",  chg: "-0.05%", up: false },
];

export const CRYPTOS: CryptoAsset[] = [
  { icon: "₿", bg: "#FEF9C3", col: "#854D0E", sym: "BTC",  full: "Bitcoin",   price: "$68,420",  chg: "+2.34%", up: true  },
  { icon: "Ξ", bg: "#EDE9FE", col: "#5B21B6", sym: "ETH",  full: "Ethereum",  price: "$3,812",   chg: "+1.87%", up: true  },
  { icon: "◎", bg: "#DCFCE7", col: "#166534", sym: "SOL",  full: "Solana",    price: "$183.40",  chg: "+4.21%", up: true  },
  { icon: "●", bg: "#FEE2E2", col: "#991B1B", sym: "BNB",  full: "BNB",       price: "$612.10",  chg: "-0.45%", up: false },
  { icon: "X", bg: "#E0F2FE", col: "#0369A1", sym: "XRP",  full: "Ripple",    price: "$0.584",   chg: "+1.12%", up: true  },
  { icon: "▲", bg: "#F3F4F6", col: "#374151", sym: "AVAX", full: "Avalanche", price: "$41.20",   chg: "-1.08%", up: false },
];

export const NEWS_ITEMS: NewsItem[] = [
  { cat: "crypto",  catLabel: "Crypto",      emoji: "₿", headline: "Bitcoin phá đỉnh $70,000 – Liệu đây có phải chu kỳ tăng mới?",    excerpt: "Sau đợt điều chỉnh kéo dài, BTC bứt phá mạnh khi dòng tiền ETF liên tục chảy vào với khối lượng kỷ lục...", source: "CoinDesk VN", time: "12 phút trước" },
  { cat: "stock",   catLabel: "Chứng khoán", emoji: "📈", headline: "VN-INDEX hồi phục 15 điểm, nhóm ngân hàng dẫn dắt phiên sáng",    excerpt: "Dòng tiền quay lại mạnh mẽ với phiên giao dịch có thanh khoản đạt 18.500 tỷ đồng, cao nhất trong tháng...", source: "ĐTCK",       time: "28 phút trước" },
  { cat: "macro",   catLabel: "Vĩ mô",       emoji: "🌐", headline: "Fed giữ nguyên lãi suất, tín hiệu cắt giảm vào cuối năm 2025",    excerpt: "Trong cuộc họp mới nhất, Cục Dự trữ Liên bang Mỹ quyết định giữ nguyên lãi suất ở mức 5.25–5.50%...",    source: "Reuters VN",  time: "1 giờ trước"   },
  { cat: "crypto",  catLabel: "Crypto",      emoji: "⟠", headline: "Ethereum ETF thu hút 500 triệu USD trong tuần đầu ra mắt",        excerpt: "Làn sóng quan tâm từ nhà đầu tư tổ chức đẩy giá ETH tăng vọt sau khi các quỹ ETF spot chính thức hoạt động...", source: "The Block",  time: "2 giờ trước" },
  { cat: "stock",   catLabel: "Chứng khoán", emoji: "🏦", headline: "Khối ngoại mua ròng 320 tỷ đồng phiên thứ 3 liên tiếp",          excerpt: "Dòng vốn ngoại tiếp tục giải ngân mạnh vào thị trường chứng khoán Việt Nam, tập trung vào cổ phiếu vốn hóa lớn...", source: "Vietstock",  time: "3 giờ trước" },
  { cat: "forex",   catLabel: "Forex",       emoji: "💵", headline: "USD/VND ổn định, NHNN tiếp tục bán ngoại tệ bình ổn tỷ giá",     excerpt: "Tỷ giá USD/VND giao dịch quanh 25,180 sau khi Ngân hàng Nhà nước bán ra lượng lớn ngoại tệ can thiệp...", source: "NDH",        time: "4 giờ trước" },
];

export const TWEETS: Tweet[] = [
  { av: "VF", author: "VietFin",       handle: "@VietFinance",      time: "2ph",  body: "#Bitcoin vượt ngưỡng kháng cự $68K, xu hướng tăng vẫn còn mạnh. Mục tiêu kế tiếp có thể ở $72K 🚀 #BTC #Crypto",          likes: 234, retweets: 87  },
  { av: "AN", author: "Anh Nguyen",    handle: "@anhnguyentrader",  time: "8ph",  body: "VN-INDEX hồi phục tốt, nhóm #BankStocks dẫn dắt phiên. VCB và BID tăng mạnh nhất trong rổ VN30. #chungkhoan",              likes: 156, retweets: 42  },
  { av: "CT", author: "CryptoToday",  handle: "@CryptoTodayVN",   time: "15ph", body: "#ETH consolidating near $3,800. ETF flows remain positive. Watch for breakout above $4,000 level 📊 #Ethereum #DeFi",       likes: 89,  retweets: 31  },
  { av: "MF", author: "MarketFeed",   handle: "@MarketFeedVN",    time: "32ph", body: "Cục Dự trữ Liên bang Mỹ giữ nguyên lãi suất, thị trường phản ứng tích cực. Vàng tăng nhẹ 0.2% #Fed #XAU #Gold",          likes: 445, retweets: 123 },
];

export const CHART_SYMBOLS: ChartSymbol[] = [
  { label: "BTC/USDT", symbol: "BINANCE:BTCUSDT" },
  { label: "ETH/USDT", symbol: "BINANCE:ETHUSDT" },
  { label: "S&P 500",  symbol: "FOREXCOM:SPXUSD"  },
  { label: "VNM",      symbol: "HOSE:VNM"          },
];
