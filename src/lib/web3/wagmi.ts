import { http, createConfig } from "wagmi";
import { mainnet, bsc, polygon, arbitrum, sepolia } from "wagmi/chains";
import { getDefaultConfig } from "@rainbow-me/rainbowkit";

/**
 * Cấu hình wagmi + RainbowKit cho EVM (Ethereum, BSC, Polygon, Arbitrum).
 *
 * YÊU CẦU: tạo Project ID tại https://cloud.walletconnect.com (miễn phí)
 * và thêm vào .env.local:
 *   NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id
 *
 * Nếu chưa có Project ID, WalletConnect QR sẽ không hoạt động,
 * nhưng MetaMask / Coinbase Wallet (injected) vẫn kết nối được qua extension.
 */

const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "demo-project-id";

export const wagmiConfig = createConfig(
  getDefaultConfig({
    appName: "LifeFun.vn",
    projectId,
    chains: [mainnet, bsc, polygon, arbitrum, sepolia],
    transports: {
      [mainnet.id]: http(),
      [bsc.id]: http(),
      [polygon.id]: http(),
      [arbitrum.id]: http(),
      [sepolia.id]: http(),
    },
    ssr: true,
  })
);

export const SUPPORTED_EVM_CHAINS = [mainnet, bsc, polygon, arbitrum, sepolia];
