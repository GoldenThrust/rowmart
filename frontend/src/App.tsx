import { useConnect, useConnection } from "wagmi";
// import { MarketplaceContractConfig } from "./contracts/marketPlace";
import CreateProduct from "./components/layout/CreateProducts";
import { useEffect, useState } from "react";
import { AccountConnectButton } from "./components/ui/ConnectButton";

function App() {
  const { isConnected } = useConnection();
  const { error } = useConnect();
  const [openForm, setOpenForm] = useState<boolean>(false);

  return (
    <>
      <header className="flex justify-between items-center p-4">
        <h1 className="text-2xl font-bold font-serif text-emerald-600  text-shadow-sm text-shadow-blue-800">
          RowMart
        </h1>
        {/* <ConnectButton /> */}
        <AccountConnectButton />

        {isConnected && (
          <button
            type="button"
            onClick={() => setOpenForm(() => !openForm)}
           className="p-2 rounded-lg bg-gray-800 font-bold shadow-lg shadow-black border-2 border-neutral-600"
          >
            Create Product
          </button>
        )}
      </header>
      <main>
        <div>{error?.message}</div>
        {openForm && <CreateProduct setOpenForm={setOpenForm} />}
      </main>
    </>
  );
}

export default App;
