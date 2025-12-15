import productsData from "../../public/data/products.json";
import { ProductCarousel } from "./ProductCarousel";

type Product = {
  id: number;
  name: string;
  category: string;
  price: number;
  currency: string;
  images: string[];
  badge?: string;
  variants?: { id: number; name: string; image: string; stock?: number }[];
};

const products = productsData as Product[];

export function Bestseller() {
  const bestSellers = products.filter(
    (p) => p.badge?.toLowerCase() === "bestseller"
  );
  
  return (
    <section className="min-w-[402px] md:px-7 mx-auto px-4 pt-8">
      <h2 className="text-center text-[28px] font-bold text-[#3D2645] mb-2">
        OUR BEST SELLERS
      </h2>
      <ProductCarousel
        title=""
        products={bestSellers}
        emptyMessage="No best sellers yet."
      />
    </section>
  );
}
