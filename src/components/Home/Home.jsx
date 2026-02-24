import React from "react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import FeatureProducts from "../FeatureProducts/FeatureProducts";
import MainSlider from "../MainSlider/MainSlider";

export default function Home() {
  function getCategoryIcon(name = "") {
    const normalized = name.toLowerCase();

    if (normalized.includes("elect") || normalized.includes("laptop") || normalized.includes("phone")) {
      return "fa-solid fa-plug-circle-bolt";
    }
    if (normalized.includes("men") || normalized.includes("male")) {
      return "fa-solid fa-person";
    }
    if (normalized.includes("women") || normalized.includes("female") || normalized.includes("lady")) {
      return "fa-solid fa-person-dress";
    }
    if (normalized.includes("beaut") || normalized.includes("makeup") || normalized.includes("skin")) {
      return "fa-solid fa-wand-magic-sparkles";
    }
    if (normalized.includes("home") || normalized.includes("furn") || normalized.includes("decor")) {
      return "fa-solid fa-couch";
    }
    if (normalized.includes("grocery") || normalized.includes("food")) {
      return "fa-solid fa-basket-shopping";
    }

    if (normalized.includes("super") || normalized.includes("market")) {
      return "fa-solid fa-cart-shopping";
    }

    if (normalized.includes("book") || normalized.includes("books")) {
      return "fa-solid fa-book-open";
    }

    return "fa-solid fa-tags";
  }

  function getCategories() {
    return axios.get("https://ecommerce.routemisr.com/api/v1/categories");
  }

  const { data: categoriesData } = useQuery({
    queryKey: ["homeCategoriesList"],
    queryFn: getCategories,
    staleTime: 1000 * 60 * 5,
  });

  const categories =
    categoriesData?.data?.data
      ?.filter((category) => {
        const normalized = category.name?.toLowerCase() || "";
        return (
          !normalized.includes("music") &&
          !normalized.includes("baby") &&
          !normalized.includes("super") &&
          !normalized.includes("market") &&
          !normalized.includes("home") &&
          !normalized.includes("book") &&
          !normalized.includes("beaut") &&
          !normalized.includes("health") &&
          !normalized.includes("mobile")
        );
      })
      .slice(0, 8) || [];

  return (
    <div className="space-y-8 sm:space-y-10">
      <section className="pt-1 space-y-4">
        <nav className="bg-white border border-slate-200 rounded-2xl p-3 shadow-sm">
          <ul className="flex items-center justify-center gap-2 sm:gap-3 overflow-x-auto whitespace-nowrap pb-1">
            {categories.map((cat) => (
              <li key={cat._id}>
                <Link
                  to={`/categories/${cat._id}`}
                  state={{ categoryName: cat.name }}
                  className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                >
                  <i className={`${getCategoryIcon(cat.name)} text-indigo-500`}></i>
                  {cat.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center justify-between px-1">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-800">Featured Offers</h2>
          <span className="text-sm text-slate-500">Latest promos</span>
        </div>

        <div className="h-full">
          <MainSlider />
        </div>
      </section>

      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-800">Featured Products • Updated</h2>
          <span className="text-sm text-slate-500">Curated picks for you</span>
        </div>
      <FeatureProducts />
      </section>
    </div>
  );
}
