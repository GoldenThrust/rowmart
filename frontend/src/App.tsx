import { useConnect, useConnection } from "wagmi";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

import CreateProduct from "./components/layout/CreateProducts";
import DisplayProducts from "./components/layout/DisplayProducts";
import Orders from "./components/layout/Orders";
import { AccountConnectButton } from "./components/ui/ConnectButton";

import useReadBalance from "./contracts/hooks/useReadBalance";
import { useWatchTokenTransfers } from "./contracts/hooks/events/TransferEvents";
import axios from "axios";
import { useWatchTokenApproval } from "./contracts/hooks/events/ApprovalEvents";
import { Menu, X } from "lucide-react";

async function wakeServer(setServerActive: Dispatch<SetStateAction<boolean>>) {
  while (true) {
    try {
      const res = await axios.get("health");
      if (res.data.status === "ok") {
        setServerActive(true);
        return;
      }
    } catch {}
    await new Promise((r) => setTimeout(r, 7000));
  }
}

function App() {
  const { address, isConnected } = useConnection();
  const { error } = useConnect();

  const [openListingForm, setOpenListingForm] = useState(false);
  const [openOrderOverlay, setOpenOrderOverlay] = useState(false);
  const [searchQuery, setSearchQuery] = useState<string | null>(null);
  const [serverActive, setServerActive] = useState(false);
  const [openMenu, setOpenMenu] = useState(false);

  const readBalance = useReadBalance();

  // TODO: Listen to product and transaction event and update on frontend update

  /* ----------------------- Watch Transfers ----------------------- */

  useWatchTokenTransfers(address, () => {
    readBalance.refetchBalance();
    readBalance.refetchEthBalance();
  });

  useWatchTokenApproval(address);

  useEffect(() => {
    wakeServer(setServerActive);
  }, []);

  /* ----------------------------- UI ------------------------------ */

  if (!serverActive)
    return (
      <div className="min-h-screen bg-neutral-950">
        {/* Brand */}
        <div className="p-5 flex items-center gap-3">
          <img src="logo.png" alt="RowMart" className="w-8 h-8" />
          <h1 className="text-xl font-semibold tracking-tight">RowMart</h1>
        </div>
        <div className="absolute top-1/2 left-1/2 -translate-1/2 text-neutral-500">
          Server is starting. Please wait.
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-neutral-800 bg-neutral-950/90 backdrop-blur">
        <div className="max-w-7xl mx-auto flex items-center justify-between md:p-0 px-6 py-4">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="RowMart" className="w-8 h-8 max-w-8" />
            <h1 className="text-xl font-semibold tracking-tight md:block hidden">
              RowMart
            </h1>
          </div>

          {/* Search */}
          <div className="flex-1 max-w-xl mx-8">
            <input
              type="search"
              placeholder="Search products………………"
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-2 text-sm placeholder-neutral-500 focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Actions */}
          <div
            className={`md:items-center md:gap-4 md:flex md:flex-row md:static md:w-auto md:h-auto absolute top-0 left-0 flex-col w-full h-screen gap-10 p-5 ${openMenu ? "flex" : "hidden"}`}
          >
            <button
              onClick={() => setOpenOrderOverlay(true)}
              className="text-sm px-4 py-2 rounded-lg border border-neutral-800 hover:border-neutral-600 transition order-1"
            >
              Orders
            </button>

            <AccountConnectButton readBalance={readBalance} />

            {isConnected && (
              <button
              onClick={() => setOpenListingForm(true)}
              className="bg-emerald-600 hover:bg-emerald-500 text-sm px-4 py-2 rounded-lg font-medium transition order-1"
              >
                Sell Now
              </button>
            )}
            <X width={`50px`} height={`50px`} color="gray" 
            onClick={() => setOpenMenu(false)}
            className="block md:hidden order-2 m-auto bg-neutral-800 rounded-full p-3"/>

          </div>

          {/* mobile */}
          <Menu
            className="md:hidden"
            onClick={() => setOpenMenu(true)}
          />
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
        <DisplayProducts query={searchQuery} />
      </main>
    </div>
  );
}

export default App;
