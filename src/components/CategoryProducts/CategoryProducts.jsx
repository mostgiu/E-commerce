import React, { useContext, useState } from "react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import Loader from "../Loader/Loader";
import { CartContext } from "../Context/contexts";

export default function CategoryProducts() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const categoryName = location.state?.categoryName || "Category";
  const { addToCart, addToWishlist } = useContext(CartContext);
  const [wishlistIds, setWishlistIds] = useState(new Set());
  const [cartLoadingId, setCartLoadingId] = useState(null);
  const [wishlistLoadingId, setWishlistLoadingId] = useState(null);
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

  function getProducts() {
    return axios.get("https://ecommerce.routemisr.com/api/v1/products");
  }

  const { data, isLoading, isError } = useQuery({
    queryKey: ["categoryProducts", id],
    queryFn: getProducts,
  });

  const filteredProducts =
    data?.data?.data?.filter((product) => product.category?._id === id) || [];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (isError) {
    return <p className="text-center text-red-500 py-8">Failed to load products.</p>;
  }

  return (
    <div className="container mx-auto px-3 sm:px-4 md:px-6 max-w-7xl py-6 sm:py-8">
      <div className="mb-6 border border-[var(--line)] bg-[var(--panel)] p-5 text-[var(--text)] shadow-[0_10px_26px_rgba(0,0,0,0.04)] sm:p-7">
        <p className="mb-2 text-xs uppercase tracking-[0.2em] text-[var(--accent)]">Category Collection</p>
        <h1 className="text-2xl font-bold sm:text-3xl">{categoryName} Products</h1>
        <p className="mt-2 text-sm text-[var(--muted)]">Browse curated items and add your favorites to cart.</p>
      </div>

      {filteredProducts.length === 0 ? (
        <div className="rounded-xl border border-[var(--line)] bg-[var(--panel)] p-6 text-center text-[var(--muted)]">
          No products found for this category.
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {filteredProducts.map((product) => (
            <div
              key={product._id}
              className="group relative w-full overflow-hidden rounded-[24px] border border-[var(--line)] bg-[var(--panel)] p-2 shadow-[0_8px_20px_rgba(0,0,0,0.04)] transition-all duration-300 hover:-translate-y-1 hover:border-[var(--text)] sm:p-2.5"
            >
              <button
                onClick={() => toggleWishlist(product._id)}
                disabled={wishlistLoadingId === product._id}
                className="absolute right-3 top-3 z-10 flex h-7 w-7 cursor-pointer items-center justify-center rounded-full border border-[var(--line)] bg-[var(--panel)] text-xs text-[var(--text)] shadow-lg transition hover:text-[#ff9bb3] disabled:opacity-70 disabled:cursor-not-allowed sm:right-4 sm:top-4"
                aria-label="Toggle wishlist"
              >
                {wishlistLoadingId === product._id ? (
                    <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-[var(--panel-strong)] text-[var(--text)]">
                    <i className="fa fa-spinner fa-spin text-xs"></i>
                  </span>
                ) : (
                  <i className={`${wishlistIds.has(product._id) ? "fa-solid text-rose-500" : "fa-regular"} fa-heart`}></i>
                )}
              </button>

              <Link to={`/ProductDetails/${product._id}/${product.category?.name}`}>
                <img
                  src={product.imageCover}
                  alt={product.title}
                  className="mb-2 h-32 w-full rounded-lg object-cover transition-transform group-hover:scale-[1.02] sm:h-36"
                />
                <p className="mb-1 text-[9px] font-medium uppercase tracking-[0.12em] text-[var(--accent-strong)]">{product.category?.name}</p>
                <h2 className="mb-1 min-h-10 text-sm font-semibold leading-5 text-[var(--text)] sm:text-base">
                  {product.title.substring(0, 40)}
                </h2>
                <p className="mb-3 min-h-8 text-xs leading-4 text-[var(--muted)]">
                  {product.description.substring(0, 45)}...
                </p>
              </Link>

              <div className="mb-11 flex items-center justify-between">
                <p className="text-sm font-bold text-[var(--accent-strong)] sm:text-base">{product.price} EGP</p>
                <div className="flex items-center gap-1 text-xs font-semibold text-[#facc15]">
                  <i className="fa fa-star"></i>
                  <span>{product.ratingsAverage}</span>
                </div>
              </div>

              <button
                onClick={() => addProductToCart(product._id)}
                disabled={cartLoadingId === product._id}
                className="absolute bottom-2 left-2 right-2 mt-3 border border-[var(--line)] bg-[var(--bg-elevated)] px-2 py-2 text-xs font-medium uppercase tracking-[0.18em] text-[var(--text)] transition hover:border-[var(--text)] disabled:opacity-70 disabled:cursor-not-allowed sm:bottom-2.5 sm:left-2.5 sm:right-2.5 sm:text-sm"
              >
                {cartLoadingId === product._id ? (
                  <span className="inline-flex items-center gap-2">
                    <i className="fa fa-spinner fa-spin"></i>
                    Adding...
                  </span>
                ) : (
                  "Add to Cart"
                )}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
