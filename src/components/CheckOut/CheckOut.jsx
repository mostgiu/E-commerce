import React, { useContext, useEffect, useState } from "react";
import Style from "./CheckOut.module.css";
import { useFormik } from "formik";
import { CartContext } from "../Context/CartContext";
import { useLocation } from "react-router-dom";

export default function CheckOut() {
  let { onlinePayment } = useContext(CartContext);
  let location = useLocation();
  const [paymentType, setpaymentType] = useState();

  useEffect(() => {
    setpaymentType(location.state?.paymentMethod);
    console.log("Payment Method:", location.state?.paymentMethod);
  }, [location]);

  // Log payment method passed from Cart via navigation state
  console.log("Location state:", location);
  let formik = useFormik({
    initialValues: {
      Details: "",
      phone: "",
      city: "",
    },
    onSubmit: (values) => {
      payOnline(values);
    },
  });
  async function payOnline(values) {
    await onlinePayment(values);
  }

  return (
    <>
      <div className="  h-200 flex items-center content-center">
        <form onSubmit={formik.handleSubmit} className="w-1/2 mx-auto ">
          <h1 className=" text-emerald-400 text-2xl">{paymentType}</h1>
          <div className="relative z-0 w-full mb-5 group ">
            <input
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              value={formik.values.Details}
              type="text"
              name="Details"
              id="Details"
              className="block py-2.5 px-0 w-full text-sm text-heading 
              bg-transparent border-0 border-b-2 border-default-medium 
              appearance-none focus:outline-none focus:ring-0 focus:border-brand peer"
              placeholder=" "
            />
            <label
              htmlFor="Details"
              id="Details"
              className="absolute text-sm text-body duration-300 
              transform -translate-y-6 scale-75 top-3 -z-10 origin-[left] 
              peer-focus:start-0 peer-focus:text-fg-brand
               peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0
                peer-focus:scale-75 peer-focus:-translate-y-6 rtl:peer-focus:translate-x-1/4 
                rtl:peer-focus:left-auto"
            >
              Details
            </label>
          </div>
          {formik.errors.text && formik.touched.text && (
            <p className="text-red-500 text-sm mt-1">{formik.errors.email}</p>
          )}

          <div className="relative z-0 w-full mb-5 group">
            <input
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              value={formik.values.phone}
              type="tel"
              name="phone"
              id="phone"
              className="block py-2.5 px-0 w-full text-sm text-heading bg-transparent border-0 border-b-2 border-default-medium appearance-none focus:outline-none focus:ring-0 focus:border-brand peer"
              placeholder=" "
            />
            <label
              htmlFor="phone"
              id="phone"
              className="absolute text-sm text-body duration-300 transform -translate-y-6 scale-75 top-3 -z-10  peer-focus:start-0 peer-focus:text-fg-brand peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto"
            >
              phone
            </label>
            {formik.errors.phone && formik.touched.phone && (
              <p className="text-red-500 text-sm mt-1">{formik.errors.phone}</p>
            )}
          </div>

          <div className="relative z-0 w-full mb-5 group">
            <input
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              value={formik.values.city}
              type="text"
              name="city"
              id="city"
              className="block py-2.5 px-0 w-full text-sm text-heading 
              bg-transparent border-0 border-b-2 border-default-medium 
              appearance-none focus:outline-none focus:ring-0 focus:border-brand peer"
              placeholder=" "
            />
            <label
              htmlFor="city"
              id="city"
              className="absolute text-sm text-body duration-300 
              transform -translate-y-6 scale-75 top-3 -z-10 origin-[left] 
              peer-focus:start-0 peer-focus:text-fg-brand
               peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0
                peer-focus:scale-75 peer-focus:-translate-y-6 rtl:peer-focus:translate-x-1/4 
                rtl:peer-focus:left-auto"
            >
              city
            </label>
          </div>
          <button className=" cursor-pointer hover:bg-blue-300 bg-blue-400 text-white px-5 py-3  text-xl rounded-md">
            Pay Now
          </button>
        </form>
      </div>
    </>
  );
}
