import { useWatchContractEvent } from "wagmi";
import { MNEEContractConfig } from "../../mnee";


export function useWatchTokenTransfers(
  address?: `0x${string}`,
  onChange?: () => void
) {
  useWatchContractEvent({
    ...MNEEContractConfig,
    eventName: "Transfer",
    args: {
      to: address?.toLowerCase() as `0x${string}` | undefined,
      from: address?.toLowerCase() as `0x${string}` | undefined,
    },
    onLogs() {
        onChange?.();
    },
  });
}