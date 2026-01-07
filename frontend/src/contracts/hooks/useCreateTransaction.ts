import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { MarketplaceContractConfig } from "../marketPlace";
import { MNEEContractConfig } from "../mnee";
import { useTokenDetails } from "./useTokenDetails";
import { parseUnits } from "viem";
import { useAllowance } from "./useAllowance";

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

  const { decimals = 18 } = useTokenDetails();

  const { checkAllowance } = useAllowance();

  const approveAndBuy = async (
    productId: bigint,
    quantity: number,
    metadataCID: string,
    price: string
  ) => {
    const { sufficient, difference } = await checkAllowance(
      parseUnits(price, decimals)
    );

    if (!sufficient) {
      // 1️⃣ Approve MNEE
      await writeContractAsync({
        ...MNEEContractConfig,
        functionName: "approve",
        args: [MarketplaceContractConfig.address, difference],
      });
    }

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
