import React, { use, useEffect, useState } from "react";
import axios from "axios";
import Loader from "../Loader/Loader";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { CartContext } from "../Context/CartContext";
import { useContext } from "react";

export default function FeatureProducts() {
  let { addToCart } = useContext(CartContext);
  async function addProductToCart(productId) {
    let response = await addToCart(productId);
  }
  function getFeatureProducts() {
    return axios.get("https://ecommerce.routemisr.com/api/v1/products");
  }

  let { data, isLoading, isFetching, error, isError, category } = useQuery({
    queryKey: ["FeatureProducts"],
    queryFn: getFeatureProducts,
  });
  return (
    <div className="mx-auto min-h-screen flex items-center justify-center px-2">
      {isLoading ? (
        <Loader />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 py-4 w-full max-w-7xl">
          {data?.data?.data.map((product) => (
            <div
              key={product._id}
              className="border p-4 rounded-lg shadow-lg relative w-full max-w-sm mx-auto sm:mx-0"
            >
              <Link
                to={`/ProductDetails/${product._id} /${product.category.name}`}
              >
                <img
                  src={product.imageCover}
                  alt={product.title}
                  className="w-full h-40 object-cover mb-4 rounded"
                />
                <h2 className="text-lg font-semibold mb-2">
                  {product.title.substring(0, 50)}
                </h2>
                <p className="text-gray-600 mb-6">
                  {product.description.substring(0, 50)}...
                </p>
              </Link>
              <h2 className="text-lg font-semibold mb-6">
                {product.title.substring(0, 50)}
              </h2>
              <p className="text-blue-600 font-bold">${product.price}</p>
              <div className="flex justify-between">
                <i className="fa fa-star text-amber-300 mb-6"></i>
                {product.ratingsAverage}
              </div>
              <button
                onClick={() => addProductToCart(product._id)}
                className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 absolute bottom-4"
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
