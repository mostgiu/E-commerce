import React, { useContext, useState } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import { CartContext } from "../Context/contexts";
import { useLocation } from "react-router-dom";
import PaymentLogo from "../PaymentLogo/PaymentLogo";

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
  const [paymentType, setPaymentType] = useState(location.state?.paymentMethod || "cash On Delivery");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const canProcessPayment =
    paymentType === "cash On Delivery" || paymentType === "credit card";

  let formik = useFormik({
    initialValues: {
      Details: "",
      phone: "",
      city: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      if (!canProcessPayment) return;
      setIsSubmitting(true);
      try {
        await payOnline(values);
      } finally {
        setIsSubmitting(false);
      }
    },
  });
  async function payOnline(values) {
    if (paymentType === "credit card") {
      await onlinePayment(values);
    } else if (paymentType === "cash On Delivery") {
      await cashPayment(values);
    }
  }

  return (
    <div className="flex min-h-[calc(100vh-11rem)] items-start justify-center px-3 py-6 sm:py-10">
      <div className="w-full max-w-3xl rounded-2xl border border-[var(--line)] bg-[var(--panel)] p-4 shadow-[var(--shadow)] sm:p-7">
        <div className="mb-7 border-b border-[var(--line)] pb-5">
          <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.24em] text-[var(--accent-strong)]">Secure checkout</p>
          <h1 className="text-3xl font-bold text-[var(--text)]">Complete your order</h1>
          <p className="mt-2 text-sm text-[var(--muted)]">Choose a payment method and add your delivery details.</p>
        </div>

        <form onSubmit={formik.handleSubmit} className="space-y-7">
          <section>
            <div className="mb-3 flex items-center gap-3">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[var(--accent)] text-xs font-bold text-[#111]">1</span>
              <div>
                <h2 className="text-lg font-semibold text-[var(--text)]">Shipping address</h2>
                <p className="text-xs text-[var(--muted)]">Where should we deliver your order?</p>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label htmlFor="Details" className="mb-1.5 block text-sm font-medium text-[var(--muted)]">
                  Address details
                </label>
            <input
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              value={formik.values.Details}
              type="text"
              name="Details"
              id="Details"
              className="block w-full rounded-lg border border-[var(--line)] bg-[rgba(255,255,255,0.02)] px-3 py-2.5 text-sm text-[var(--text)] placeholder:text-[var(--muted)] focus:border-[var(--accent)] focus:outline-none"
              placeholder="Street, building, apartment"
            />
            {formik.errors.Details && formik.touched.Details && (
              <p className="mt-1 text-sm text-[#fca5a5]">{formik.errors.Details}</p>
            )}
              </div>

              <div>
                <label htmlFor="city" className="mb-1.5 block text-sm font-medium text-[var(--muted)]">City</label>
                <input
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.city}
                  type="text"
                  name="city"
                  id="city"
                  className="block w-full rounded-lg border border-[var(--line)] bg-[rgba(255,255,255,0.02)] px-3 py-2.5 text-sm text-[var(--text)] placeholder:text-[var(--muted)] focus:border-[var(--accent)] focus:outline-none"
                  placeholder="Cairo"
                />
                {formik.errors.city && formik.touched.city && (
                  <p className="mt-1 text-sm text-[#fca5a5]">{formik.errors.city}</p>
                )}
              </div>

              <div>
                <label htmlFor="phone" className="mb-1.5 block text-sm font-medium text-[var(--muted)]">Phone number</label>
            <input
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              value={formik.values.phone}
              type="tel"
              name="phone"
              id="phone"
              className="block w-full rounded-lg border border-[var(--line)] bg-[rgba(255,255,255,0.02)] px-3 py-2.5 text-sm text-[var(--text)] placeholder:text-[var(--muted)] focus:border-[var(--accent)] focus:outline-none"
              placeholder="01xxxxxxxxx"
            />
            {formik.errors.phone && formik.touched.phone && (
              <p className="mt-1 text-sm text-[#fca5a5]">{formik.errors.phone}</p>
            )}
              </div>
            </div>
          </section>

          <section>
            <div className="mb-3 flex items-center gap-3">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[var(--accent)] text-xs font-bold text-[#111]">2</span>
              <div>
                <h2 className="text-lg font-semibold text-[var(--text)]">Payment method</h2>
                <p className="text-xs text-[var(--muted)]">Select how you would like to pay.</p>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {[
                { value: "cash On Delivery", label: "Cash on delivery", icon: "fa-money-bill-wave", detail: "Pay when your order arrives" },
                { value: "credit card", label: "Credit card", detail: "Secure online payment" },
                { value: "paypal", label: "PayPal", detail: "Coming soon" },
                { value: "klarna", label: "Klarna", detail: "Coming soon" },
              ].map((method) => {
                const isSelected = paymentType === method.value;
                return (
                  <button
                    key={method.value}
                    type="button"
                    onClick={() => setPaymentType(method.value)}
                    className={`flex items-center gap-3 rounded-xl border p-4 text-left transition ${isSelected ? "border-[var(--accent)] bg-[var(--accent-soft)]" : "border-[var(--line)] bg-[rgba(255,255,255,0.02)] hover:border-[rgba(212,175,109,0.45)]"}`}
                  >
                    <span className={`flex h-10 ${method.value === "klarna" ? "min-w-[70px] px-2" : "w-10"} items-center justify-center rounded-full ${isSelected ? "bg-[var(--accent)] text-[#111]" : "bg-[var(--panel-strong)] text-[var(--muted)]"}`}>
                      {method.value === "credit card" || method.value === "paypal" || method.value === "klarna" ? (
                        <PaymentLogo method={method.value === "credit card" ? "mastercard" : method.value} />
                      ) : (
                        <i className={`fa-solid ${method.icon}`} />
                      )}
                    </span>
                    <span className="min-w-0">
                      <span className="block text-sm font-semibold text-[var(--text)]">{method.label}</span>
                      <span className="mt-0.5 block text-xs text-[var(--muted)]">{method.detail}</span>
                    </span>
                    <span className={`ml-auto flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${isSelected ? "border-[var(--accent)] bg-[var(--accent)] text-[#111]" : "border-[var(--line)]"}`}>
                      {isSelected ? <i className="fa-solid fa-check text-[10px]" /> : null}
                    </span>
                  </button>
                );
              })}
            </div>
            {!canProcessPayment ? (
              <p className="mt-3 text-sm text-[var(--muted)]" role="status">
                PayPal and Klarna checkout are coming soon. Choose cash on
                delivery or credit card to place your order.
              </p>
            ) : null}
          </section>

          <button
            type="submit"
            disabled={!formik.isValid || isSubmitting || !formik.dirty || !canProcessPayment}
            className={`w-full cursor-pointer rounded-lg border px-5 py-3 text-base font-semibold transition-all ${
              !formik.isValid || isSubmitting || !formik.dirty || !canProcessPayment
                ? "cursor-not-allowed border-[var(--line)] bg-[var(--panel-strong)] text-[var(--muted)]"
                : "border-[rgba(212,175,109,0.7)] bg-[linear-gradient(135deg,#d4af6d,#b68d46)] text-[#111111] hover:brightness-110"
            }`}
          >
            {isSubmitting
              ? "Processing..."
              : !canProcessPayment
                ? `${paymentType === "paypal" ? "PayPal" : "Klarna"} coming soon`
              : paymentType === "cash On Delivery"
                ? "Place Cash Order"
                : "Pay Now"}
          </button>
        </form>
      </div>
    </div>
  );
}
