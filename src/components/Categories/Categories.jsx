import React from "react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import Loader from "../Loader/Loader";
import { Link } from "react-router-dom";

export default function Categories() {
  function getCategories() {
    return axios.get("https://ecommerce.routemisr.com/api/v1/categories");
  }

  const { data, isLoading, isError } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (isError) {
    return <p className="text-center text-red-500 py-8">Failed to load categories.</p>;
  }

  return (
    <div className="container mx-auto px-3 sm:px-4 md:px-6 max-w-7xl py-6">
      <h1 className="text-2xl font-bold mb-6">Categories</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
        {data?.data?.data?.map((category) => (
          <Link
            key={category._id}
            to={`/categories/${category._id}`}
            state={{ categoryName: category.name }}
            className="border p-4 rounded-lg shadow-lg bg-white w-full block hover:shadow-xl transition"
          >
            <img
              src={category.image}
              alt={category.name}
              className="w-full h-44 object-cover rounded mb-4"
            />
            <h2 className="text-lg font-semibold text-center">{category.name}</h2>
          </Link>
        ))}
      </div>
    </div>
  );
}
