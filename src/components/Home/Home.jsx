import React, { useEffect } from "react";
import Style from "./Home.module.css";
import FeatureProducts from "../FeatureProducts/FeatureProducts";
import MainSlider from "../MainSlider/MainSlider";
import CategorySlider from "../CategorySlider/CategorySlider";
export default function Home() {
  useEffect(() => {}, []);
  return (
    <>
    <MainSlider />
    <CategorySlider/>
      <FeatureProducts />
    </>
  );
}
