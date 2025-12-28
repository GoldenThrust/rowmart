import { useBalance, useConnection, useReadContract } from "wagmi";
import { MNEEContractConfig } from "../mnee";
import { formatUnits } from "viem";
import { useTokenDetails } from "./useTokenDetails";

export default function useReadBalance() {
  const { address } = useConnection();
  const { data: ethBalance } = useBalance({
    address,
  });

  const { decimals } = useTokenDetails();

  const { data: balance } = useReadContract({
    ...MNEEContractConfig,
    functionName: "balanceOf",
    args: [address!],
  });

  return {
    formatedBalance: formatUnits(BigInt(balance ?? 0), decimals ?? 18),
    balance,
    ethBalance: ethBalance,
  };
}
