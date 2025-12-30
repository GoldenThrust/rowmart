import { Contract } from "ethers";
import { MarketplaceContractConfig } from "../marketPlace.js";

export async function getTransactionCount(fastify) {
  const contract = new Contract(
    ...MarketplaceContractConfig,
    fastify.ethers.provider
  );

  const transactionCount = await contract.transactionCount();

  return transactionCount;
}
