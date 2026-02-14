import React, { useContext, useState } from "react";
import Style from "./CheckOut.module.css";
import { useFormik } from "formik";
import * as yup from "yup";
import { CartContext } from "../Context/contexts";
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
  let { onlinePayment, cashPayment } = useContext(CartContext);
  let location = useLocation();
  const [paymentType] = useState(location.state?.paymentMethod || "Payment");
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    if (paymentType === "credit card") {
      await onlinePayment(values);
    } else {
      await cashPayment(values);
    }
  }

  return (
    <div className="min-h-[calc(100vh-11rem)] flex items-center justify-center py-6 px-3">
      <div className="w-full max-w-xl bg-white border border-slate-200 rounded-2xl shadow-sm p-5 sm:p-7">
        <div className="mb-6">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500 mb-2">Checkout</p>
          <h1 className="text-2xl font-bold text-slate-900">{paymentType}</h1>
          <p className="text-sm text-slate-500 mt-1">Enter your shipping details to complete payment.</p>
        </div>

        <form onSubmit={formik.handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="Details" className="block text-sm font-medium text-slate-700 mb-1">
              Address Details
            </label>
            <input
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              value={formik.values.Details}
              type="text"
              name="Details"
              id="Details"
              className="block w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-black/20 focus:border-black"
              placeholder="Street, building, apartment"
            />
            {formik.errors.Details && formik.touched.Details && (
              <p className="text-red-500 text-sm mt-1">{formik.errors.Details}</p>
            )}
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-slate-700 mb-1">
              Phone Number
            </label>
            <input
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              value={formik.values.phone}
              type="tel"
              name="phone"
              id="phone"
              className="block w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-black/20 focus:border-black"
              placeholder="01xxxxxxxxx"
            />
            {formik.errors.phone && formik.touched.phone && (
              <p className="text-red-500 text-sm mt-1">{formik.errors.phone}</p>
            )}
          </div>

          <div>
            <label htmlFor="city" className="block text-sm font-medium text-slate-700 mb-1">
              City
            </label>
            <input
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              value={formik.values.city}
              type="text"
              name="city"
              id="city"
              className="block w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-black/20 focus:border-black"
              placeholder="Cairo"
            />
            {formik.errors.city && formik.touched.city && (
              <p className="text-red-500 text-sm mt-1">{formik.errors.city}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={!formik.isValid || isSubmitting || !formik.dirty}
            className={`w-full cursor-pointer px-5 py-3 text-base rounded-lg font-semibold transition-all border ${
              !formik.isValid || isSubmitting || !formik.dirty
                ? "bg-slate-200 text-slate-500 border-slate-200 cursor-not-allowed"
                : "bg-black text-white border-black hover:bg-white hover:text-black"
            }`}
          >
            {isSubmitting
              ? "Processing..."
              : paymentType === "cash On Delivery"
                ? "Place Cash Order"
                : "Pay Now"}
          </button>
        </form>
      </div>
    </div>
  );
}
