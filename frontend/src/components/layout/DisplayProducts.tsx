import axios from "axios";
import { X } from "lucide-react";
import { useEffect, useState } from "react";
import ProductDetails from "../ui/ProductDetails";

export default function DisplayProducts() {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);

  useEffect(() => {
    axios
      .get("/get-products")
      .then((response) => {
        console.log("Fetched products:", response.data.products);
        setProducts(response.data.products);
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
      });
  }, []);

  const buyProduct = (product: any) => {
    alert(`Buying product: ${product.name} for ${product.price} MNEE`);
  };

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
            className="absolute top-2 right-2  m-5"
            color="red"
            onClick={() => setSelectedProduct(null)}
          />
          <ProductDetails product={selectedProduct} buyProduct={buyProduct} />
        </div>
      )}
    </div>
  );
}
