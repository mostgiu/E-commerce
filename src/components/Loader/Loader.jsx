import React from "react";
import { ColorRing } from "react-loader-spinner";
import Style from "./Loader.module.css";

export default function Loader() {
  return (
    <div className={Style.loader}>
      <ColorRing
        height="100"
        width="100"
        wrapperClass="color-ring-wrapper"
        colors={["#000000", "#000000", "#000000", "#000000", "#000000"]}
        ariaLabel="color-ring-loading"
        visible={true}
      />
    </div>
  );
}
