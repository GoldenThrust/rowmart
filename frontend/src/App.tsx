import { useConnect, useConnection } from "wagmi";
import { useState } from "react";

import CreateProduct from "./components/layout/CreateProducts";
import DisplayProducts from "./components/layout/DisplayProducts";
import Orders from "./components/layout/Orders";
import { AccountConnectButton } from "./components/ui/ConnectButton";

import useReadBalance from "./contracts/hooks/useReadBalance";
import { useWatchTokenTransfers } from "./contracts/hooks/events/TransferEvents";

function App() {
  const { address, isConnected } = useConnection();
  const { error } = useConnect();

  const [openListingForm, setOpenListingForm] = useState(false);
  const [openOrderOverlay, setOpenOrderOverlay] = useState(false);
  const [searchQuery, setSearchQuery] = useState<string | null>(null);

  const readBalance = useReadBalance();

  /* ----------------------- Watch Transfers ----------------------- */

  useWatchTokenTransfers(address, () => {
    readBalance.refetchBalance();
    readBalance.refetchEthBalance();
    console.log("Transfer detected, balances updated.");
  });

  /* ----------------------------- UI ------------------------------ */

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-neutral-800 bg-neutral-950/90 backdrop-blur">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <img src="logo.png" alt="RowMart" className="w-8 h-8" />
            <h1 className="text-xl font-semibold tracking-tight">
              RowMart
            </h1>
          </div>

          {/* Search */}
          <div className="flex-1 max-w-xl mx-8">
            <input
              type="search"
              placeholder="Search products, collections, creators…"
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-2 text-sm placeholder-neutral-500 focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setOpenOrderOverlay(true)}
              className="text-sm px-4 py-2 rounded-lg border border-neutral-800 hover:border-neutral-600 transition"
            >
              Orders
            </button>

            <AccountConnectButton readBalance={readBalance} />

            {isConnected && (
              <button
                onClick={() => setOpenListingForm(true)}
                className="bg-emerald-600 hover:bg-emerald-500 text-sm px-4 py-2 rounded-lg font-medium transition"
              >
                Sell Product
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Error */}
      {error && (
        <div className="max-w-7xl mx-auto px-6 pt-4">
          <div className="bg-red-600/20 border border-red-600/40 text-red-400 text-sm px-4 py-2 rounded-lg">
            {error.message}
          </div>
        </div>
      )}

      {/* Main */}
      <main className="max-w-7xl mx-auto">
        {/* Create Product Modal */}
        {openListingForm && (
          <CreateProduct
            setOpenListingForm={setOpenListingForm}
            readBalance={readBalance}
          />
        )}

        {/* Orders Overlay */}
        {openOrderOverlay && (
          <Orders setOpenOrderOverlay={setOpenOrderOverlay} />
        )}

        {/* Products */}
        <DisplayProducts
          query={searchQuery}
          readBalance={readBalance}
        />
      </main>
    </div>
  );
}

export default App;
