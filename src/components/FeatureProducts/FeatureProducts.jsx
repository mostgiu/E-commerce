import React, { useState } from "react";
import axios from "axios";
import Loader from "../Loader/Loader";
import { useQuery } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
import { CartContext } from "../Context/contexts";
import { useContext } from "react";

export default function FeatureProducts() {
  let { addToCart, addToWishlist } = useContext(CartContext);
  const navigate = useNavigate();
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
  function getFeatureProducts() {
    return axios.get("https://ecommerce.routemisr.com/api/v1/products");
  }

  let { data, isLoading } = useQuery({
    queryKey: ["FeatureProducts"],
    queryFn: getFeatureProducts,
  });
  return (
    <div className="mx-auto px-1 sm:px-0">
      {isLoading ? (
        <Loader />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 py-2 w-full">
          {data?.data?.data.map((product) => (
            <div
              key={product._id}
              className="group bg-white border border-slate-200 p-3 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 relative w-full overflow-hidden"
            >
              <button
                onClick={() => toggleWishlist(product._id)}
                disabled={wishlistLoadingId === product._id}
                className="absolute top-5 right-5 z-10 h-8 w-8 rounded-full bg-white/95 border border-slate-200 shadow-sm text-slate-600 hover:text-rose-500 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
                aria-label="Toggle wishlist"
              >
                {wishlistLoadingId === product._id ? (
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-slate-900 text-white">
                    <i className="fa fa-spinner fa-spin text-xs"></i>
                  </span>
                ) : (
                  <i className={`${wishlistIds.has(product._id) ? "fa-solid text-rose-500" : "fa-regular"} fa-heart`}></i>
                )}
              </button>

              <Link
                to={`/ProductDetails/${product._id} /${product.category.name}`}
              >
                <img
                  src={product.imageCover}
                  alt={product.title}
                  className="w-full h-44 object-cover mb-3 rounded-xl group-hover:scale-[1.02] transition-transform"
                />
                <p className="text-xs font-medium text-indigo-500 mb-1">{product.category?.name}</p>
                <h2 className="text-base font-semibold text-slate-800 mb-1 min-h-12">
                  {product.title.substring(0, 42)}
                </h2>
                <p className="text-slate-500 text-sm mb-4 min-h-10">
                  {product.description.substring(0, 45)}...
                </p>
              </Link>

              <div className="flex items-center justify-between mb-14">
                <p className="text-indigo-600 font-bold text-lg">{product.price} EGP</p>
                <div className="flex items-center gap-1 text-amber-500 text-sm font-semibold">
                  <i className="fa fa-star"></i>
                  <span>{product.ratingsAverage}</span>
                </div>
              </div>

              <button
                onClick={() => addProductToCart(product._id)}
                disabled={cartLoadingId === product._id}
                className="mt-4 bg-black text-white px-4 py-2 rounded-lg border border-black hover:bg-white hover:text-black absolute bottom-3 left-3 right-3 cursor-pointer transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
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
