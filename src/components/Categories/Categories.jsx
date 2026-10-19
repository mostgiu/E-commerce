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
    <div className="container mx-auto max-w-7xl px-3 py-6 sm:px-4 md:px-6">
      <div className="mb-6">
        <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.24em] text-[var(--accent)]">Browse by mood</p>
        <h1 className="text-3xl font-bold text-[var(--text)]">Categories</h1>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4">
        {data?.data?.data?.map((category) => (
          <Link
            key={category._id}
            to={`/categories/${category._id}`}
            state={{ categoryName: category.name }}
            className="group block w-full overflow-hidden border border-[var(--line)] bg-[var(--panel)] p-3 shadow-[0_8px_22px_rgba(0,0,0,0.04)] transition-all duration-300 hover:-translate-y-1 hover:border-[var(--text)]"
          >
            <img
              src={category.image}
              alt={category.name}
              className="mb-4 h-48 w-full rounded-[20px] object-cover transition-transform duration-300 group-hover:scale-[1.03]"
            />
            <h2 className="text-center text-lg font-semibold text-[var(--text)]">{category.name}</h2>
          </Link>
        ))}
      </div>
    </div>
  );
}
