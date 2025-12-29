import { ConnectButton } from "@rainbow-me/rainbowkit";
import { formatUnits } from "viem";
import { useTokenDetails } from "../../contracts/hooks/useTokenDetails";
import { ChevronDown } from "lucide-react";
import { useConnection } from "wagmi";
import { formatNumber } from "../../utils";
import useReadBalance from "../../contracts/hooks/useReadBalance";


export const AccountConnectButton = ({
  readBalance,
}: {
  readBalance: ReturnType<typeof useReadBalance>;
}) => {
  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        authenticationStatus,
        mounted,
      }) => {
        // Note: If your app doesn't use authentication, you
        // can remove all 'authenticationStatus' checks
        const ready = mounted && authenticationStatus !== "loading";
        const connected =
          ready &&
          account &&
          chain &&
          (!authenticationStatus || authenticationStatus === "authenticated");
        const { balance, formatedBalance, ethBalance } = readBalance;
        const icon = useConnection()?.connector?.icon;
        const { symbol } = useTokenDetails();

        const displayBalance =
          balance !== undefined
            ? ` ${formatNumber(formatedBalance)} ${symbol}`
            : ` ${formatNumber(formatUnits(ethBalance?.value ?? 0n, ethBalance?.decimals ?? 18))} ${ethBalance?.symbol ?? "ETH"}`;

        return (
          <div
            {...(!ready && {
              "aria-hidden": true,
              style: {
                opacity: 0,
                pointerEvents: "none",
                userSelect: "none",
              },
            })}
          >
            {(() => {
              if (!connected) {
                return (
                  <button
                    className="p-2 rounded-lg bg-gray-800 font-bold shadow-lg shadow-black border-2 border-neutral-900"
                    onClick={openConnectModal}
                    type="button"
                  >
                    Connect Wallet
                  </button>
                );
              }
              if (chain.unsupported) {
                return (
                  <button
                    className="p-2 rounded-lg bg-gray-800 font-bold shadow-lg shadow-black border-2 border-pink-800"
                    onClick={openChainModal}
                    type="button"
                  >
                    Wrong network
                  </button>
                );
              }
              return (
                <div
                  style={{ display: "flex", gap: 12 }}
                  className="font-semibold text-sm"
                >
                  <button
                    onClick={openChainModal}
                    style={{ display: "flex", alignItems: "center" }}
                    type="button"
                    className="bg-gray-900/50 px-5 rounded-lg shadow-lg shadow-black gap-1"
                  >
                    {chain.hasIcon && (
                      <div
                        style={{
                          background: chain.iconBackground,
                          width: 20,
                          height: 20,
                          borderRadius: 999,
                          overflow: "hidden",
                          marginRight: 4,
                        }}
                      >
                        {chain.iconUrl && (
                          <img
                            alt={chain.name ?? "Chain icon"}
                            src={chain.iconUrl}
                            style={{ width: "100%", height: "100%" }}
                          />
                        )}
                      </div>
                    )}
                    {chain.name}
                    <ChevronDown />
                  </button>
                  <button
                    onClick={openAccountModal}
                    className="bg-gray-900/50 ps-5 rounded-lg shadow-lg shadow-blac gap-1 flex items-center shadow-black"
                    type="button"
                  >
                    {displayBalance}
                    <div className="bg-gray-800 p-2 px-5 rounded-lg flex items-center">
                      {account.ensAvatar ? (
                        <div
                          style={{
                            background: chain.iconBackground,
                            width: 20,
                            height: 20,
                            borderRadius: 999,
                            overflow: "hidden",
                            marginRight: 4,
                          }}
                        >
                          <img
                            alt={chain.name ?? "Chain icon"}
                            src={account.ensAvatar}
                            style={{ width: "100%", height: "100%" }}
                          />
                        </div>
                      ) : (
                        <div
                          style={{
                            background: "yellow",
                            width: 20,
                            height: 20,
                            borderRadius: 999,
                            overflow: "hidden",
                            marginRight: 4,
                          }}
                        >
                          <img
                            alt={chain.name ?? "Chain icon"}
                            src={icon}
                            style={{ width: "100%", height: "100%" }}
                          />{" "}
                        </div>
                      )}
                      {account.displayName}
                      <ChevronDown />
                    </div>
                  </button>
                </div>
              );
            })()}
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
};
