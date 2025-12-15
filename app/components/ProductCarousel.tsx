import { useState } from "react";
import { useNavigate } from "react-router";
import productsData from "../../public/data/products.json";
import { useCart } from "~/cart-context";
import resolveImagePath from "~/utils/images";
const closeIcon = "/assets/icons/xmark-solid-full.svg";

type Variant = {
  id: number;
  name: string;
  image: string;
  stock?: number;
  color?: string;
};

type Product = {
  id: number;
  name: string;
  category: string;
  price: number;
  currency: string;
  description?: string;
  images: string[];
  badge?: string;
  sku?: string;
  stock?: number;
  rating?: number;
  reviews?: number;
  tags?: string[];
  variants?: Variant[];
};

type ProductCarouselProps = {
  title: string;
  products?: Product[];
  emptyMessage?: string;
};

const products = productsData as Product[];

function formatCurrency(amount: number, currency: string) {
  if (!amount) return "";
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
}

function getModalImages(product?: Product | null) {
  if (!product) return [] as string[];
  const base = product.images?.filter(Boolean) ?? [];
  const variantImages =
    product.variants?.map((v) => v.image).filter(Boolean) ?? [];
  // Deduplicate while preserving order
  const seen = new Set<string>();
  const combined: string[] = [];
  [...base, ...variantImages].forEach((img) => {
    if (!seen.has(img)) {
      seen.add(img);
      combined.push(img);
    }
  });
  return combined;
}

function getPrimaryImage(product: Product) {
  const fromImages = product.images?.find(Boolean);
  if (fromImages) return resolveImagePath(fromImages);

  const fromVariants = product.variants?.find((v) => v.image)?.image;
  if (fromVariants) return resolveImagePath(fromVariants);

  return "";
}

