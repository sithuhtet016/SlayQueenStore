import { useMemo } from "react";
import { Link } from "react-router";
import productsData from "../../public/data/products.json";
import { Footer } from "~/components/Footer";
import { Navbar } from "~/components/Navbar";
import { useCart } from "~/cart-context";
import resolveImagePath from "~/utils/images";

const products = productsData as Array<{
  id: number;
  name: string;
  price: number;
  currency: string;
  images: string[];
  variants?: { id: number; name: string; image: string; price?: number }[];
}>;

export default function Cart() {
  const { items, cartCount, updateQuantity } = useCart();

  const enriched = useMemo(() => {
    return items.map((item) => {
      const product = products.find((p) => p.id === item.productId);
      const variant = product?.variants?.find((v) => v.id === item.variantId);
      return { item, product, variant };
    });
  }, [items]);

  // Consider the cart has items if storage contains items (even if product data
  // is missing). This ensures items don't 'disappear' from the UI on refresh.
  const hasItems = items.length > 0;

  const total = enriched.reduce((sum, entry) => {
    const unitPrice = entry.variant?.price ?? entry.product?.price ?? 0;
    return sum + unitPrice * entry.item.quantity;
  }, 0);

  const currency = enriched.find((e) => e.product)?.product?.currency ?? "AED";

  const formatCurrency = (amount: number) => {
    try {
      return new Intl.NumberFormat("en-AE", {
        style: "currency",
        currency,
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(amount);
    } catch (_e) {
      return `${currency} ${amount}`;
    }
  };

  return (
    <div className="min-w-[402px] min-h-screen mt-[72px]">
      <Navbar />

      <section className="px-4 md:px-7 py-6 md:py-9">
        <h1 className="text-[28px] font-bold text-[#3D2645] mb-2">
          Cart Items
        </h1>
        <p className="text-[14px] text-[#2B2520] font-semibold mb-5">
          Review your picks and adjust quantities below.
        </p>

        {!hasItems && (
          <div className="min-h-[90vh] bg-white rounded-2xl p-6 shadow-sm flex flex-col items-center justify-center text-center gap-4">
            <p className="text-[#2B2520] text-[24px] font-semibold mb-2">
              Your cart is empty.
            </p>
            <Link
              to="/categories"
              className="text-[14px] bg-[#D4AF37] text-[#3D2645] font-bold px-6 py-3 rounded-lg hover:bg-[#b8962e] transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        )}

        {hasItems && (
          <div className="space-y-5">
            {enriched.map(({ item, product, variant }) => {
              const unitPrice = variant?.price ?? product?.price ?? 0;
              const lineTotal = unitPrice * item.quantity;
              return (
                <div
                  key={`${item.productId}-${variant?.id ?? "base"}`}
                  className="bg-white rounded p-4 shadow-sm flex gap-4 items-center"
                >
                  <div className="w-20 h-24 flex items-center justify-center rounded-lg">
                    <img
                      src={resolveImagePath(
                        variant?.image ||
                          product?.images?.[0] ||
                          "/assets/icons/image-regular-full.svg"
                      )}
                      alt={product?.name ?? `Product #${item.productId}`}
                      className="max-h-20 max-w-20 object-contain"
                    />
                  </div>
                  <div className="flex-1 flex flex-col gap-2">
                    <div>
                      <p className="text-[12px] font-bold text-[#3D2645] leading-snug line-clamp-2">
                        {product?.name ?? `Product #${item.productId}`}
                      </p>
                      {variant && (
                        <p className="text-[12px] text-[#3D2645]/70">
                          Color: {variant.name}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2 rounded-lg px-2 py-1">
                        <button
                          type="button"
                          className="h-7 w-7 rounded bg-[#F5E6C0] text-[#3D2645] font-bold"
                          onClick={() =>
                            updateQuantity(
                              item.productId,
                              variant?.id,
                              item.quantity - 1
                            )
                          }
                        >
                          −
                        </button>
                        <span className="w-6 text-center font-bold text-[#3D2645]">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          className="h-7 w-7 rounded bg-[#D4AF37] text-[#3D2645] font-bold"
                          onClick={() =>
                            updateQuantity(
                              item.productId,
                              variant?.id,
                              item.quantity + 1
                            )
                          }
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end text-right text-[#D4AF37] font-bold text-[18px]">
                    {formatCurrency(lineTotal)}
                    <button
                      type="button"
                      className="block mt-2 text-[12px] text-[#3D2645] hover:text-[#b8962e] font-semibold btn-transition focus-ring"
                      onClick={() =>
                        updateQuantity(item.productId, variant?.id, 0)
                      }
                    >
                      Remove
                    </button>
                  </div>
                </div>
              );
            })}

            <Link
              to="/categories"
              className="block text-center bg-[#B97C86] text-white font-bold px-4 py-3 rounded-lg hover:bg-[#a36b74] transition-colors"
            >
              Continue Shopping
            </Link>

            <div className="bg-white rounded-2xl p-5 shadow-sm">
              <h3 className="text-[18px] font-bold text-[#3D2645] mb-3">
                Order Summary
              </h3>
              <div className="flex justify-between text-[14px] text-[#2B2520] font-medium mb-2">
                <span>Subtotal</span>
                <span>{formatCurrency(total)}</span>
              </div>
              <div className="flex justify-between text-[14px] text-[#2B2520] font-medium mb-4">
                <span>Shipping</span>
                <span>Free</span>
              </div>
              <div className="flex justify-between text-[16px] font-bold text-[#3D2645]">
                <span>TOTAL</span>
                <span>{formatCurrency(total)}</span>
              </div>
            </div>

            <Link
              to="/checkout"
              className="block text-center bg-[#D4AF37] text-[#3D2645] font-bold px-4 py-3 rounded-lg hover:bg-[#b8962e] transition-colors"
            >
              Proceed to Checkout
            </Link>
          </div>
        )}
      </section>
    </div>
  );
}
