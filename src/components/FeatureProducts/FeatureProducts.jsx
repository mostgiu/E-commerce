import React, { useContext, useMemo, useState } from "react";
import axios from "axios";
import Loader from "../Loader/Loader";
import { useQuery } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
import { CartContext } from "../Context/contexts";
import { LocaleContext } from "../Context/ThemeContext";

export default function FeatureProducts({ compact = false }) {
  const { addToCart, addToWishlist } = useContext(CartContext);
  const { locale, translations } = useContext(LocaleContext);
  const t = translations[locale] || translations.en;
  const navigate = useNavigate();
  const [wishlistIds, setWishlistIds] = useState(new Set());
  const [cartLoadingId, setCartLoadingId] = useState(null);
  const [wishlistLoadingId, setWishlistLoadingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("featured");
  const minLoaderDelay = (ms = 500) => new Promise((resolve) => setTimeout(resolve, ms));

  async function addProductToCart(productId) {
    setCartLoadingId(productId);
    if (!localStorage.getItem("userToken")) {
      navigate("/login");
      setCartLoadingId(null);
      return;
    }
    try {
      await Promise.all([addToCart(productId), minLoaderDelay()]);
    } finally {
      setCartLoadingId(null);
    }
  }

  async function toggleWishlist(productId) {
    setWishlistLoadingId(productId);
    if (!localStorage.getItem("userToken")) {
      navigate("/register");
      setWishlistLoadingId(null);
      return;
    }

    try {
      const [response] = await Promise.all([addToWishlist(productId), minLoaderDelay()]);
      if (response?.status < 200 || response?.status >= 300) {
        return;
      }

      setWishlistIds((prev) => {
        const next = new Set(prev);
        if (next.has(productId)) {
          next.delete(productId);
        } else {
          next.add(productId);
        }
        return next;
      });
    } finally {
      setWishlistLoadingId(null);
    }
  }

  function getFeatureProducts() {
    return axios.get("https://ecommerce.routemisr.com/api/v1/products");
  }

  const { data, isLoading } = useQuery({
    queryKey: ["FeatureProducts"],
    queryFn: getFeatureProducts,
  });

  const filteredProducts = useMemo(() => {
    const products = data?.data?.data || [];
    const normalized = searchTerm.trim().toLowerCase();

    const bySearch = !normalized
      ? products
      : products.filter((product) => {
          const title = product.title?.toLowerCase() || "";
          const description = product.description?.toLowerCase() || "";
          const category = product.category?.name?.toLowerCase() || "";
          return title.includes(normalized) || description.includes(normalized) || category.includes(normalized);
        });

    const sorted = [...bySearch];
    if (sortOption === "low") {
      sorted.sort((a, b) => a.price - b.price);
    } else if (sortOption === "high") {
      sorted.sort((a, b) => b.price - a.price);
    } else if (sortOption === "rating") {
      sorted.sort((a, b) => (b.ratingsAverage || 0) - (a.ratingsAverage || 0));
    }

    return sorted;
  }, [data, searchTerm, sortOption]);

  return (
    <div className="mx-auto px-1 sm:px-0">
      <div className="mb-5 border border-[var(--line)] bg-[var(--panel)] p-4 shadow-[var(--shadow)]">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative flex-1">
            <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-[var(--muted)]" />
            <input
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder={t.searchProducts}
              className="w-full border border-[var(--line)] bg-[var(--bg-elevated)] py-2.5 pl-11 pr-4 text-sm text-[var(--text)] placeholder:text-[var(--muted)] focus:border-[var(--text)] focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-3">
            <label className="text-[10px] uppercase tracking-[0.18em] text-[var(--muted)]">{t.sortBy}</label>
            <select
              value={sortOption}
              onChange={(event) => setSortOption(event.target.value)}
              className="border border-[var(--line)] bg-[var(--bg-elevated)] px-3 py-2 text-sm text-[var(--text)] outline-none"
            >
              <option value="featured">{t.featured}</option>
              <option value="low">{t.priceLow}</option>
              <option value="high">{t.priceHigh}</option>
              <option value="rating">{t.rating}</option>
            </select>
          </div>
        </div>
      </div>

      {isLoading ? (
        <Loader />
      ) : (
        <div className={`grid w-full grid-cols-2 gap-3 py-2 sm:grid-cols-2 ${compact ? "lg:grid-cols-4 sm:gap-4" : "sm:gap-6 lg:grid-cols-3 xl:grid-cols-4"}`}>
          {filteredProducts.map((product) => (
            <div
              key={product._id}
              className={`group relative w-full overflow-hidden border border-[var(--line)] bg-[var(--panel)] transition-all duration-300 hover:-translate-y-1 ${compact ? "p-2 sm:p-2.5" : "p-3"}`}
            >
              <button
                onClick={() => toggleWishlist(product._id)}
                disabled={wishlistLoadingId === product._id}
                className={`absolute z-10 flex items-center justify-center border border-[var(--line)] bg-[var(--bg-elevated)] text-[var(--text)] transition hover:text-[#ff7f98] disabled:opacity-70 ${compact ? "right-3 top-3 h-7 w-7 text-xs sm:right-4 sm:top-4" : "right-5 top-5 h-9 w-9"}`}
                aria-label="Toggle wishlist"
              >
                {wishlistLoadingId === product._id ? (
                  <i className="fa fa-spinner fa-spin text-xs"></i>
                ) : (
                  <i className={`${wishlistIds.has(product._id) ? "fa-solid text-[#ff7f98]" : "fa-regular"} fa-heart`} />
                )}
              </button>

              <Link to={`/ProductDetails/${product._id}/${product.category?.name || "category"}`} className="block">
                <div className={`overflow-hidden ${compact ? "rounded-lg" : "rounded-[22px]"}`}>
                  <img
                    src={product.imageCover}
                    alt={product.title}
                    className={`w-full object-cover transition-transform duration-300 group-hover:scale-105 ${compact ? "h-32 sm:h-36" : "h-52"}`}
                  />
                </div>
                <p className={`font-medium uppercase text-[var(--muted)] ${compact ? "mb-1 mt-2 text-[9px] tracking-[0.12em]" : "mb-2 mt-4 text-[10px] tracking-[0.2em]"}`}>
                  {product.category?.name}
                </p>
                <h2 className={`font-medium text-[var(--text)] ${compact ? "min-h-10 text-sm leading-5 sm:text-base" : "min-h-12 text-lg"}`}>
                  {product.title.substring(0, 42)}
                </h2>
                <p className={`text-[var(--muted)] ${compact ? "mb-3 min-h-8 text-xs leading-4" : "mb-4 min-h-10 text-sm"}`}>
                  {product.description.substring(0, 45)}...
                </p>
              </Link>

              <div className={`flex items-center justify-between ${compact ? "mb-11" : "mb-14"}`}>
                <p className={`font-medium text-[var(--text)] ${compact ? "text-sm sm:text-base" : "text-xl"}`}>{product.price} EGP</p>
                <div className={`flex items-center gap-1 font-medium text-[var(--muted)] ${compact ? "text-xs" : "text-sm"}`}>
                  <i className="fa fa-star"></i>
                  <span>{product.ratingsAverage}</span>
                </div>
              </div>

              <button
                onClick={() => addProductToCart(product._id)}
                disabled={cartLoadingId === product._id}
                className={`absolute border border-[var(--line)] bg-[var(--bg-elevated)] font-medium uppercase tracking-[0.18em] text-[var(--text)] transition hover:border-[var(--text)] disabled:opacity-70 ${compact ? "bottom-2 left-2 right-2 px-2 py-2 text-[9px] sm:bottom-2.5 sm:left-2.5 sm:right-2.5 sm:text-[10px]" : "bottom-3 left-3 right-3 px-4 py-2.5 text-[10px]"}`}
              >
                {cartLoadingId === product._id ? (
                  <span className="inline-flex items-center gap-2">
                    <i className="fa fa-spinner fa-spin"></i>
                    {t.processing}
                  </span>
                ) : (
                  t.addToCart
                )}
              </button>
            </div>
          ))}

          {filteredProducts.length === 0 && !isLoading ? (
            <div className="col-span-full border border-[var(--line)] bg-[var(--panel)] p-8 text-center text-[var(--muted)]">
              No products match your current filters.
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}
