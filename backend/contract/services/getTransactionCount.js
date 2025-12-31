import { Contract } from "ethers";
import { MarketplaceContractConfig } from "../marketPlace.js";

// TODO: product should not be active upon creation. Activate when product Created Event is emitted
export async function getTransactionCount(fastify) {
  const transactionCount = await fastify.ethers.contract.transactionCount();

  return transactionCount;
}
