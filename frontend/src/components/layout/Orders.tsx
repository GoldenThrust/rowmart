import axios from "axios";
import { X } from "lucide-react";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useConnection } from "wagmi";

/* ----------------------------- Types ----------------------------- */

type OrderStatus = "all" | "pending" | "completed" | "refunded" | "disputed";

type Product = {
  name: string;
  description: string;
  imageCid: string;
  price: string;
  seller: string;
};

type Order = {
  _id: string;
  buyer: string;
  seller: string;
  quantity: number;
  price: number;
  status: OrderStatus;
  transactionId: string;
  createdAt: string;
  updatedAt: string;
  product: Product;
};

/* ---------------------------- Helpers ---------------------------- */

const shortAddress = (addr?: string) =>
  addr ? `${addr.slice(0, 6)}...${addr.slice(-4)}` : "";

const statusColor = (status: string) => {
  switch (status) {
    case "completed":
      return "bg-green-600/20 text-green-400 border-green-600/40";
    case "pending":
      return "bg-yellow-600/20 text-yellow-400 border-yellow-600/40";
    case "refunded":
      return "bg-red-600/20 text-red-400 border-red-600/40";
    case "disputed":
      return "bg-purple-600/20 text-purple-400 border-purple-600/40";
    default:
      return "bg-neutral-700/20 text-neutral-400 border-neutral-700";
  }
};

/* --------------------------- Component --------------------------- */

export default function Orders({
  setOpenOrderOverlay,
}: {
  setOpenOrderOverlay: Dispatch<SetStateAction<boolean>>;
}) {
  const { address } = useConnection();

  const [isSeller, setIsSeller] = useState<boolean | null>(null);
  const [status, setStatus] = useState<OrderStatus>("all");
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);

  /* ------------------------- Fetch Orders ------------------------ */

  useEffect(() => {
    if (!address) return;

    const fetchOrders = async () => {
      try {
        setLoading(true);

        const res = await axios.get("/get-transactions", {
          params: {
            address,
            isSeller,
            status: status === "all" ? undefined : status,
          },
        });

        setOrders(res.data.transactions);
      } catch (error) {
        console.error("Failed to fetch orders", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [address, isSeller, status]);

  /* ----------------------------- UI ------------------------------ */

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
      <div className="relative bg-neutral-950 w-140 max-h-[90vh] rounded-2xl border border-neutral-800 p-6 flex flex-col gap-6">
        {/* Close */}
        <X
          className="absolute right-5 top-5 cursor-pointer text-red-500"
          onClick={() => setOpenOrderOverlay(false)}
        />

        {/* Header */}
        <h2 className="text-lg font-semibold">My Orders</h2>

        {/* Filters */}
        <div className="flex flex-col gap-4">
          {/* Status Filter */}
          <div className="space-y-2">
            <p className="text-xs text-neutral-500">Status</p>
            <div className="flex gap-2 text-xs">
              {(
                [
                  "all",
                  "pending",
                  "completed",
                  "refunded",
                  "disputed",
                ] as OrderStatus[]
              ).map((s) => (
                <button
                  key={s}
                  onClick={() => setStatus(s)}
                  className={`px-3 py-1 rounded-md border transition ${
                    status === s
                      ? "bg-green-600 border-green-500"
                      : "border-neutral-700 hover:border-neutral-600"
                  }`}
                >
                  {s.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          {/* Buy / Sell Filter */}
          <div className="flex justify-end gap-2 text-xs">
            <span className="text-neutral-500 mr-2">View</span>
            <button
              onClick={() => setIsSeller(false)}
              className={`px-3 py-1 rounded-md border ${
                isSeller === false
                  ? "bg-blue-600 border-blue-500"
                  : "border-neutral-700"
              }`}
            >
              Buy
            </button>
            <button
              onClick={() => setIsSeller(true)}
              className={`px-3 py-1 rounded-md border ${
                isSeller === true
                  ? "bg-purple-600 border-purple-500"
                  : "border-neutral-700"
              }`}
            >
              Sell
            </button>
          </div>
        </div>

        {/* Orders List */}
        <div className="flex flex-col gap-3 overflow-y-auto pr-1">
          {loading && (
            <p className="text-sm text-neutral-400">Loading orders…</p>
          )}

          {!loading && orders.length === 0 && (
            <p className="text-sm text-neutral-400">No orders found</p>
          )}

          {orders.map((order) => {
            const isSellOrder = address === order.seller;
            const total = order.quantity * Number(order.price);

            return (
              <div
                key={order._id}
                className="flex gap-4 border border-neutral-800 rounded-xl p-4 bg-neutral-900 hover:border-neutral-700 transition"
              >
                {/* Image */}
                <img
                  src={`https://ipfs.io/ipfs/${order.product.imageCid}`}
                  alt={order.product.name}
                  className="w-20 h-20 rounded-lg object-cover border border-neutral-800"
                />

                {/* Content */}
                <div className="flex-1 flex flex-col gap-2">
                  {/* Header */}
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">
                        {order.product.name}
                      </p>
                      <p className="text-xs text-neutral-400 line-clamp-1">
                        {order.product.description}
                      </p>
                    </div>

                    <span
                      className={`text-xs px-2 py-1 rounded-md border ${statusColor(
                        order.status
                      )}`}
                    >
                      {order.status.toUpperCase()}
                    </span>
                  </div>

                  {/* Pricing */}
                  <div className="grid grid-cols-2 gap-y-1 text-xs text-neutral-400">
                    <p>Type</p>
                    <p className="text-right">
                      {isSellOrder ? "Sell Order" : "Buy Order"}
                    </p>

                    <p>Quantity</p>
                    <p className="text-right">{order.quantity}</p>

                    <p>Unit Price</p>
                    <p className="text-right">
                      {Number(order.price).toLocaleString()} ₦
                    </p>

                    <p>Total</p>
                    <p className="text-right font-medium text-neutral-200">
                      {total.toLocaleString()} ₦
                    </p>
                  </div>

                  {/* Addresses */}
                  <div className="flex justify-between text-xs text-neutral-500 pt-2 border-t border-neutral-800">
                    <p>
                      {isSellOrder ? "Buyer" : "Seller"}:{" "}
                      <span className="text-neutral-300">
                        {shortAddress(
                          isSellOrder ? order.buyer : order.seller
                        )}
                      </span>
                    </p>
                    <p>Tx #{order.transactionId}</p>
                  </div>

                  {/* Time */}
                  <p className="text-[11px] text-neutral-600 text-right">
                    {new Date(order.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
