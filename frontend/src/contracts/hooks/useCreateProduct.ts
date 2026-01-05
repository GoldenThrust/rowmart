import {
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import { MarketplaceContractConfig } from "../marketPlace";
import { MNEEContractConfig } from "../mnee";
import { formatUnits, parseUnits } from "viem";
import { useTokenDetails } from "./useTokenDetails";
import { useAllowance } from "./useAllowance";

// TODO: estimate gas price to decide if user can pray and approve transaction
export default function useCreateProduct() {
  const {
    data: hash,
    error,
    isPending,
    mutateAsync: writeContractAsync,
  } = useWriteContract();

  const {
    mutateAsync: approvewriteContractAsync,
  } = useWriteContract();

  const { decimals } = useTokenDetails();

  const { isLoading, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const { data: createProductFee } = useReadContract({
    ...MarketplaceContractConfig,
    functionName: "createProductFee",
  });

  const { checkAllowance } = useAllowance();

  const approveAndCreate = async (price: string, metadataCID: string) => {
    if (!createProductFee) throw new Error("Fee not loaded");
    const { sufficient, difference } = await checkAllowance(
      createProductFee ?? BigInt(0)
    );

    if (!sufficient) {
      // 1️⃣ Approve MNEE
      await approvewriteContractAsync({
        ...MNEEContractConfig,
        functionName: "approve",
        args: [MarketplaceContractConfig.address, difference],
      });
    }

    // 2️⃣ Create Product
    await writeContractAsync({
      ...MarketplaceContractConfig,
      functionName: "createProduct",
      args: [parseUnits(price, decimals!), metadataCID],
    });
  };

  return {
    approveAndCreate,
    createProductFee: formatUnits(
      BigInt(createProductFee ?? 0),
      decimals ?? 18
    ),
    isPending,
    isLoading,
    isSuccess,
    hash,
    error,
  };
}
