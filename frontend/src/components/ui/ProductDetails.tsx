export default function ProductDetails({ product, buyProduct }: { product: any, buyProduct: (product: any) => void }) {

  return (
    <div className="bg-neutral-950 rounded-2xl shadow-xl max-w-3xl w-4/5 md:max-full overflow-hidden">
      {/* Image */}
      <div className="relative">
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
          <span className="text-xl font-semibold text-emerald-600">
            {product.price} MNEE
          </span>
        </div>

        {/* Description */}
        <p className="text-gray-600 leading-relaxed">{product.description}</p>

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

        {/* Actions */}
        <div className="pt-6 flex gap-3">
          <button
            className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white py-3 rounded-xl font-semibold transition"
            onClick={() => buyProduct(product)}
          >
            Buy Now
          </button>

          <a
            href={`mailto:${product.email}`} 
            target="_blank" rel="noopener noreferrer"
            className="flex flex-1 border justify-center items-center border-gray-300 hover:bg-gray-100 hover:text-gray-900 py-3 rounded-xl font-semibold transition"
          >
            Contact Seller
          </a>
        </div>
      </div>
    </div>
  );
}
