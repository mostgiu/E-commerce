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

  async function addProductToCart(productId) {
    if (!localStorage.getItem("userToken")) {
      navigate("/register");
      return;
    }
    await addToCart(productId);
  }

  async function toggleWishlist(productId) {
    if (!localStorage.getItem("userToken")) {
      navigate("/register");
      return;
    }

    const response = await addToWishlist(productId);
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
      <div className="bg-linear-to-r from-indigo-600 to-blue-500 rounded-2xl p-5 sm:p-7 text-white mb-6 shadow-lg">
        <p className="text-xs uppercase tracking-[0.2em] text-indigo-100 mb-2">Category Collection</p>
        <h1 className="text-2xl sm:text-3xl font-bold">{categoryName} Products</h1>
        <p className="text-sm text-indigo-100 mt-2">Browse curated items and add your favorites to cart.</p>
      </div>

      {filteredProducts.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-xl p-6 text-center text-slate-600">
          No products found for this category.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {filteredProducts.map((product) => (
            <div
              key={product._id}
              className="group bg-white border border-slate-200 p-3 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 relative w-full overflow-hidden"
            >
              <button
                onClick={() => toggleWishlist(product._id)}
                className="absolute top-5 right-5 z-10 h-8 w-8 rounded-full bg-white/95 border border-slate-200 shadow-sm text-slate-600 hover:text-rose-500 cursor-pointer"
                aria-label="Toggle wishlist"
              >
                <i className={`${wishlistIds.has(product._id) ? "fa-solid text-rose-500" : "fa-regular"} fa-heart`}></i>
              </button>

              <Link to={`/ProductDetails/${product._id}/${product.category?.name}`}>
                <img
                  src={product.imageCover}
                  alt={product.title}
                  className="w-full h-44 object-cover mb-3 rounded-xl group-hover:scale-[1.02] transition-transform"
                />
                <p className="text-xs font-medium text-indigo-500 mb-1">{product.category?.name}</p>
                <h2 className="text-base font-semibold text-slate-800 mb-1 min-h-12">
                  {product.title.substring(0, 40)}
                </h2>
                <p className="text-slate-500 text-sm mb-4 min-h-10">
                  {product.description.substring(0, 45)}...
                </p>
              </Link>

              <div className="flex items-center justify-between mb-14">
                <p className="text-indigo-600 font-bold text-lg">${product.price}</p>
                <div className="flex items-center gap-1 text-amber-500 text-sm font-semibold">
                  <i className="fa fa-star"></i>
                  <span>{product.ratingsAverage}</span>
                </div>
              </div>

              <button
                onClick={() => addProductToCart(product._id)}
                className="mt-4 bg-black text-white px-4 py-2 rounded-lg border border-black hover:bg-white hover:text-black absolute bottom-3 left-3 right-3 cursor-pointer transition-colors"
              >
                Add to Cart
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
