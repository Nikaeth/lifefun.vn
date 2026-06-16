export interface TickerItem {
  sym: string;
  price: string;
  chg: string;
  up: boolean;
}

export interface StatCard {
  label: string;
  value: string;
  chg: string;
  up: boolean;
}

export interface CryptoAsset {
  icon: string;
  bg: string;
  col: string;
  sym: string;
  full: string;
  price: string;
  chg: string;
  up: boolean;
}

export interface PriceItem {
  id: string;
  sym: string;
  full: string;
  icon: string;
  bg: string;
  col: string;
  price: number;
  changePct24h: number;
  up: boolean;
}

export interface NewsItem {
  cat: "crypto" | "stock" | "macro" | "forex";
  catLabel: string;
  emoji: string;
  headline: string;
  excerpt: string;
  source: string;
  time: string;
}

export interface Tweet {
  av: string;
  author: string;
  handle: string;
  time: string;
  body: string;
  likes: number;
  retweets: number;
}

export type ChartSymbol = {
  label: string;
  symbol: string;
};
