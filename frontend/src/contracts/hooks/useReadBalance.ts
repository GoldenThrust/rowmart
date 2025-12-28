import { useBalance, useConnection, useReadContract } from "wagmi";
import { MNEEContractConfig } from "../mnee";
import { formatUnits } from "viem";
import { useTokenDetails } from "./useTokenDetails";
import { useWatchTokenTransfers } from "./events/TransferEvents";

export default function useReadBalance() {
  const { address } = useConnection();
  const { data: ethBalance, refetch: refetchEthBalance } = useBalance({
    address,
  });

  const { decimals = 18 } = useTokenDetails();

  const { data: balance, refetch: refetchBalance } = useReadContract({
    ...MNEEContractConfig,
    functionName: "balanceOf",
    args: [address!],
  });

  useWatchTokenTransfers(address, () => {
    refetchBalance();
    refetchEthBalance();
  });

  return {
    formatedBalance: formatUnits(BigInt(balance ?? 0), decimals),
    balance,
    ethBalance: ethBalance,
  };
}
