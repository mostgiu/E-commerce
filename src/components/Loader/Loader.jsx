import React from "react";
import { CirclesWithBar } from "react-loader-spinner";
import Style from "./Loader.module.css";

export default function Loader() {
  return (
    <div className={Style.loader}>
      <CirclesWithBar
        height="100"
        width="100"
        color="#4fa94d"
        outerCircleColor="#4fa94d"
        innerCircleColor="#4fa94d"
        barColor="#4fa94d"
        ariaLabel="circles-with-bar-loading"
        visible={true}
      />
    </div>
  );
}
