import { Contract } from "ethers";
import { MarketplaceContractConfig } from "../marketPlace.js";

export async function getProductCount(fastify) {
  const contract = new Contract(
    ...MarketplaceContractConfig,
    fastify.ethers.provider
  );

  const productCount = await contract.productCount();

  return productCount;
}
