import { useConnect } from "wagmi";
import { useState } from "react";

import DisplayProducts from "../components/layout/DisplayProducts";

import MainHeader from "../components/layout/Header";

function Home() {
  const { error } = useConnect();

  const [searchQuery, setSearchQuery] = useState<string | null>(null);

  // TODO: Listen to product and transaction event and update on frontend update

  /* ----------------------------- UI ------------------------------ */

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100">
      
      <MainHeader setSearchQuery={setSearchQuery} />

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

        {/* Products */}
        <DisplayProducts query={searchQuery} />
      </main>
    </div>
  );
}

export default Home;
