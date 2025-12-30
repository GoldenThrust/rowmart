import axios from "axios";
import { X } from "lucide-react";
import { useEffect, useState } from "react";
import ProductDetails from "../ui/ProductDetails";
import { useConnection } from "wagmi";
import toast from "react-hot-toast";
import useCreateTransaction from "../../contracts/hooks/useCreateTransaction";

export default function DisplayProducts() {
  const { address } = useConnection();
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const { approveAndBuy, isPending } = useCreateTransaction();
  const [disableSubmit, setDisableSubmit] = useState<boolean>(false);
  const [userEmail, setUserEmail] = useState<string>("");

  useEffect(() => {
    axios
      .get("/get-products")
      .then((response) => {
        setProducts(response.data.products);
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
      });
  }, []);

  const buyProduct = async (
    product: any,
    quantity: number,
    sellerEmail: string,
    price: Number
  ) => {
    try {
      setDisableSubmit(true);

      const response = await axios.post("create-transaction", {
        productId: product._id,
        price: product.price,
        quantity,
        seller: product.seller,
        buyer: address,
        sellerEmail,
      });

      localStorage.setItem("user-email", sellerEmail);

      const { _id: id, detailsCid } = response.data.transaction;

      toast.success("Product listed successfully!", {
        id: "create-product",
      });

      try {
        await approveAndBuy(
          BigInt(product.productId!),
          quantity,
          detailsCid,
          BigInt(price.toString())
        );
      } catch (error) {
        axios
          .delete("/delete-product", {
            data: {
              id,
            },
          })
          .then(() => {
            toast("Product deleted");
          })
          .catch(() => {
            toast("Failed to delete product");
          });
      }
    } catch (error: any) {
      toast.error(`Error: ${error.response.data.message}`, {
        id: "create-product",
      });
    } finally {
      setDisableSubmit(false);
    }
  };

  useEffect(() => {
    setUserEmail(localStorage.getItem("user-email") ?? "");
  }, [setUserEmail]);

  return (
    // TODO: listen to product creation events and update the products list in real-time
    // TODO: click to show products details
    <div>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
        {products.map((product: any) => (
          <div
            key={product._id}
            className="border p-4 rounded-lg shadow-lg"
            onClick={() => setSelectedProduct(product)}
          >
            <img
              src={`https://ipfs.io/ipfs/${product.imageCid}`}
              alt={product.name}
              className="w-full h-48 object-cover rounded-lg"
            />
            {/* TODO: display amount of products sold successfully by user to build trust and also user rating */}
            <div className="mt-4 flex flex-row justify-between items-center">
              <span>
                <h2 className="text-lg font-semibold mt-2">{product.name}</h2>
                <p className="text-gray-500">{product.price} MNEE</p>
              </span>
              <span>
                <button className="bg-emerald-500 text-white px-4 py-2 rounded-lg">
                  Buy
                </button>
              </span>
            </div>
          </div>
          // TODO: add pagination and search products
        ))}
      </div>
      {selectedProduct && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <X
            className="absolute top-4 right-4 cursor-pointer"
            color="red"
            onClick={() => setSelectedProduct(null)}
          />

          <ProductDetails
            product={selectedProduct}
            buyProduct={buyProduct}
            disableSubmit={isPending || disableSubmit}
            defaultEmail={userEmail}
          />
        </div>
      )}
    </div>
  );
}