export function ProductCarousel({
  title,
  products: inputProducts,
  emptyMessage,
}: ProductCarouselProps) {
  const list = inputProducts ?? products;
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedVariantId, setSelectedVariantId] = useState<
    number | undefined
  >();
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState<string | null>(null);

  const getBadgeLabel = (badge?: string) => {
    if (!badge) return "";
    if (badge.toLowerCase() === "newarrival") return "New Arrival";
    return badge.replace(/_/g, " ");
  };

  const openModal = (product: Product) => {
    setSelectedProduct(product);
    setSelectedVariantId(product.variants?.[0]?.id);
    setQuantity(1);
    const images = getModalImages(product);
    setActiveImage(images[0] ?? null);
  };

  const closeModal = () => {
    setSelectedProduct(null);
    setSelectedVariantId(undefined);
    setQuantity(1);
    setActiveImage(null);
  };

  const confirmAddToCart = () => {
    if (!selectedProduct) return;
    addToCart(selectedProduct.id, selectedVariantId, quantity);
    closeModal();
    navigate("/cart");
  };

  const selectedVariant = selectedProduct?.variants?.find(
    (variant) => variant.id === selectedVariantId
  );
  const modalImages = getModalImages(selectedProduct);
  const displayImage = activeImage || modalImages[0];

  return (
    <section className="max-w-[402px] md:max-w-[736px] lg:max-w-full w-full mx-auto">
      <div className="flex items-baseline justify-between px-4 mb-4">
        <h3 className="text-[24px] font-bold text-[#3D2645]">{title}</h3>
      </div>

      {list.length === 0 ? (
        <p className="px-4 text-[#2B2520] text-[14px]">
          {emptyMessage || "No products available right now."}
        </p>
      ) : (
        <div className="overflow-x-auto pb-4 scrollbar-hide">
          <div className="flex gap-6 snap-x snap-mandatory">
            {list.map((product) => {
              const primaryImage = getPrimaryImage(product);
              const price = formatCurrency(product.price, product.currency);

              return (
                <article
                  key={product.id}
                  id={`product-${product.id}`}
                  data-product-id={product.id}
                  className="w-[280px] max-w-[320px] bg-white rounded p-5 snap-start shadow-sm cursor-pointer product-card"
                  onClick={() => openModal(product)}
                >
                  <div className="relative">
                    {product.badge && (
                      <span className="absolute top-0 right-0 bg-[#D4AF37] text-[#3D2645] text-[12px] font-bold px-3 py-1 rounded-xs">
                        {getBadgeLabel(product.badge)}
                      </span>
                    )}
                    <div className="flex justify-center">
                      {primaryImage ? (
                        <img
                          src={primaryImage}
                          alt={product.name}
                          className="min-w-60 min-h-60 rounded-xs object-contain mx-auto"
                          loading="lazy"
                        />
                      ) : (
                        <div className="min-w-60 min-h-60 mx-auto rounded bg-linear-to-br from-[#F5E6C0] to-[#FAF7F2] flex items-center justify-center text-[#3D2645] text-sm font-semibold">
                          Image not available
                        </div>
                      )}
                    </div>
                  </div>

                  <h4 className="mt-5 text-[#2B2520] text-[14px] font-bold leading-snug truncate">
                    {product.name}
                  </h4>

                  <div className="mt-3 flex items-center gap-2">
                    <div className="flex items-center gap-1 text-[#D4AF37] text-[16px]">
                      {"★★★★★"}
                    </div>
                    {product.rating && (
                      <span className="text-[#3D2645] text-[14px] font-semibold">
                        {product.rating}
                      </span>
                    )}
                  </div>

                  <p className="mt-3 text-[#D4AF37] text-[16px] font-bold">
                    {price}
                  </p>

                  <button
                    className="mt-4 w-full bg-[#D4AF37] text-[#3D2645] text-[14px] font-bold py-3 rounded-lg hover:bg-[#b8962e] transition-colors btn-transition"
                    onClick={(e) => {
                      e.stopPropagation();
                      openModal(product);
                    }}
                  >
                    ADD TO CART
                  </button>
                </article>
              );
            })}
          </div>
        </div>
      )}

      {selectedProduct && (
        <div className="fixed inset-0 z-70 flex items-center justify-center bg-black/50 px-4">
          <div className="w-[370px] max-h-[90vh] overflow-y-auto bg-white rounded p-6 pt-8 relative shadow-lg scrollbar-hide">
            <button
              className="absolute z-10 top-4 right-4 h-9 w-9 flex items-center justify-center rounded-full bg-[#D4AF37] shadow text-[#3D2645] btn-transition"
              aria-label="Close"
              onClick={closeModal}
            >
              <img src={closeIcon} alt="Close" className="h-5 w-5" />
            </button>

            <div className="flex justify-center mb-4">
              {displayImage ? (
                <img
                  src={resolveImagePath(displayImage)}
                  alt={selectedProduct.name}
                  className="w-[322px] h-[322px] aspect-square rounded object-contain modal-image modal-image-active"
                />
              ) : (
                <div className="w-[322px] h-[322px] aspect-square rounded bg-linear-to-br from-[#F5E6C0] to-[#FAF7F2] flex items-center justify-center text-[#3D2645] text-sm font-semibold">
                  Image not available
                </div>
              )}
            </div>

            {modalImages.length > 1 && (
              <div className=" mb-4 overflow-x-auto scrollbar-hide">
                <div className="flex gap-3 min-w-full">
                  {modalImages.map((img) => {
                    const isActive = img === displayImage;
                    return (
                      <button
                        key={img}
                        type="button"
                        className={`h-16 w-16 rounded border-2 ${
                          isActive ? "border-[#D4AF37]" : "border-transparent"
                        } bg-white shrink-0 overflow-hidden`}
                        onClick={() => setActiveImage(img)}
                        aria-label="Select image"
                      >
                        <img
                          src={resolveImagePath(img)}
                          alt={selectedProduct.name}
                          className="h-full w-full object-cover"
                        />
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="mb-3">
              <h3 className="text-[20px] font-bold text-[#3D2645] leading-snug">
                {selectedProduct.name}
              </h3>
            </div>

            <div className="flex items-center gap-2 mb-3">
              <span className="text-[#D4AF37] text-[18px]">★★★★★</span>
              {selectedProduct.rating && (
                <span className="text-[#3D2645] text-[14px] font-semibold">
                  {selectedProduct.rating}
                </span>
              )}
            </div>

            <p className="text-[#6B9E5E] text-[14px] font-semibold mb-2">
              In Stock
            </p>

            <p className="text-[#D4AF37] text-[20px] font-bold mb-4">
              {formatCurrency(selectedProduct.price, selectedProduct.currency)}
            </p>

            {selectedProduct.variants &&
              selectedProduct.variants.length > 0 && (
                <div className="mb-4">
                  <p className="text-[12px] font-semibold text-[#3D2645] uppercase mb-2">
                    Choose Color
                  </p>
                  <div className="flex items-center gap-2">
                    {selectedProduct.variants.map((variant) => {
                      const isActive = variant.id === selectedVariantId;
                      return (
                        <button
                          key={variant.id}
                          type="button"
                          onClick={() => {
                            setSelectedVariantId(variant.id);
                            setActiveImage(
                              variant.image || modalImages[0] || null
                            );
                          }}
                          className={`min-h-8 min-w-8 rounded-full border-2 ${
                            isActive ? "border-[#D4AF37]" : "border-transparent"
                          }`}
                          style={{
                            backgroundColor: variant.color || "#3D2645",
                          }}
                          aria-label={variant.name}
                          title={variant.name}
                        />
                      );
                    })}
                  </div>
                </div>
              )}

            <div className="flex items-center gap-3 mb-5">
              <span className="text-[12px] font-semibold text-[#3D2645] uppercase">
                Quantity
              </span>
              <div className="flex items-center gap-2">
                <button
                  className="h-9 w-9 rounded-lg bg-[#F5E6C0] text-[#3D2645] font-bold"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  aria-label="Decrease quantity"
                  type="button"
                >
                  −
                </button>
                <span className="w-8 text-center font-semibold text-[#3D2645]">
                  {quantity}
                </span>
                <button
                  className="h-9 w-9 rounded-lg bg-[#F5E6C0] text-[#3D2645] font-bold"
                  onClick={() => setQuantity((q) => q + 1)}
                  aria-label="Increase quantity"
                  type="button"
                >
                  +
                </button>
              </div>
            </div>

            <button
              className="w-full bg-[#D4AF37] text-[#3D2645] text-[14px] font-bold py-3 rounded-lg hover:bg-[#b8962e] transition-colors btn-transition"
              onClick={confirmAddToCart}
              type="button"
            >
              ADD TO CART
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
