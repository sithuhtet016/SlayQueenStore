import { useEffect, useState } from "react";
import { Navbar } from "~/components/Navbar";
import { Footer } from "~/components/Footer";

type Order = {
  id: number;
  items: Array<{ productId: number; variantId?: number; quantity: number }>;
  total: number;
  currency: string;
  lineItemsSummary?: string;
  createdAt: string;
};

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      if (typeof window === "undefined") return [];
      const stored = JSON.parse(window.localStorage.getItem("orders") || "[]");
      return Array.isArray(stored) ? stored : [];
    } catch (_e) {
      return [];
    }
  });

  const clearHistory = () => {
    if (typeof window === "undefined") return;
    window.localStorage.removeItem("orders");
    setOrders([]);
  };

  return (
    <div className="min-w-[402px] min-h-screen mt-[72px]">
      <Navbar />
      <section className="px-4 md:px-7 py-6">
        <h1 className="text-[28px] font-bold text-[#3D2645] mb-2">
          Order History
        </h1>
        <p className="text-[14px] text-[#2B2520] font-semibold mb-5">
          Review your past orders.
        </p>

        {orders.length === 0 ? (
          <div className="min-h-[90vh] bg-white rounded-2xl p-6 shadow-sm flex flex-col items-center justify-center text-center gap-4">
            <p className="text-[#2B2520] text-[24px] font-semibold mb-2">
              No order history
            </p>
            <p className="text-[14px] text-[#3D2645]">
              You haven't placed any orders yet.
            </p>
            <a
              href="/categories"
              className="text-[14px] bg-[#D4AF37] text-[#3D2645] font-bold px-6 py-3 rounded-lg hover:bg-[#b8962e] transition-colors"
            >
              Continue Shopping
            </a>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="bg-white p-4 rounded shadow-sm">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-bold text-[#3D2645]">
                      Order #{order.id}
                    </p>
                    <p className="text-[12px] text-[#2B2520]">
                      {new Date(order.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <div className="text-[#D4AF37] font-bold">
                    {order.currency} {order.total}
                  </div>
                </div>
                <pre className="mt-3 text-[12px] text-[#2B2520] whitespace-pre-wrap">
                  {order.lineItemsSummary}
                </pre>
              </div>
            ))}

            <div className="flex justify-end">
              <button
                className="bg-[#B97C86] text-white font-bold px-4 py-2 rounded"
                onClick={clearHistory}
              >
                Clear History
              </button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

