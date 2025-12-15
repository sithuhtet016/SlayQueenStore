import { useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router";
import productsData from "../../public/data/products.json";
import { Footer } from "~/components/Footer";
import { Navbar } from "~/components/Navbar";
import { ProductCarousel } from "~/components/ProductCarousel";

type Product = {
  id: number;
  name: string;
  category: string;
  price: number;
  currency: string;
  images: string[];
  badge?: string;
  variants?: { id: number; name: string; image: string; stock?: number }[];
  rating?: number;
  reviews?: number;
};

const products = productsData as Product[];

export default function Categories() {
  const location = useLocation();
  const navigate = useNavigate();
  const lastHashRef = useRef<string>(
    typeof window !== "undefined" ? window.location.hash : ""
  );
  const newArrivals = products.filter(
    (p) => p.badge?.toLowerCase() === "newarrival"
  );
  const bags = products.filter((p) => p.category === "bags");
  const kBeauty = products.filter((p) => p.category === "kBeauty");
  const wallets = products.filter((p) => p.category === "wallets");
  const blindBoxes = products.filter((p) => p.category === "blindBoxes");

  useEffect(() => {
    // Keep the URL hash in sync with the section currently in view without triggering route re-renders.
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter(
            (entry) => entry.isIntersecting && entry.intersectionRatio > 0.2
          )
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        const topEntry = visible[0];
        if (!topEntry) return;

        const id = topEntry.target.id;
        const newHash = id === "top" ? "" : `#${id}`;

        if (lastHashRef.current !== newHash) {
          const newUrl = newHash ? `/categories${newHash}` : `/categories`;
          window.history.replaceState(null, "", newUrl);
          lastHashRef.current = newHash;
        }
      },
      {
        threshold: [0.2, 0.4, 0.6, 0.8],
        rootMargin: "-20% 0px -40% 0px", // earlier trigger while section is near the middle
      }
    );

    const sections = document.querySelectorAll("section[id]");
    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!location.hash.startsWith("#product-")) return;

    const targetId = location.hash.slice(1); // remove '#'

    // Delay to ensure carousel content is laid out before scrolling
    const scrollToProduct = () => {
      const target = document.getElementById(targetId);
      if (!target) return;

      const section = target.closest("section");
      if (section) {
        section.scrollIntoView({ behavior: "smooth", block: "start" });
      }

      target.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      });
    };

    const timer = window.setTimeout(scrollToProduct, 50);
    return () => window.clearTimeout(timer);
  }, [location.hash]);

  return (
    <div className="min-w-[402px] mt-[72px]">
      <Navbar />

      {/* Top Section (Categories) */}
      <section className="px-4 md:px-7 py-6 md:py-9" id="top">
        <h1 className="uppercase text-[28px] font-bold text-[#3D2645] mb-5">
          Categories
        </h1>
        <p className="text-[#2B2520] mb-4">
          Explore our wide range of curated items. Scroll down to see specific
          collections.
        </p>
      </section>

      {/* New Arrivals Section */}
      <section id="new-arrivals" className="min-h-[80vh] mb-10 px-4 md:px-7 pt-20">
        <h2 className="uppercase text-[24px] font-bold text-[#3D2645] mb-5">
          New Arrivals
        </h2>
        <ProductCarousel
          title=""
          products={newArrivals}
          emptyMessage="No new arrivals yet."
        />
      </section>

      {/* Bags Section */}
      <section id="bags" className="min-h-[80vh] mb-10 px-4 md:px-7 pt-20">
        <h2 className="uppercase text-[24px] font-bold text-[#3D2645] mb-5">
          Bags
        </h2>
        <ProductCarousel
          title=""
          products={bags}
          emptyMessage="No bags available right now."
        />
      </section>

      {/* K-Beauty Section */}
      <section id="kbeauty" className="min-h-[80vh] mb-10 px-4 md:px-7 pt-20">
        <h2 className="uppercase text-[24px] font-bold text-[#3D2645] mb-5">
          K-Beauty
        </h2>
        <ProductCarousel
          title=""
          products={kBeauty}
          emptyMessage="No K-Beauty items available right now."
        />
      </section>

      {/* Wallets Section */}
      <section id="wallets" className="min-h-[80vh] mb-10 px-4 md:px-7 pt-20">
        <h2 className="uppercase text-[24px] font-bold text-[#3D2645] mb-5">
          Wallets
        </h2>
        <ProductCarousel
          title=""
          products={wallets}
          emptyMessage="No wallets available right now."
        />
      </section>

      {/* Blind Boxes Section */}
      <section id="blindboxes" className="min-h-[80vh] mb-10 px-4 md:px-7 pt-20">
        <h2 className="uppercase text-[24px] font-bold text-[#3D2645] mb-5">
          Blind Boxes
        </h2>
        <ProductCarousel
          title=""
          products={blindBoxes}
          emptyMessage="No blind boxes available right now."
        />
      </section>
      <Footer />
    </div>
  );
}
