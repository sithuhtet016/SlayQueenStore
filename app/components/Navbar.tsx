import { useMemo, useState, useRef, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router";
const logo = "/assets/icons/slay-queen-logo-nobg-notext.svg";
const menuIcon = "/assets/icons/bars-solid-full.svg";
import { useCart } from "~/cart-context";
import { Menu } from "./Menu";
import productsData from "../../public/data/products.json";
import resolveImagePath from "~/utils/images";

const products = productsData as Array<{
  id: number;
  variants?: { id: number }[];
}>;

function CategoriesDropdown() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);
  const [currentHash, setCurrentHash] = useState(
    typeof window !== "undefined" ? window.location.hash.toLowerCase() : ""
  );

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (!ref.current) return;
      if (!ref.current.contains(e.target as Node)) setOpen(false);
    }
    if (open) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const syncHash = () =>
      setCurrentHash((window.location.hash || "").toLowerCase());

    const { pushState, replaceState } = window.history;
    const wrap = (fn: History["pushState"]) =>
      function wrappedPushState(...args: Parameters<History["pushState"]>) {
        const result = fn.apply(window.history, args as any);
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

  const location = useLocation();
  const pathname = location?.pathname ?? "/";
  const normalizePath = (value: string) => {
    if (!value) return "/";
    const trimmed =
      value.endsWith("/") && value !== "/" ? value.slice(0, -1) : value;
    return trimmed || "/";
  };
  const isActive = normalizePath(pathname) === "/categories";

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={`text-[14px] uppercase font-bold ${isActive ? "text-[#D4AF37]" : "text-[#3D2645]"} hover:text-[#D4AF37] flex items-center gap-2`}
        aria-expanded={open}
      >
        Categories
        <svg
          className="w-3 h-3"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden
        >
          <path d="M5.23 7.21a.75.75 0 011.06.02L10 11.293l3.71-4.06a.75.75 0 111.12 1L10.53 13.06a.75.75 0 01-1.06 0L5.21 8.27a.75.75 0 01.02-1.06z" />
        </svg>
      </button>

      {open && (
        <div className="absolute left-0 mt-2 w-44 bg-white rounded shadow-lg p-3 z-50">
          {(() => {
            // compute hash at component render scope (useLocation was called above)
            // fall back to window.location.hash in case react-router's location
            // doesn't contain the fragment on initial render
            const hash = (
              (location && location.hash) ||
              (typeof window !== "undefined" && window.location.hash) ||
              ""
            ).toLowerCase();
            const itemClass = (h: string) =>
              `block px-2 py-1 text-sm ${hash === h ? "text-[#D4AF37] font-semibold" : "text-[#3D2645]"} hover:bg-[#FAF7F2]`;

            return (
              <>
                <Link
                  to="/categories#new-arrivals"
                  className={itemClass("#new-arrivals")}
                  onClick={() => setOpen(false)}
                >
                  New Arrivals
                </Link>
                <Link
                  to="/categories#bags"
                  className={itemClass("#bags")}
                  onClick={() => setOpen(false)}
                >
                  Bags
                </Link>
                <Link
                  to="/categories#kbeauty"
                  className={itemClass("#kbeauty")}
                  onClick={() => setOpen(false)}
                >
                  K-Beauty
                </Link>
                <Link
                  to="/categories#wallets"
                  className={itemClass("#wallets")}
                  onClick={() => setOpen(false)}
                >
                  Wallets
                </Link>
                <Link
                  to="/categories#blindboxes"
                  className={itemClass("#blindboxes")}
                  onClick={() => setOpen(false)}
                >
                  Blind Boxes
                </Link>
              </>
            );
          })()}
        </div>
      )}
    </div>
  );
}

