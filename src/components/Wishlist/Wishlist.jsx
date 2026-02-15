import React from "react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import Loader from "../Loader/Loader";

export default function Wishlist() {
  function getWishlist() {
    return axios.get("https://ecommerce.routemisr.com/api/v1/wishlist", {
      headers: {
        token: localStorage.getItem("userToken"),
      },
    });
  }

  const { data, isLoading, isError } = useQuery({
    queryKey: ["wishlist"],
    queryFn: getWishlist,
  });

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
        <div className="bg-white border border-slate-200 rounded-xl p-6 text-center text-slate-600">
          Your wishlist is empty.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {wishlistItems.map((item) => (
            <div
              key={item._id}
              className="bg-white border border-slate-200 p-3 rounded-2xl shadow-sm w-full overflow-hidden"
            >
              <img
                src={item.imageCover}
                alt={item.title}
                className="w-full h-44 object-cover mb-3 rounded-xl"
              />
              <h2 className="text-base font-semibold text-slate-800 mb-1 min-h-12">
                {item.title?.substring(0, 42)}
              </h2>
              <p className="text-indigo-600 font-bold text-lg">${item.price}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
