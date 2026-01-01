import { X } from "lucide-react";
import { Dispatch, SetStateAction, useState } from "react";
import { Link } from "react-router-dom";

/* ----------------------------- Types ----------------------------- */
export default function ProductDetails({
  disableSubmit,
  product,
  setSelectedProduct,
  buyProduct,
  defaultEmail,
}: {
  disableSubmit: boolean;
  product: any;
  setSelectedProduct: Dispatch<SetStateAction<Product | null>>;
  buyProduct: (
    product: any,
    quantity: number,
    buyerEmail: string,
    price: number
  ) => void;
  defaultEmail: string;
}) {
  const [quantity, setQuantity] = useState(1);
  const [email, setEmail] = useState(defaultEmail);

  const totalPrice = quantity * Number(product.price);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="relative w-full max-w-5xl bg-neutral-950 rounded-2xl shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-neutral-800 sticky top-0 bg-neutral-950 z-10">
          <h2 className="text-lg font-semibold text-white">{product.name}</h2>
          <X
            onClick={() => setSelectedProduct(null)}
            className="cursor-pointer text-gray-400 hover:text-red-500"
          />
        </div>

        {/* Content */}
        <div className="flex flex-col md:flex-row overflow-hidden">
          {/* Left: Scrollable product info */}
          <div className="flex-1 p-6 overflow-y-auto max-h-[80vh] space-y-4">
            <img
              src={`https://ipfs.io/ipfs/${product.imageCid}`}
              alt={product.name}
              className="w-full h-72 object-cover rounded-xl"
            />

            <p className="text-sm text-neutral-400">{product.description}</p>

            {/* Seller Info */}
            <div className="grid grid-cols-2 gap-4 text-sm text-neutral-400 border-t border-neutral-800 pt-4">
              <div>
                <p className="text-neutral-500">Seller Address</p>
                <p className="truncate text-neutral-200">{product.seller}</p>
              </div>
              <div>
                <p className="text-neutral-500">Contact</p>
                <p className="truncate text-neutral-200">{product.email}</p>
              </div>
            </div>

            {/* Meta */}
            <div className="grid grid-cols-2 gap-4 text-sm text-neutral-400 border-t border-neutral-800 pt-4">
              <div>
                <p className="text-neutral-500">Product ID</p>
                <p className="text-neutral-200">{product.productId}</p>
              </div>
              <div>
                <p className="text-neutral-500">Created</p>
                <p className="text-neutral-200">
                  {new Date(product.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>

          {/* Right: Sticky Purchase Panel */}
          <div className="w-full md:w-80 bg-neutral-900 border border-neutral-800 rounded-2xl p-5 space-y-4 sticky top-6 self-start m-6 md:m-0">
            <h3 className="text-sm font-medium text-white">Purchase Summary</h3>

            {/* Quantity */}
            <div className="space-y-1">
              <p className="text-xs text-neutral-500">Quantity</p>
              <div className="flex items-center justify-between border border-neutral-700 rounded-lg px-3 py-2">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="text-lg text-neutral-400 hover:text-white"
                >
                  −
                </button>
                <input
                  type="number"
                  min={1}
                  value={quantity}
                  onChange={(e) =>
                    setQuantity(Math.max(1, Number(e.target.value)))
                  }
                  className="w-12 bg-transparent text-center outline-none text-white"
                />
                <button
                  type="button"
                  onClick={() => setQuantity((q) => q + 1)}
                  className="text-lg text-neutral-400 hover:text-white"
                >
                  +
                </button>
              </div>
            </div>

            {/* Buyer Email */}
            <div className="space-y-1">
              <p className="text-xs text-neutral-500">Buyer Email</p>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full bg-neutral-950 border border-neutral-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            {/* Price */}
            <div className="border-t border-neutral-800 pt-3 space-y-1 text-sm">
              <div className="flex justify-between text-neutral-400">
                <span>Unit Price</span>
                <span>{Number(product.price).toLocaleString()} MNEE</span>
              </div>
              <div className="flex justify-between font-semibold text-emerald-400">
                <span>Total</span>
                <span>{totalPrice.toLocaleString()} MNEE</span>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-2 pt-2">
              <button
                onClick={() => buyProduct(product, quantity, email, totalPrice)}
                disabled={disableSubmit}
                className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:bg-neutral-700 disabled:cursor-not-allowed py-3 rounded-xl font-semibold transition"
              >
                {disableSubmit ? "Processing…" : "Confirm Purchase"}
              </button>

              <Link
                to={`mailto:${product.email}`}
                className="w-full flex justify-center items-center border border-neutral-700 hover:border-neutral-500 py-2 rounded-xl text-sm transition text-white"
              >
                Contact Seller
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
