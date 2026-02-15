import React, { useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import Loader from "../Loader/Loader";
import { CartContext } from "../Context/contexts";
import { Link, useNavigate } from "react-router-dom";

export default function Wishlist() {
  const { getWishlist, removeFromWishlist, addToCart } = useContext(CartContext);
  const navigate = useNavigate();

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["wishlist"],
    queryFn: getWishlist,
    staleTime: 1000 * 60 * 2,
  });

  async function handleRemoveFromWishlist(productId) {
    const response = await removeFromWishlist(productId);
    if (response?.status >= 200 && response?.status < 300) {
      refetch();
    }
  }

  async function handleAddToCart(productId) {
    const userToken = localStorage.getItem("userToken");
    if (!userToken) {
      navigate("/login");
      return;
    }
    await addToCart(productId);
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
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">My Wishlist</h1>
        <span className="text-sm text-slate-500">{wishlistItems.length} items</span>
      </div>

      {wishlistItems.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-xl p-6 text-center text-slate-600 space-y-3">
          <p>Your wishlist is empty.</p>
          <Link
            to="/products"
            className="inline-flex items-center justify-center rounded-lg border border-black bg-black px-4 py-2 text-sm text-white hover:bg-white hover:text-black transition-colors"
          >
            Browse products
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {wishlistItems.map((item) => (
            <div
              key={item._id}
              className="bg-white border border-slate-200 p-3 rounded-2xl shadow-sm w-full overflow-hidden"
            >
              <Link to={`/ProductDetails/${item._id}/${item.category?.name || "item"}`}>
                <img
                  src={item.imageCover}
                  alt={item.title}
                  className="w-full h-44 object-cover mb-3 rounded-xl"
                />
                <h2 className="text-base font-semibold text-slate-800 mb-2 line-clamp-2 min-h-12">
                  {item.title}
                </h2>
              </Link>
              <div className="flex items-center justify-between">
                <p className="text-indigo-600 font-bold text-lg">${item.price}</p>
                <button
                  onClick={() => handleRemoveFromWishlist(item._id)}
                  className="text-sm px-3 py-1.5 rounded border border-black bg-black text-white hover:bg-white hover:text-black transition-colors cursor-pointer"
                >
                  Remove
                </button>
              </div>
              <button
                onClick={() => handleAddToCart(item._id)}
                className="mt-3 w-full rounded-lg border border-black bg-black px-3 py-2 text-sm font-medium text-white hover:bg-white hover:text-black transition-colors cursor-pointer"
              >
                Add to cart
              </button>
              <div className="mt-2 text-xs text-slate-500 flex items-center justify-between">
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
