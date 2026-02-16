import { useConnection } from "wagmi";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import useReadBalance from "./contracts/hooks/useReadBalance";
import { useWatchTokenTransfers } from "./contracts/hooks/events/TransferEvents";
import axios from "axios";
import { useWatchTokenApproval } from "./contracts/hooks/events/ApprovalEvents";
import { useWatchProductCreated } from "./contracts/hooks/events/ProductCreatedEvents";
import Home from "./pages/Home";

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
  const { address } = useConnection();

  const [serverActive, setServerActive] = useState(false);
  const [openMenu, _] = useState(false);

  const readBalance = useReadBalance();

  // TODO: Listen to product and transaction event and update on frontend update

  /* ----------------------- Watch Transfers ----------------------- */

  useWatchTokenTransfers(address, () => {
    readBalance.refetchBalance();
    readBalance.refetchEthBalance();
  });

  useWatchTokenApproval(address);

  useWatchProductCreated();

  useEffect(() => {
    wakeServer(setServerActive);
  }, []);

  useEffect(() => {
    document.body.style.overflow = openMenu ? "hidden" : "auto";
  }, [openMenu]);

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

  return <Home />
}

export default App;
