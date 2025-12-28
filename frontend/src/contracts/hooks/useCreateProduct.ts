import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { MarketplaceContractConfig } from "../marketPlace";
import { MNEEContractConfig } from "../mnee";
import { formatUnits } from "viem";
import { useTokenDetails } from "./useTokenDetails";

export default function useCreateProduct() {
  const {
    data: hash,
    error,
    isPending,
    mutateAsync: writeContractAsync,
  } = useWriteContract();

  const { decimals } = useTokenDetails();

  const { isLoading, isSuccess } =
    useWaitForTransactionReceipt({
      hash,
    });

  const { data: createProductFee } = useReadContract({
    ...MarketplaceContractConfig,
    functionName: "createProductFee",
  });

  const approveAndCreate = async (price: bigint, metadataCID: string) => {
    if (!createProductFee) throw new Error("Fee not loaded");

    // 1️⃣ Approve MNEE
    await writeContractAsync({
      ...MNEEContractConfig,
      functionName: "approve",
      args: [MarketplaceContractConfig.address, createProductFee],
    });

    // 2️⃣ Create Product
    await writeContractAsync({
      ...MarketplaceContractConfig,
      functionName: "createProduct",
      args: [price, metadataCID],
    });
  };

  return {
    approveAndCreate,
    createProductFee: formatUnits(BigInt(createProductFee ?? 0), decimals ?? 18),
    isPending,
    isLoading,
    isSuccess,
    hash,
    error,
  };
}
