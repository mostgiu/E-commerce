import React, { useState } from "react";
import { useFormik } from "formik";
import axios from "axios";
import * as Yup from "yup";
import { Link, useNavigate } from "react-router-dom";

export default function Register() {
  const [userMessage, setUserMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showRePassword, setShowRePassword] = useState(false);
  let navigate = useNavigate();


  let mySchema = Yup.object({
    name: Yup.string()
      .min(3, "Name must be at least 3 characters")
      .max(15, "Name must be at most 15 characters")
      .required("Name is required"),
    phone: Yup.string()
      .matches(/^01[0125][0-9]{8}$/, "Phone number must start with 01 (e.g. 012...) and be 11 digits")
      .required("Phone number is required"),

    email: Yup.string()
      .email("Invalid email format")
      .required("Email is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
    rePassword: Yup.string()
      .oneOf([Yup.ref("password")], "Passwords must match")
      .required("Please confirm your password"),
  });
  let formik = useFormik({
    initialValues: {
      name: "",
      phone: "",
      email: "",
      password: "",
      rePassword: "",
    },
    validationSchema: mySchema,
    onSubmit: (values) => {
      registerForm(values);
    },
  });

  async function registerForm(values) {
    setErrorMessage(null);
setUserMessage(null);

    setIsLoading(true);
    try {
      const response = await axios.post(
        "https://ecommerce.routemisr.com/api/v1/auth/signup",
        values
      );
      setUserMessage(response.data.message);
      setIsLoading(false);
      navigate("/login");
    } catch (error) {
      setErrorMessage(error.response.data.message);
      setIsLoading(false);
      
    }
  }

  return (
    <div className="mx-auto flex min-h-[calc(100vh-11rem)] w-full max-w-3xl flex-col justify-center rounded-xl bg-[var(--panel)] px-4 py-6 lg:px-8">
      <div className="w-full">
        <h2 className="mt-2 text-center text-2xl leading-8 font-bold tracking-tight text-[var(--text)]">
          Create your account
        </h2>
      </div>

      <div className="mt-6 w-full overflow-hidden rounded-xl border border-[var(--line)] bg-[var(--panel-strong)] p-5 shadow-[var(--shadow)] sm:p-6">
        <form onSubmit={formik.handleSubmit} className="grid grid-cols-1 gap-4 md:grid-cols-2 overflow-hidden">
          {userMessage ? (
            <div className="rounded-md border border-[rgba(143,227,176,0.4)] bg-[rgba(143,227,176,0.12)] p-3 text-sm text-[var(--success)] md:col-span-2" role="alert">
              {userMessage}
            </div>
          ) : null}

          {errorMessage ? (
            <div className="rounded-md border border-[rgba(248,113,113,0.3)] bg-[rgba(248,113,113,0.12)] p-3 text-sm text-[#fca5a5] md:col-span-2" role="alert">
              {errorMessage}
            </div>
          ) : null}

          <div>
            <label htmlFor="name" className="block text-sm leading-6 font-medium text-[var(--muted)]">Full name</label>
            <div className="mt-2">
              <input
                id="name"
                type="text"
                name="name"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.name}
                className="block w-full rounded-md border border-[var(--line)] bg-[rgba(255,255,255,0.02)] px-3 py-2 text-base text-[var(--text)] outline-none placeholder:text-[var(--muted)] focus:border-[var(--accent)] sm:text-sm"
              />
            </div>
            {formik.errors.name && formik.touched.name && (
              <p className="mt-1 text-sm text-[#fca5a5]">{formik.errors.name}</p>
            )}
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm leading-6 font-medium text-[var(--muted)]">Phone</label>
            <div className="mt-2">
              <input
                id="phone"
                type="tel"
                name="phone"
                placeholder="012xxxxxxxx"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.phone}
                className="block w-full rounded-md border border-[var(--line)] bg-[rgba(255,255,255,0.02)] px-3 py-2 text-base text-[var(--text)] outline-none placeholder:text-[var(--muted)] focus:border-[var(--accent)] sm:text-sm"
              />
            </div>
            <p className="mt-1 text-xs text-[var(--muted)]">Phone must start with 01 (example: 012xxxxxxxx).</p>
            {formik.errors.phone && formik.touched.phone && (
              <p className="mt-1 text-sm text-[#fca5a5]">{formik.errors.phone}</p>
            )}
          </div>

          <div>
            <label htmlFor="email" className="block text-sm leading-6 font-medium text-[var(--muted)]">Email address</label>
            <div className="mt-2">
              <input
                id="email"
                type="email"
                name="email"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.email}
                className="block w-full rounded-md border border-[var(--line)] bg-[rgba(255,255,255,0.02)] px-3 py-2 text-base text-[var(--text)] outline-none placeholder:text-[var(--muted)] focus:border-[var(--accent)] sm:text-sm"
              />
            </div>
            {formik.errors.email && formik.touched.email && (
              <p className="mt-1 text-sm text-[#fca5a5]">{formik.errors.email}</p>
            )}
          </div>

          <div>
            <label htmlFor="password" className="block text-sm leading-6 font-medium text-[var(--muted)]">Password</label>
            <div className="relative mt-2">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                name="password"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.password}
                className="block w-full rounded-md border border-[var(--line)] bg-[rgba(255,255,255,0.02)] px-3 py-2 pr-10 text-base text-[var(--text)] outline-none placeholder:text-[var(--muted)] focus:border-[var(--accent)] sm:text-sm"
              />
              <button
                type="button"
                tabIndex={-1}
                aria-label={showPassword ? "Hide password" : "Show password"}
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute inset-y-0 right-3 flex items-center text-[var(--muted)] transition hover:text-[var(--text)]"
              >
                <i className={showPassword ? "fa fa-eye-slash" : "fa fa-eye"}></i>
              </button>
            </div>
            {formik.errors.password && formik.touched.password && (
              <p className="mt-1 text-sm text-[#fca5a5]">{formik.errors.password}</p>
            )}
          </div>

          <div>
            <label htmlFor="rePassword" className="block text-sm leading-6 font-medium text-[var(--muted)]">Confirm password</label>
            <div className="relative mt-2">
              <input
                id="rePassword"
                type={showRePassword ? "text" : "password"}
                name="rePassword"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.rePassword}
                className="block w-full rounded-md border border-[var(--line)] bg-[rgba(255,255,255,0.02)] px-3 py-2 pr-10 text-base text-[var(--text)] outline-none placeholder:text-[var(--muted)] focus:border-[var(--accent)] sm:text-sm"
              />
              <button
                type="button"
                tabIndex={-1}
                aria-label={showRePassword ? "Hide confirm password" : "Show confirm password"}
                onClick={() => setShowRePassword((prev) => !prev)}
                className="absolute inset-y-0 right-3 flex items-center text-[var(--muted)] transition hover:text-[var(--text)]"
              >
                <i className={showRePassword ? "fa fa-eye-slash" : "fa fa-eye"}></i>
              </button>
            </div>
            {formik.errors.rePassword && formik.touched.rePassword && (
              <p className="mt-1 text-sm text-[#fca5a5]">{formik.errors.rePassword}</p>
            )}
          </div>

          <div className="md:col-span-2">
            <button
              type="submit"
              disabled={isLoading || !(formik.isValid && formik.dirty)}
              className="flex w-full justify-center rounded-md border border-[rgba(212,175,109,0.7)] bg-[linear-gradient(135deg,#d4af6d,#b68d46)] px-3 py-2 text-sm font-semibold text-[#111111] transition hover:brightness-110 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isLoading ? <i className="fa fa-spinner fa-spin"></i> : "Sign up"}
            </button>
          </div>
        </form>

        <p className="mt-6 text-center text-sm leading-6 text-[var(--muted)]">
          Already have an account?{" "}
          <Link to="/login" className="font-semibold text-[var(--accent-strong)] hover:text-[var(--accent)]">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