function SearchInput() {
  const [term, setTerm] = useState("");
  const navigate = useNavigate();

  const products = (productsData as any[]) || [];

  const searchResults = useMemo(() => {
    const t = term.trim().toLowerCase();
    if (!t) return [] as typeof products;
    return products.filter((p) => {
      const tags = (p.tags || []) as string[];
      return (
        (p.name || "").toLowerCase().includes(t) ||
        tags.some((tag) => tag.toLowerCase().includes(t))
      );
    });
  }, [term, products]);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = term.trim();
    if (!q) return;
    navigate(`/categories?search=${encodeURIComponent(q)}`);
  };

  return (
    <form onSubmit={onSubmit} className="relative">
      <label htmlFor="nav-search" className="sr-only">
        Search products
      </label>
      <div className="w-full bg-white rounded-lg px-3 py-2 flex items-center shadow-sm border-2 border-transparent focus-within:border-[#D4AF37]">
        <input
          id="nav-search"
          type="search"
          value={term}
          onChange={(e) => setTerm(e.target.value)}
          placeholder="Search"
          className="w-full text-[14px] font-semibold text-[#2B2520] bg-transparent border-none outline-none"
          autoComplete="off"
        />

        {term ? (
          <button
            type="button"
            onClick={() => setTerm("")}
            aria-label="Clear search"
            className="p-1 -mr-1"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              className="w-4 h-4 text-[#3D2645]"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
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

      {term.trim() && (
        <div className="absolute left-0 right-0 mt-2 bg-white rounded-xl shadow-sm max-h-48 overflow-auto scrollbar-hide border border-[#f0e8d8] z-40">
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
                onClick={() => setTerm("")}
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
    </form>
  );
}

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { items } = useCart();

  const resolvedCartCount = useMemo(() => {
    return items.reduce((sum, item) => {
      const product = products.find((p) => p.id === item.productId);
      if (!product) return sum;

      if (item.variantId) {
        const variantExists = product.variants?.some(
          (variant) => variant.id === item.variantId
        );
        if (!variantExists) return sum;
      }

      return sum + item.quantity;
    }, 0);
  }, [items]);

  const location = useLocation();
  const pathname = location?.pathname ?? "/";
  const normalizePath = (value: string) => {
    if (!value) return "/";
    const trimmed =
      value.endsWith("/") && value !== "/" ? value.slice(0, -1) : value;
    return trimmed || "/";
  };
  const isPathActive = (path: string) =>
    normalizePath(path) === normalizePath(pathname);

  return (
    <>
      <nav className="fixed inset-x-0 top-0 bg-[#FAF7F2]/70 backdrop-blur-md z-50">
        <div className="min-w-[402px] w-full lg:max-w-5xl mx-auto flex items-center justify-between px-4 md:px-7 py-3">
          <Link to="/" id="nav-logo" className="flex items-center">
            <img src={logo} alt="Slay Queen Logo" className="h-12 w-auto" />
            <h1 className="text-[16px] text-[#3D2645] font-bold">Slay Queen</h1>
          </Link>

          <div className="hidden lg:flex lg:justify-end lg:gap-10 items-center gap-6 w-[80%]">
            <div className="flex items-center gap-6">
              <Link
                to="/"
                className={`text-[14px] uppercase font-bold ${isPathActive("/") ? "text-[#D4AF37]" : "text-[#3D2645]"} hover:text-[#D4AF37]`}
              >
                Home
              </Link>

              <div className="relative" ref={null as any}>
                {/* Categories dropdown */}
                <CategoriesDropdown />
              </div>

              <Link
                to="/orders"
                className={`text-[14px] uppercase font-bold ${isPathActive("/orders") ? "text-[#D4AF37]" : "text-[#3D2645]"} hover:text-[#D4AF37]`}
              >
                Orders
              </Link>
            </div>

            <div className="flex justify-center">
              <div className="w-[280px]">
                <SearchInput />
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Link to="/cart" className="relative p-2">
                <img
                  src="/assets/icons/basket-shopping-solid-full.svg"
                  alt="Cart"
                  className="h-6 w-auto"
                />
                {resolvedCartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#D4AF37] text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
                    {resolvedCartCount}
                  </span>
                )}
              </Link>
            </div>
          </div>

          {/* mobile hamburger */}
          <button onClick={() => setIsMenuOpen(true)} className="lg:hidden">
            <img src={menuIcon} alt="hamburger-icon" className="h-6 w-auto" />
          </button>
        </div>
      </nav>
      <Menu
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        cartCount={resolvedCartCount}
      />
    </>
  );
}
