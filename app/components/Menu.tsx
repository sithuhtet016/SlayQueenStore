import { Link, useLocation } from "react-router";
import { useEffect, useMemo, useState } from "react";
const closeIcon = "/assets/icons/xmark-solid-full.svg";
const cart = "/assets/icons/basket-shopping-solid-full.svg";
const logo = "/assets/icons/slay-queen-logo-nobg-notext.svg";
import productsData from "../../public/data/products.json";
import resolveImagePath from "~/utils/images";

interface MenuProps {
  isOpen: boolean;
  onClose: () => void;
  cartCount?: number;
}

const products = productsData as Array<{
  id: number;
  name: string;
  category?: string;
  tags?: string[];
  images?: string[];
}>;

export function Menu({ isOpen, onClose, cartCount = 0 }: MenuProps) {
  const location = useLocation();
  const pathname = location?.pathname ?? "/";
  const [currentHash, setCurrentHash] = useState(
    typeof window !== "undefined" ? window.location.hash : ""
  );
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (typeof window === "undefined") return;

    const syncHash = () => setCurrentHash(window.location.hash);

    const { pushState, replaceState } = window.history;
    const wrap = (fn: History["pushState"]) =>
      function wrappedPushState(...args: Parameters<History["pushState"]>) {
        const result = fn.apply(window.history, args);
        window.dispatchEvent(new Event("locationchange"));
        return result;
      };

    window.history.pushState = wrap(pushState);
    window.history.replaceState = wrap(replaceState);

    window.addEventListener("hashchange", syncHash, { passive: true });
    window.addEventListener("popstate", syncHash, { passive: true });
    window.addEventListener("locationchange", syncHash, { passive: true });

    syncHash();

    return () => {
      window.history.pushState = pushState;
      window.history.replaceState = replaceState;
      window.removeEventListener("hashchange", syncHash);
      window.removeEventListener("popstate", syncHash);
      window.removeEventListener("locationchange", syncHash);
    };
  }, []);

  const searchResults = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return [] as typeof products;

    return products.filter((product) => {
      const tags = product.tags || [];
      return tags.some((tag) => tag.toLowerCase().includes(term));
    });
  }, [searchTerm]);

  const normalizePath = (value: string) => {
    if (!value) return "/";
    const trimmed =
      value.endsWith("/") && value !== "/" ? value.slice(0, -1) : value;
    return trimmed || "/";
  };

  const currentPath = normalizePath(pathname);
  const isPathActive = (path: string) => normalizePath(path) === currentPath;
  const isSectionActive = (sectionHash: string) =>
    isPathActive("/categories") && currentHash === sectionHash;

  return (
    <div
      className={`fixed inset-0 z-60 flex justify-end ${
        isOpen ? "pointer-events-auto" : "pointer-events-none"
      }`}
    >
      <div
        className={`absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ease-in-out ${
          isOpen ? "opacity-100" : "opacity-0"
        }`}
        onClick={onClose}
      />

      <div
        className={`relative w-[85%] md:w-[305px] h-full bg-[#FAF7F2] shadow-xl p-4 flex flex-col overflow-y-auto scrollbar-hide transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex justify-between items-center mb-8">
          <Link to="/cart" className="relative p-2" onClick={onClose}>
            <img className="w-6" src={cart} alt="Cart" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#D4AF37] text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>
          <Link to="/" id="nav-logo" className="flex items-center">
            <img src={logo} alt="Slay Queen Logo" className="h-8 w-auto" />
            <h1 className="text-[14px] text-[#3D2645] font-bold">Slay Queen</h1>
          </Link>
          <button onClick={onClose} className="p-2">
            <img src={closeIcon} alt="Close Menu" className="h-6 w-6" />
          </button>
        </div>

        <div className="mb-6">
          <div className="w-full bg-white rounded px-4 py-3 flex items-center shadow-sm border border-transparent focus-within:border-[#D4AF37] focus-within:border-2 transition gap-3">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search"
              className="flex-1 text-[14px] text-[#2B2520] font-semibold placeholder:text-[#2B2520] bg-transparent border-none outline-none"
            />
            {searchTerm ? (
              <button
                type="button"
                onClick={() => setSearchTerm("")}
                aria-label="Clear search"
                className="p-1 -mr-1"
              >
                <img src={closeIcon} alt="Clear" className="w-4 h-4" />
              </button>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                className="w-5 h-5 text-[#3D2645]"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="11" cy="11" r="7" />
                <line x1="16.65" y1="16.65" x2="21" y2="21" />
              </svg>
            )}
          </div>

          {searchTerm.trim() && (
            <div className="mt-3 bg-white rounded-xl shadow-sm max-h-48 overflow-auto scrollbar-hide border border-[#f0e8d8]">
              {searchResults.length === 0 && (
                <div className="px-4 py-3 text-[12px] text-[#3D2645]/70">
                  No products found.
                </div>
              )}
              {searchResults.map((product) => {
                const productAnchor = `#product-${product.id}`;
                const thumb = resolveImagePath(product.images?.[0]);
                return (
                  <Link
                    key={product.id}
                    to={`/categories${productAnchor}`}
                    onClick={() => {
                      onClose();
                      setSearchTerm("");
                    }}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-[#FAF7F2] transition-colors"
                  >
                    <div className="h-10 w-10 rounded-lg bg-[#F5E6C0] flex items-center justify-center overflow-hidden shrink-0">
                      {thumb ? (
                        <img
                          src={thumb}
                          alt={product.name}
                          className="h-full w-full object-contain"
                        />
                      ) : (
                        <span className="text-[10px] font-semibold text-[#3D2645]">
                          No Image
                        </span>
                      )}
                    </div>
                    <p className="flex-1 text-[14px] font-bold text-[#3D2645] leading-tight">
                      {product.name}
                    </p>
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        <nav className="flex flex-col gap-6">
          <Link
            to="/"
            onClick={onClose}
            className={`text-[16px] uppercase font-bold ${
              isPathActive("/") ? "text-[#D4AF37]" : "text-[#3D2645]"
            } hover:text-[#D4AF37]`}
          >
            Home
          </Link>

          <Link
            to="/orders"
            onClick={onClose}
            className={`text-[16px] uppercase font-bold ${
              isPathActive("/orders") ? "text-[#D4AF37]" : "text-[#3D2645]"
            } hover:text-[#D4AF37]`}
          >
            Orders
          </Link>

          <div>
            <Link
              to="/categories"
              onClick={onClose}
              className={`mb-2 text-[16px] uppercase font-bold block ${
                isPathActive("/categories")
                  ? "text-[#D4AF37]"
                  : "text-[#3D2645]"
              } hover:text-[#D4AF37]`}
            >
              Categories
            </Link>
            <div className="mb-2 ml-4">
              <Link
                to="/categories#new-arrivals"
                onClick={onClose}
                className={`block mb-2 text-[14px] uppercase font-bold ${
                  isSectionActive("#new-arrivals")
                    ? "text-[#D4AF37]"
                    : "text-[#3D2645]"
                } hover:text-[#D4AF37]`}
              >
                New Arrivals
              </Link>
              <Link
                to="/categories#bags"
                onClick={onClose}
                className={`block mb-2 text-[14px] uppercase font-bold ${
                  isSectionActive("#bags") ? "text-[#D4AF37]" : "text-[#3D2645]"
                } hover:text-[#D4AF37]`}
              >
                Bags
              </Link>
              <Link
                to="/categories#kbeauty"
                onClick={onClose}
                className={`block mb-2 text-[14px] uppercase font-bold ${
                  isSectionActive("#kbeauty")
                    ? "text-[#D4AF37]"
                    : "text-[#3D2645]"
                } hover:text-[#D4AF37]`}
              >
                K-Beauty
              </Link>
              <Link
                to="/categories#wallets"
                onClick={onClose}
                className={`block mb-2 text-[14px] uppercase font-bold ${
                  isSectionActive("#wallets")
                    ? "text-[#D4AF37]"
                    : "text-[#3D2645]"
                } hover:text-[#D4AF37]`}
              >
                Wallets
              </Link>
              <Link
                to="/categories#blindboxes"
                onClick={onClose}
                className={`block mb-2 text-[14px] uppercase font-bold ${
                  isSectionActive("#blindboxes")
                    ? "text-[#D4AF37]"
                    : "text-[#3D2645]"
                } hover:text-[#D4AF37]`}
              >
                Blind Boxes
              </Link>
            </div>
          </div>
        </nav>
      </div>
    </div>
  );
}
