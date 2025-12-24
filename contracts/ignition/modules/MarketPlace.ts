import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("MarketPlaceModule", (m) => {
  const marketPlace = m.contract("MarketPlace");

  m.call(marketPlace, "incBy", [5n]);

  return { marketPlace };
});
