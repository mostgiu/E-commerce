import React from "react";
import FeatureProducts from "../FeatureProducts/FeatureProducts";
import MainSlider from "../MainSlider/MainSlider";

export default function Home() {
  return (
    <div className="space-y-10 sm:space-y-14">
      <section className="hidden space-y-4 pt-1 md:block">
        <div className="flex items-end justify-between gap-4 px-1">
          <div>
            <p className="mb-1 text-[10px] font-medium uppercase tracking-[0.24em] text-[var(--muted)]">Bazarlo edit</p>
            <h2 className="text-2xl font-medium luxury-heading sm:text-3xl">Featured Offers</h2>
          </div>
          <span className="hidden text-[10px] uppercase tracking-[0.18em] luxury-muted sm:block">Latest promos</span>
        </div>

        <MainSlider />
      </section>

      <section>
        <div className="mb-5 flex items-end justify-between gap-4">
          <div>
            <p className="mb-1 text-[10px] font-medium uppercase tracking-[0.24em] text-[var(--muted)]">The collection</p>
            <h2 className="text-2xl font-medium luxury-heading sm:text-3xl">Featured Products</h2>
          </div>
          <span className="hidden text-[10px] uppercase tracking-[0.18em] luxury-muted sm:block">Curated picks for you</span>
        </div>
        <FeatureProducts compact />
      </section>
    </div>
  );
}
