import { Link } from "react-router";

export function ShopCategory() {
  return (
    <div className="min-w-[402px] py-8 px-7">
      <h2 className="uppercase text-center text-[28px] font-bold text-[#3D2645] mb-8">
        Shop by Category
      </h2>
      <div className="flex flex-col md:grid md:grid-cols-2 md:justify-items-center items-center gap-8 mx-auto md:max-w-3xl">
        {/* Categories grid */}
        <div className="relative w-full max-w-[348px] bg-white rounded p-10">
          <img
            src="/assets/images/category-bags.jpeg"
            alt="Bags"
            className="w-[268px] mb-5 rounded-xs"
          />
          <div>
            <h3 className="text-[#2B2520] text-[16px] font-bold mb-5">Bags</h3>
            <Link
              to="/categories#bags"
              className="inline-block text-[#3D2645] bg-[#D4AF37] font-lato text-[14px] font-bold px-10 py-3 rounded-lg hover:bg-[#b8962e] transition-colors"
            >
              Shop Now
            </Link>
          </div>
        </div>
        <div className="relative w-full max-w-[348px] bg-white rounded p-10">
          <img
            src="/assets/images/category-kbeauty.jpeg"
            alt="K-Beauty"
            className="w-[268px] mb-5 rounded-xs"
          />
          <div>
            <h3 className="text-[#2B2520] text-[16px] font-bold mb-5">
              K-Beauty
            </h3>
            <Link
              to="/categories#kbeauty"
              className="inline-block text-[#3D2645] bg-[#D4AF37] font-lato text-[14px] font-bold px-10 py-3 rounded-lg hover:bg-[#b8962e] transition-colors"
            >
              Shop Now
            </Link>
          </div>
        </div>
        <div className="relative w-full max-w-[348px] bg-white rounded p-10">
          <img
            src="/assets/images/category-wallets.jpeg"
            alt="Wallets"
            className="w-[268px] mb-5 rounded-xs"
          />
          <div>
            <h3 className="text-[#2B2520] text-[16px] font-bold mb-5">
              Wallets
            </h3>
            <Link
              to="/categories#wallets"
              className="inline-block text-[#3D2645] bg-[#D4AF37] font-lato text-[14px] font-bold px-10 py-3 rounded-lg hover:bg-[#b8962e] transition-colors"
            >
              Shop Now
            </Link>
          </div>
        </div>
        <div className="relative w-full max-w-[348px] bg-white rounded p-10">
          <img
            src="/assets/images/category-blindboxes.png"
            alt="Blind Boxes"
            className="w-[268px] mb-5 rounded-xs"
          />
          <div>
            <h3 className="text-[#2B2520] text-[16px] font-bold mb-5">
              Blind Boxes
            </h3>
            <Link
              to="/categories#blindboxes"
              className="inline-block text-[#3D2645] bg-[#D4AF37] font-lato text-[14px] font-bold px-10 py-3 rounded-lg hover:bg-[#b8962e] transition-colors"
            >
              Shop Now
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
