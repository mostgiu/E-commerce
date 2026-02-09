import React, { useContext, useEffect, useState } from "react";
import Style from "./CheckOut.module.css";
import { useFormik } from "formik";
import * as yup from "yup";
import { CartContext } from "../Context/CartContext";
import { useLocation } from "react-router-dom";

// Validation schema
const validationSchema = yup.object({
  Details: yup
    .string("Enter your address details")
    .required("Address details is required"),
  phone: yup
    .string("Enter your phone number")
    .matches(/^[0-9]{10,}$/, "Phone must be at least 10 digits")
    .required("Phone number is required"),
  city: yup
    .string("Enter your city")
    .required("City is required"),
});

export default function CheckOut() {
  let { onlinePayment } = useContext(CartContext);
  let location = useLocation();
  const [paymentType, setpaymentType] = useState();
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      setIsSubmitting(true);
      await payOnline(values);
      setIsSubmitting(false);
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
          {formik.errors.Details && formik.touched.Details && (
            <p className="text-red-500 text-sm mt-1">{formik.errors.Details}</p>
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
          {formik.errors.city && formik.touched.city && (
            <p className="text-red-500 text-sm mt-1">{formik.errors.city}</p>
          )}
          <button
            type="submit"
            disabled={!formik.isValid || isSubmitting || !formik.dirty}
            className={`cursor-pointer px-5 py-3 text-xl rounded-md text-white font-semibold transition-all ${
              !formik.isValid || isSubmitting || !formik.dirty
                ? "bg-gray-400 cursor-not-allowed opacity-60"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {isSubmitting ? "Processing..." : "Pay Now"}
          </button>
        </form>
      </div>
    </>
  );
}
