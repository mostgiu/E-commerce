import React, { useEffect, useState } from "react";
import Style from "./Brands.module.css";
import { useDispatch, useSelector } from "react-redux";
import { getBrands } from "../Redux/ProductSlice";
import { Link } from "react-router-dom";



export default function Brands() {
  let { brands } = useSelector((state) => state.productRed);
  let dispatch = useDispatch();
  async function getData(){
    dispatch(getBrands())
  }
  useEffect(() => { 
    getData();
  }, []);
  return <>
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 py-4 w-full max-w-7xl">
          {brands.map((brand) => (
            <div
              key={brand._id}
              className="border p-4 rounded-lg shadow-lg relative w-full max-w-sm mx-auto sm:mx-0"
            >
              <Link
                to={`/brandDetails/${brand._id}`}
              >
                <img
                  src={brand.image}
                  alt={brand.title}
                  className="w-full h-40 object-cover mb-4 rounded"
                />
                
              </Link>
             
            
            
            </div>
          ))}
        </div>
  
  
  
  </>;
}
