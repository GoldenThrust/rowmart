import { createConfig, http } from "wagmi";
import {
  mainnet,
  sepolia,
  hardhat,
  arbitrum,
  base,
  optimism,
  polygon,
} from "wagmi/chains";

const rpc = (url?: string) => (url && url.trim() ? http(url) : http());

export const config = createConfig({
  chains: [hardhat, mainnet, arbitrum, base, optimism, polygon, sepolia],
  transports: {
    [mainnet.id]: rpc(import.meta.env.VITE_RPC_MAINNET),
    [arbitrum.id]: rpc(import.meta.env.VITE_RPC_ARBITRUM),
    [optimism.id]: rpc(import.meta.env.VITE_RPC_OPTIMISM),
    [polygon.id]: rpc(import.meta.env.VITE_RPC_POLYGON),
    [base.id]: rpc(import.meta.env.VITE_RPC_BASE),
    [sepolia.id]: rpc(import.meta.env.VITE_RPC_SEPOLIA),
    [hardhat.id]: http("http://127.0.0.1:8545"),
  },
});

declare module "wagmi" {
  interface Register {
    config: typeof config;
  }
}
