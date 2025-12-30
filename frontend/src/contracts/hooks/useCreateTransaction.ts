import {
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import { MarketplaceContractConfig } from "../marketPlace";
import { MNEEContractConfig } from "../mnee";

// TODO: estimate gas price to decide if user can pray and approve transaction
export default function useCreateTransaction() {
  const {
    data: hash,
    error,
    isPending,
    mutateAsync: writeContractAsync,
  } = useWriteContract();

  const { isLoading, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const approveAndBuy = async (
    productId: bigint,
    quantity: number,
    metadataCID: string,
    price: bigint
  ) => {
    // 1️⃣ Approve MNEE
    await writeContractAsync({
      ...MNEEContractConfig,
      functionName: "approve",
      args: [MarketplaceContractConfig.address, price],
    });

    // 2️⃣ Create Transaction
    await writeContractAsync({
      ...MarketplaceContractConfig,
      functionName: "buyProduct",
      args: [productId, quantity, metadataCID],
    });
  };

  return {
    approveAndBuy,
    isPending,
    isLoading,
    isSuccess,
    hash,
    error,
  };
}
