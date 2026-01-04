import hardhatToolboxMochaEthersPlugin from "@nomicfoundation/hardhat-toolbox-mocha-ethers";
import { configVariable, defineConfig } from "hardhat/config";
import "dotenv/config";
import { SensitiveString } from "hardhat/types/config";

export default defineConfig({
  plugins: [hardhatToolboxMochaEthersPlugin],
  solidity: {
    profiles: {
      default: {
        version: "0.8.28",
      },
      production: {
        version: "0.8.28",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
    },
  },
  networks: {
    hardhatMainnet: {
      type: "edr-simulated",
      chainType: "l1",
    },
    hardhatOp: {
      type: "edr-simulated",
      chainType: "op",
    },
    sepolia: {
      type: "http",
      chainType: "l1",
      url: process.env.SEPOLIA_RPC_URL as SensitiveString,
      accounts: [process.env.WALLET_PRIVATE_KEY as SensitiveString],
    },

    // mainnet: {
    //   type: "http",
    //   chainType: "l1",
    //   url: process.env.MAINNET_RPC_URL as SensitiveString,
    //   accounts: [process.env.WALLET_PRIVATE_KEY as SensitiveString],
    // },
  },
});
