import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useConnect, useConnection } from "wagmi";
// import { MarketplaceContractConfig } from "./contracts/marketPlace";
import CreateProduct from "./components/CreateProducts";
import { useState } from "react";
import useReadBalance from "./contracts/hooks/useReadBalance";
import { formatEther, formatUnits } from "viem";
import { useTokenDetails } from "./contracts/hooks/useTokenDetails";

function App() {
  const { isConnected } = useConnection();
  const { error } = useConnect();
  const [openForm, setOpenForm] = useState<boolean>(false);
  const { balance, ethBalance } = useReadBalance();
  const token = useTokenDetails();

  return (
    <>
      <header className="flex justify-between items-center p-4">
        <h1 className="text-2xl font-bold font-serif text-emerald-600  text-shadow-sm text-shadow-blue-800">
          RowMart
        </h1>
        <ConnectButton />

        {isConnected && (
          <button
            type="button"
            onClick={() => setOpenForm(() => !openForm)}
            className="border-2 p-2 rounded-2xl bg-gray-700"
          >
            Create Product
          </button>
        )}
      </header>
      <main>
        <div>{error?.message}</div>
        {openForm && <CreateProduct setOpenForm={setOpenForm} />}
        <div>Token name {token.name}</div>
        <div>Token supply {formatEther(BigInt(token.totalSupply ?? 0))}</div>
        <div>Balance of {formatUnits(balance ?? 0n, token.decimals!)} {token.symbol}</div>
        <div>Balance of {Number(formatEther(ethBalance ?? 0n)).toFixed(3)} ETH</div>
      </main>
    </>
  );
}

export default App;
