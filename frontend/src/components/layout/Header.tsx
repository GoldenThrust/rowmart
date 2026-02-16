import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AccountConnectButton } from "../ui/ConnectButton";
import { Menu } from "lucide-react";
import MobileMenu from "../ui/MobileMenu";
import { useConnection } from "wagmi";
import CreateProduct from "./CreateProducts";
import Orders from "./Orders";

export default function MainHeader({
  setSearchQuery,
}: {
  setSearchQuery?: Dispatch<SetStateAction<string | null>>;
}) {
  const [openListingForm, setOpenListingForm] = useState(false);
  const [openOrderOverlay, setOpenOrderOverlay] = useState(false);
  const [openMenu, setOpenMenu] = useState(false);
  const { isConnected } = useConnection();

  useEffect(() => {
    document.body.style.overflow = openMenu ? "hidden" : "auto";
  }, [openMenu]);

  return (
    <header>
      <div className="sticky top-0 z-40 border-b border-neutral-800 bg-neutral-950/90 backdrop-blur">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <img src="/logo.png" className="w-8 h-8" />
            <h1 className="hidden lg:block text-xl font-semibold">RowMart</h1>
          </div>

          {/* Search (hidden on mobile when menu open) */}
          <div className="hidden lg:flex flex-1 max-w-xl mx-8">
            <input
              type="search"
              placeholder="Search products…"
              onChange={(e) => setSearchQuery?.(e.target.value)}
              className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-2 text-sm"
            />
          </div>

          {/* Desktop actions */}
          <div className="hidden lg:flex items-center gap-4">
            <Link
              to="/dashboard"
              className="text-xs text-gray-500 hover:text-indigo-500 transition-colors duration-300 transform hover:scale-105"
            >
              Dashboard
            </Link>
            <button
              onClick={() => setOpenOrderOverlay(true)}
              className="px-4 py-2 rounded-lg border border-neutral-800"
            >
              Orders
            </button>

            <AccountConnectButton />

            {isConnected && (
              <button
                onClick={() => setOpenListingForm(true)}
                className="bg-emerald-600 px-4 py-2 rounded-lg font-medium"
              >
                Sell Now
              </button>
            )}
          </div>

          {/* Mobile menu icon */}
          <button className="lg:hidden" onClick={() => setOpenMenu(true)}>
            <Menu />
          </button>
        </div>
      </div>

      <MobileMenu
        open={openMenu}
        onClose={() => setOpenMenu(false)}
        onOrders={() => setOpenOrderOverlay(true)}
        onSell={() => setOpenListingForm(true)}
        isConnected={isConnected}
      />

      {/* Create Product Modal */}
      {openListingForm && (
        <CreateProduct setOpenListingForm={setOpenListingForm} />
      )}

      {/* Orders Overlay */}
      {openOrderOverlay && <Orders setOpenOrderOverlay={setOpenOrderOverlay} />}
    </header>
  );
}
