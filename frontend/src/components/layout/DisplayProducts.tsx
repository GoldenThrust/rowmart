import axios from "axios";
import { useEffect, useState } from "react";
import ProductDetails from "../ui/ProductDetails";
import { useConnection } from "wagmi";
import toast from "react-hot-toast";
import useCreateTransaction from "../../contracts/hooks/useCreateTransaction";
import useReadBalance from "../../contracts/hooks/useReadBalance";

/* --------------------------- Component --------------------------- */

export default function DisplayProducts({
  query,
  readBalance,
}: {
  query: string | null;
  readBalance: ReturnType<typeof useReadBalance>;
}) {
  const { address } = useConnection();

  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [disableSubmit, setDisableSubmit] = useState(false);
  const [userEmail, setUserEmail] = useState("");

  const { approveAndBuy, isPending } = useCreateTransaction();

  /* ------------------------- Fetch Products ------------------------ */

  useEffect(() => {
    axios
      .get(query ? `/get-products?search=${query}` : `/get-products`)
      .then((res) => setProducts(res.data.products))
      .catch((err) => console.error("Error fetching products:", err));
  }, [query]);

  /* --------------------------- Buy Flow --------------------------- */

  const buyProduct = async (
    product: Product,
    quantity: number,
    buyerEmail: string,
    price: number
  ) => {
    try {
      setDisableSubmit(true);

      toast.loading("Processing transaction…", { id: "buy-product" });

      const res = await axios.post("/create-transaction", {
        productId: product._id,
        price: product.price,
        quantity,
        seller: product.seller,
        buyer: address,
        buyerEmail,
      });

      localStorage.setItem("user-email", buyerEmail);

      const { _id, detailsCid } = res.data.transaction;

      try {
        if (!product.productId || Number(product.productId) <= 0) {
          throw new Error("Invalid productId");
        }

        await approveAndBuy(
          BigInt(product.productId),
          quantity,
          detailsCid,
          price.toString()
        );

        readBalance.refetchBalance();
        readBalance.refetchEthBalance();

        toast.success("Purchase successful", { id: "buy-product" });
      } catch (err) {
        await axios.delete("/delete-transaction", {
          data: { id: _id },
        });

        toast.error("Blockchain transaction failed", {
          id: "buy-product",
        });
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? "Transaction failed", {
        id: "buy-product",
      });
    } finally {
      setDisableSubmit(false);
      setSelectedProduct(null);
    }
  };

  /* ----------------------- Persist Email -------------------------- */

  useEffect(() => {
    setUserEmail(localStorage.getItem("user-email") ?? "");
  }, []);

  /* ----------------------------- UI ------------------------------ */

  return (
    <div className="relative">
      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 p-6">
        {products.length > 0 ? (
          products.map((product) => (
            <div
              key={product._id}
              className="group bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden hover:border-neutral-600 hover:shadow-xl transition cursor-pointer"
            >
              {/* Image */}
              <div
                className="relative h-48 overflow-hidden"
                onClick={() => setSelectedProduct(product)}
              >
                <img
                  src={`https://ipfs.io/ipfs/${product.imageCid}`}
                  alt={product.name}
                  className="h-full w-full object-cover group-hover:scale-105 transition"
                />
              </div>

              {/* Content */}
              <div className="p-4 flex flex-col gap-3">
                <div>
                  <h3 className="font-medium text-sm truncate">
                    {product.name}
                  </h3>
                  <p className="text-xs text-neutral-400">
                    {product.price} MNEE
                  </p>
                </div>

                <button
                  onClick={() => setSelectedProduct(product)}
                  className="mt-auto bg-emerald-600 hover:bg-emerald-500 text-xs py-2 rounded-lg transition"
                >
                  Buy Now
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full flex flex-col items-center justify-center text-neutral-500 h-[40vh]">
            <p>No products available</p>
            <p className="text-xs mt-1">Check back later</p>
          </div>
        )}
      </div>

      {/* Product Modal */}
      {selectedProduct && (
        <ProductDetails
          setSelectedProduct={setSelectedProduct}
          product={selectedProduct}
          buyProduct={buyProduct}
          disableSubmit={isPending || disableSubmit}
          defaultEmail={userEmail}
        />
      )}
    </div>
  );
}
