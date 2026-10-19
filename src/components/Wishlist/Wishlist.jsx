import React, { useContext } from "react";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Loader from "../Loader/Loader";
import { CartContext } from "../Context/contexts";
import { Link, useNavigate } from "react-router-dom";

export default function Wishlist() {
  const { getWishlist, removeFromWishlist, clearWishlist, addToCart } = useContext(CartContext);
  const navigate = useNavigate();
  const [cartLoadingId, setCartLoadingId] = useState(null);
  const [removeLoadingId, setRemoveLoadingId] = useState(null);
  const [isClearing, setIsClearing] = useState(false);
  const minLoaderDelay = (ms = 500) => new Promise((resolve) => setTimeout(resolve, ms));

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["wishlist"],
    queryFn: getWishlist,
    staleTime: 1000 * 60 * 2,
  });

  async function handleRemoveFromWishlist(productId) {
    setRemoveLoadingId(productId);
    try {
      const [response] = await Promise.all([
        removeFromWishlist(productId),
        minLoaderDelay(),
      ]);
      if (response?.status >= 200 && response?.status < 300) {
        refetch();
      }
    } finally {
      setRemoveLoadingId(null);
    }
  }

  async function handleAddToCart(productId) {
    setCartLoadingId(productId);
    const userToken = localStorage.getItem("userToken");
    if (!userToken) {
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

  async function handleClearWishlist() {
    setIsClearing(true);
    try {
      const response = await clearWishlist();
      if (response?.status >= 200 && response?.status < 300) {
        refetch();
      }
    } finally {
      setIsClearing(false);
    }
  }

  if (isLoading) {
    return <Loader />;
  }

  if (isError) {
    return <p className="text-center text-red-500 py-8">Failed to load wishlist.</p>;
  }

  const wishlistItems = data?.data?.data || [];

  return (
    <div className="container mx-auto px-3 sm:px-4 md:px-6 max-w-7xl py-6 sm:py-8">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-[var(--accent-strong)]">Saved for later</p>
          <h1 className="text-3xl font-bold luxury-heading">My Wishlist</h1>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm luxury-muted">{wishlistItems.length} items</span>
          {wishlistItems.length > 0 ? (
            <button
              type="button"
              onClick={handleClearWishlist}
              disabled={isClearing}
              className="cursor-pointer rounded-full border border-[rgba(248,113,113,0.35)] bg-[rgba(248,113,113,0.1)] px-3 py-2 text-xs font-medium text-[#fca5a5] transition hover:bg-[rgba(248,113,113,0.18)] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isClearing ? <i className="fa fa-spinner fa-spin" /> : "Clear wishlist"}
            </button>
          ) : null}
        </div>
      </div>

      {wishlistItems.length === 0 ? (
        <div className="luxury-panel rounded-xl p-6 text-center space-y-3">
          <p className="text-[var(--text)]">Your wishlist is empty.</p>
          <Link
            to="/products"
            className="inline-flex items-center justify-center border border-[var(--line)] bg-[var(--bg-elevated)] px-4 py-2 text-sm font-medium uppercase tracking-[0.18em] text-[var(--text)] transition-colors hover:border-[var(--text)]"
          >
            Browse products
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {wishlistItems.map((item) => (
            <div
              key={item._id}
              className="w-full overflow-hidden rounded-[26px] border border-[var(--line)] bg-[var(--panel)] p-3 shadow-[0_8px_22px_rgba(0,0,0,0.04)]"
            >
              <Link to={`/ProductDetails/${item._id}/${item.category?.name || "item"}`}>
                <img
                  src={item.imageCover}
                  alt={item.title}
                  className="w-full h-44 object-cover mb-3 rounded-xl"
                />
                <h2 className="mb-2 min-h-12 text-base font-semibold text-[var(--text)] line-clamp-2">
                  {item.title}
                </h2>
              </Link>
              <div className="flex items-center justify-between">
                <p className="text-lg font-bold text-[var(--accent-strong)]">{item.price} EGP</p>
                <button
                  onClick={() => handleRemoveFromWishlist(item._id)}
                  disabled={removeLoadingId === item._id}
                  className="cursor-pointer border border-[var(--line)] bg-[var(--panel-strong)] px-3 py-1.5 text-sm text-[var(--text)] transition-colors hover:bg-[var(--bg)] disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {removeLoadingId === item._id ? (
                    <span className="inline-flex items-center gap-2">
                      <i className="fa fa-spinner fa-spin"></i>
                      Removing...
                    </span>
                  ) : (
                    "Remove"
                  )}
                </button>
              </div>
              <button
                onClick={() => handleAddToCart(item._id)}
                disabled={cartLoadingId === item._id}
                className="mt-3 w-full cursor-pointer border border-[var(--line)] bg-[var(--bg-elevated)] px-3 py-2 text-sm font-medium uppercase tracking-[0.18em] text-[var(--text)] transition-colors hover:border-[var(--text)] disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {cartLoadingId === item._id ? (
                  <span className="inline-flex items-center gap-2">
                    <i className="fa fa-spinner fa-spin"></i>
                    Adding...
                  </span>
                ) : (
                  "Add to cart"
                )}
              </button>
              <div className="mt-2 flex items-center justify-between text-xs text-[var(--muted)]">
                <span>{item.brand?.name || ""}</span>
                <span>{item.ratingsAverage ? `★ ${item.ratingsAverage}` : ""}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
