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

export const config = createConfig({
  chains: [hardhat, mainnet, arbitrum, base, optimism, polygon, sepolia],
  transports: {
    [mainnet.id]: http(),
    [arbitrum.id]: http(),
    [optimism.id]: http(),
    [polygon.id]: http(),
    [base.id]: http(),
    [hardhat.id]: http("http://127.0.0.1:8545"),
    [sepolia.id]: http(),
  },
});

declare module "wagmi" {
  interface Register {
    config: typeof config;
  }
}
