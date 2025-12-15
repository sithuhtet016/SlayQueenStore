import type { Route } from "./+types/home";
import { Navbar } from "../components/Navbar";
import { Hero } from "../components/Hero";
import { Bestseller } from "../components/Bestseller";
import { ShopCategory } from "~/components/ShopCategory";
import { Footer } from "~/components/Footer";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Slay Queen | Slay Your Style" },
    {
      name: "description",
      content:
        "Shop the latest trends and slay every day with our exclusive collection.",
    },
  ];
}

export default function Home() {
  return (
    <div className="min-w-[402px]">
      <Navbar />
      <Hero />
      <Bestseller />
      <ShopCategory />
      <Footer />
    </div>
  );
}
