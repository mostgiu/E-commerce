import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { TokenContext, CartContext } from "../Context/contexts";
import { LocaleContext, ThemeContext } from "../Context/ThemeContext";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { noOfCartItems, getToCart, getWishlist, wishlistCount, clearCartState } = useContext(CartContext);
  const { token, setToken } = useContext(TokenContext);
  const { theme, setTheme } = useContext(ThemeContext);
  const { locale, setLocale, translations } = useContext(LocaleContext);
  const t = translations[locale] || translations.en;
  const { data: categoriesData } = useQuery({
    queryKey: ["navbarCategories"],
    queryFn: () => axios.get("https://ecommerce.routemisr.com/api/v1/categories"),
    staleTime: 1000 * 60 * 5,
  });

  const quickCategories = (categoriesData?.data?.data || []).filter((category) => {
    const name = category.name?.toLowerCase() || "";
    return name.includes("men") || name.includes("women") || name.includes("elect");
  });

  const isDark = theme === "dark";

  function getCategoryIcon(name = "") {
    const normalized = name.toLowerCase();
    if (normalized.includes("elect") || normalized.includes("laptop") || normalized.includes("phone")) {
      return "fa-solid fa-plug-circle-bolt";
    }
    if (normalized.includes("men") || normalized.includes("male")) return "fa-solid fa-person";
    if (normalized.includes("women") || normalized.includes("female") || normalized.includes("lady")) {
      return "fa-solid fa-person-dress";
    }
    return "fa-solid fa-tags";
  }

  const linkClasses = ({ isActive }) =>
    `pb-1 text-[13px] uppercase tracking-[0.18em] transition-all ${
      isActive
        ? "text-[var(--text)] underline decoration-[1px] underline-offset-4"
        : "text-[var(--muted)] hover:text-[var(--text)] hover:underline hover:decoration-[1px] hover:underline-offset-4"
    }`;

  const mobileLinkClasses = ({ isActive }) =>
    `block py-2 text-[12px] uppercase tracking-[0.18em] transition-all ${
      isActive
        ? "text-[var(--text)] underline decoration-[1px] underline-offset-4"
        : "text-[var(--muted)] hover:text-[var(--text)]"
    }`;

  const navigate = useNavigate();

  function logout() {
    localStorage.removeItem("userToken");
    setToken(null);
    clearCartState();
    setIsMenuOpen(false);
    navigate("/login");
  }

  useEffect(() => {
    if (token) {
      getToCart();
      getWishlist();
    } else {
      clearCartState();
    }
  }, [token, getToCart, getWishlist, clearCartState]);

  return (
    <nav className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${isDark ? "bg-[var(--bg)]" : "bg-[var(--bg-elevated)]"}`}>
      <div className="bg-[var(--color-eucalyptus-mist)] text-[var(--color-obsidian-ink)]">
        <div className="mx-auto flex max-w-7xl items-center justify-center gap-4 px-4 py-2 text-center text-[10px] font-medium uppercase tracking-[0.24em] sm:text-[11px]">
          <span>Free shipping on orders over $250</span>
        </div>
      </div>

      <div className="border-b border-[var(--line)] bg-[var(--bg-elevated)]/80 backdrop-blur-sm">
        <div className="mx-auto flex min-h-[70px] max-w-7xl items-center justify-between px-4 py-2 sm:min-h-[82px] sm:px-6">
          <Link to="/" className="flex shrink-0 items-center" aria-label="Bazarlo home">
            <span className="text-xl font-medium tracking-[0.18em] text-[var(--text)] sm:text-2xl">
              BAZARLO
            </span>
          </Link>

          <div className="hidden items-center gap-6 lg:flex">
            <NavLink to="/" className={linkClasses} end>
              {t.home}
            </NavLink>
            <NavLink to="/Brands" className={linkClasses}>
              {t.brands}
            </NavLink>
            <NavLink to="/Cart" className={({ isActive }) => `${linkClasses({ isActive })} relative`}>
              <span className="inline-flex items-center gap-2">
                {t.cart}
                {noOfCartItems > 0 ? (
                  <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-[var(--accent)] px-1.5 text-[10px] font-bold text-[var(--color-obsidian-ink)]">
                    {noOfCartItems}
                  </span>
                ) : null}
              </span>
            </NavLink>
            <NavLink to="/Wishlist" className={({ isActive }) => `${linkClasses({ isActive })} relative`}>
              <span className="inline-flex items-center gap-2">
                {t.wishlist}
                {wishlistCount > 0 ? (
                  <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-[var(--accent)] px-1.5 text-[10px] font-bold text-[var(--color-obsidian-ink)]">
                    {wishlistCount}
                  </span>
                ) : null}
              </span>
            </NavLink>
            <NavLink to="/Categories" className={linkClasses}>
              {t.categories}
            </NavLink>
            <NavLink to="/Products" className={linkClasses}>
              {t.products}
            </NavLink>
          </div>

          <div className="hidden items-center gap-3 lg:flex">
            <button
              type="button"
              onClick={() => setLocale(locale === "en" ? "it" : "en")}
              className="text-[10px] uppercase tracking-[0.2em] text-[var(--text)]"
            >
              {locale === "en" ? "IT" : "EN"}
            </button>
            <button
              type="button"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="flex h-9 w-9 items-center justify-center text-[var(--text)]"
              aria-label="Toggle theme"
            >
              <i className={`fa-solid ${theme === "dark" ? "fa-sun" : "fa-moon"}`} />
            </button>

            {token ? (
              <button
                onClick={logout}
                className="text-[10px] uppercase tracking-[0.2em] text-[var(--text)] transition hover:text-[var(--muted)]"
              >
                {t.logout}
              </button>
            ) : (
              <>
                <NavLink to="/Login" className={linkClasses}>
                  {t.login}
                </NavLink>
                <NavLink to="/Register" className={linkClasses}>
                  {t.register}
                </NavLink>
              </>
            )}
          </div>

          <div className="flex items-center gap-3 lg:hidden">
            <button
              type="button"
              onClick={() => setLocale(locale === "en" ? "it" : "en")}
              className="text-[10px] uppercase tracking-[0.2em] text-[var(--text)]"
            >
              {locale === "en" ? "IT" : "EN"}
            </button>
            <button
              type="button"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="flex h-8 w-8 items-center justify-center text-[var(--text)]"
            >
              <i className={`fa-solid ${theme === "dark" ? "fa-sun" : "fa-moon"}`} />
            </button>

            {token && (
              <Link to="/Cart" className="relative flex h-8 w-8 items-center justify-center text-[var(--text)]">
                <i className="fa-solid fa-bag-shopping text-sm"></i>
                {noOfCartItems > 0 ? (
                  <span className="absolute -right-1 -top-1 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-[var(--accent)] px-1 text-[9px] font-bold text-[var(--color-obsidian-ink)]">
                    {noOfCartItems}
                  </span>
                ) : null}
              </Link>
            )}

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="flex h-8 w-8 items-center justify-center text-[var(--text)]"
              aria-label="Toggle menu"
            >
              <i className={`fa-solid ${isMenuOpen ? "fa-xmark" : "fa-bars"}`} />
            </button>
          </div>
        </div>
      </div>

      {quickCategories.length > 0 ? (
        <div className="border-b border-[var(--line)] bg-[var(--bg)]">
          <div className="mx-auto flex max-w-7xl items-center gap-3 overflow-x-auto px-4 py-2 sm:justify-center sm:px-6">
            {quickCategories.map((category) => (
              <Link
                key={category._id}
                to={`/categories/${category._id}`}
                className="shrink-0 border-b border-transparent pb-1 text-[10px] uppercase tracking-[0.2em] text-[var(--muted)] transition hover:border-[var(--text)] hover:text-[var(--text)]"
              >
                <i className={`${getCategoryIcon(category.name)} mr-1.5`} />
                {category.name}
              </Link>
            ))}
          </div>
        </div>
      ) : null}

      {isMenuOpen && (
        <div className={`border-t border-[var(--line)] bg-[var(--bg-elevated)] px-4 py-4 lg:hidden ${isDark ? "shadow-[0_16px_30px_rgba(0,0,0,0.18)]" : "shadow-[0_10px_24px_rgba(0,0,0,0.04)]"}`}>
          <ul className="flex flex-col gap-3">
            <li>
              <NavLink to="/" onClick={() => setIsMenuOpen(false)} className={mobileLinkClasses} end>
                {t.home}
              </NavLink>
            </li>
            <li>
              <NavLink to="/Brands" onClick={() => setIsMenuOpen(false)} className={mobileLinkClasses}>
                {t.brands}
              </NavLink>
            </li>
            <li>
              <NavLink to="/Cart" onClick={() => setIsMenuOpen(false)} className={mobileLinkClasses}>
                <span className="inline-flex items-center gap-2">
                  {t.cart}
                  {noOfCartItems > 0 ? <span className="rounded-full bg-[var(--accent)] px-1.5 py-0.5 text-[9px] font-bold text-[var(--color-obsidian-ink)]">{noOfCartItems}</span> : null}
                </span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/Wishlist" onClick={() => setIsMenuOpen(false)} className={mobileLinkClasses}>
                <span className="inline-flex items-center gap-2">
                  {t.wishlist}
                  {wishlistCount > 0 ? <span className="rounded-full bg-[var(--accent)] px-1.5 py-0.5 text-[9px] font-bold text-[var(--color-obsidian-ink)]">{wishlistCount}</span> : null}
                </span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/Categories" onClick={() => setIsMenuOpen(false)} className={mobileLinkClasses}>
                {t.categories}
              </NavLink>
            </li>
            <li>
              <NavLink to="/Products" onClick={() => setIsMenuOpen(false)} className={mobileLinkClasses}>
                {t.products}
              </NavLink>
            </li>
            {token ? (
              <li>
                <button
                  onClick={logout}
                  className="mt-2 w-full border-t border-[var(--line)] pt-3 text-left text-[12px] uppercase tracking-[0.18em] text-[var(--text)]"
                >
                  {t.logout}
                </button>
              </li>
            ) : (
              <>
                <li>
                  <NavLink to="/Login" onClick={() => setIsMenuOpen(false)} className={mobileLinkClasses}>
                    {t.login}
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/Register" onClick={() => setIsMenuOpen(false)} className={mobileLinkClasses}>
                    {t.register}
                  </NavLink>
                </li>
              </>
            )}
          </ul>
        </div>
      )}
    </nav>
  );
}


