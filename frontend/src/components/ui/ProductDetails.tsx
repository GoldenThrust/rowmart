import { useState } from "react";

export default function ProductDetails({
  disableSubmit,
  product,
  buyProduct,
  defaultEmail,
}: {
  disableSubmit: boolean;
  product: any;
  buyProduct: (
    product: any,
    quantity: number,
    sellerEmail: string,
    price: Number
  ) => void;
  defaultEmail: string;
}) {
  const [quantity, setQuantity] = useState(1);
  const [email, setEmail] = useState<string>(defaultEmail);

  const price = quantity * product.price;

  return (
    <div
      className="relative bg-neutral-950 rounded-2xl shadow-xl
                w-full max-w-3xl max-h-[90vh] flex flex-col overflow-scroll"
    >
      {/* Image */}
      <div className="shrink-0">
        <img
          src={`https://ipfs.io/ipfs/${product.imageCid}`}
          alt={product.name}
          className="w-full h-72 object-cover"
        />
      </div>

      {/* Content */}
      <div className="p-6 space-y-4">
        {/* Title + Price */}
        <div className="flex justify-between items-start">
          <h2 className="text-2xl font-bold text-stone-400">{product.name}</h2>
          <div className="flex flex-col gap-3 items-end ">
            <span className="flex items-center gap-2 text-sm text-gray-500 *:border-2 *:border-gray-600 *:p-1 *:rounded-lg">
              <span
                className="select-none"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              >
                −
              </span>

              <input
                type="number"
                min={1}
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="select-none w-10 p-5 text-center"
              />

              <span
                className="select-none"
                onClick={() => setQuantity((q) => q + 1)}
              >
                +
              </span>
            </span>

            <span className="text-xl font-semibold text-emerald-600">
              {price} MNEE
            </span>
          </div>
        </div>

        {/* Buyer Email */}
        <label
          className="block text-sm font-medium text-gray-700"
          htmlFor="buyer-email"
        >
          Buyer Email
        </label>
        <input
          type="text"
          id="buyer-email"
          defaultValue={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 border rounded-lg"
          placeholder="Enter you email"
        />

        {/* Actions */}
        <div className="py-5 flex gap-3">
          <button
            className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white py-3 rounded-xl font-semibold transition"
            onClick={() => buyProduct(product, quantity, email, price)}
            disabled={disableSubmit}
          >
            {disableSubmit ? "Processing Transaction" : "Buy Now"}
          </button>

          <a
            href={`mailto:${product.email}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-1 border justify-center items-center border-gray-300 hover:bg-gray-100 hover:text-gray-900 py-3 rounded-xl font-semibold transition"
          >
            Contact Seller
          </a>
        </div>

        {/* Description */}
        <p className="text-gray-600 leading-relaxed">
          {product.description}
        </p>

        {/* Seller Info */}
        <div className="border-t pt-4 grid grid-cols-2 gap-4 text-sm text-gray-500">
          <div>
            <p className="font-medium text-gray-700">Seller Address</p>
            <p className="truncate">{product.seller}</p>
          </div>

          <div>
            <p className="font-medium text-gray-700">Contact</p>
            <p className="truncate">{product.email}</p>
          </div>
        </div>

        {/* Meta */}
        <div className="border-t pt-4 grid grid-cols-2 gap-4 text-sm text-gray-500">
          <div>
            <p className="font-medium text-gray-700">Product ID</p>
            <p className="truncate">{product.productId}</p>
          </div>

          <div>
            <p className="font-medium text-gray-700">Created</p>
            <p>{new Date(product.createdAt).toLocaleDateString()}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
