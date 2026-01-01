import { useConnect, useConnection } from "wagmi";
import CreateProduct from "./components/layout/CreateProducts";
import { useState } from "react";
import { AccountConnectButton } from "./components/ui/ConnectButton";
import useReadBalance from "./contracts/hooks/useReadBalance";
import { useWatchTokenTransfers } from "./contracts/hooks/events/TransferEvents";
import DisplayProducts from "./components/layout/DisplayProducts";

function App() {
  const { address } = useConnection();
  const { isConnected } = useConnection();
  const { error } = useConnect();
  const [openForm, setOpenForm] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string | null>(null);
  const readBalance = useReadBalance();

  useWatchTokenTransfers(address, () => {
    readBalance.refetchBalance();
    readBalance.refetchEthBalance();
    console.log("Transfer detected, balances updated.");
  });

  return (
    <>
      <header className="flex justify-between items-center p-4">
        <h1 className="text-2xl font-bold font-serif text-gray-900 text-shadow-sm text-shadow-blue-800 w-10 flex items-center gap-2">
          <img src="logo.png" alt="logo" />
          RowMart
        </h1>
        <div className="flex gap-5 items-center">
          <input
            type="search"
            name="query"
            id="query"
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for what you like to buy......."
            className="border-2 rounded-lg w-98 border-gray-700 outline-0 p-2"
          />
          {/* <ConnectButton /> */}
          <AccountConnectButton readBalance={readBalance} />

          {isConnected && (
            <button
              type="button"
              onClick={() => setOpenForm(() => !openForm)}
              className="p-2 rounded-lg bg-gray-800 font-bold shadow-lg shadow-black border-2 border-neutral-600"
            >
              Sell Products
            </button>
          )}
        </div>
      </header>
      <main>
        <div>{error?.message}</div>
        {openForm && (
          <CreateProduct setOpenForm={setOpenForm} readBalance={readBalance} />
        )}
        <DisplayProducts query={searchQuery} readBalance={readBalance} />
      </main>
    </>
  );
}

export default App;
