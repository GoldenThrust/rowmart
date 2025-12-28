import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
import { ethers } from "ethers";

const MarketplaceModule = buildModule("MarketplaceModule", (m) => {
  // Accounts (Runtime Values)
  const deployer = m.getAccount(0);
  const feeRecipient = m.getAccount(1);
  const arbitrator = m.getAccount(2);
  const seller = m.getAccount(3);
  const buyer = m.getAccount(4);
  const other = m.getAccount(5);

  // Deploy MockERC20
  const token = m.contract("MockERC20");

  const amount = ethers.parseEther("1000");

  // Mint tokens
  // m.call(token, "mint", [deployer, amount]);
  // m.call(token, "mint", [feeRecipient, amount]);
  // m.call(token, "mint", [arbitrator, amount]);
  // m.call(token, "mint", [seller, amount]);
  m.call(token, "mint", [buyer, amount]);
  // m.call(token, "mint", [other, amount]);

  // Deploy Marketplace (upgradeable pattern)
  const marketplace = m.contract("Marketplace");

  // Initialize Marketplace
  m.call(marketplace, "initialize", [
    token,
    feeRecipient,
    arbitrator,
  ]);

  return {
    token,
    marketplace,
  };
});

export default MarketplaceModule;
