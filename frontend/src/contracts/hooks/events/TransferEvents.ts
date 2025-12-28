import { useWatchContractEvent } from "wagmi";
import { MNEEContractConfig } from "../../mnee";


export function useWatchTokenTransfers(
  address?: `0x${string}`,
  onChange?: () => void
) {
  useWatchContractEvent({
    ...MNEEContractConfig,
    eventName: "Transfer",
    onLogs(logs) {
      console.log("Transfer event detected", logs);
      for (const log of logs) {
        const { from, to } = log.args as {
          from: `0x${string}`;
          to: `0x${string}`;
        };

        if (
          from?.toLowerCase() === address?.toLowerCase() ||
          to?.toLowerCase() === address?.toLowerCase()
        ) {
          onChange?.();
          break;
        }
      }
    },
  });
}