import React, { useState } from "react";
import { useFormik } from "formik";
import axios from "axios";
import * as Yup from "yup";
import { Link, useNavigate } from "react-router-dom";
import { TokenContext } from "../Context/contexts";
import { useContext } from "react";


export default function Login() {
  let { setToken } = useContext(TokenContext);
  const [userMessage, setUserMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  let navigate = useNavigate();
  let mySchema = Yup.object({
    email: Yup.string()
      .email("Invalid email format")
      .required("Email is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
  });
  let formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: mySchema,
    onSubmit: (values) => {
      loginForm(values);
    },
  });
  async function loginForm(values) {
    setIsLoading(true);
    setErrorMessage(null);
    setUserMessage(null);

    try {
      const response = await axios.post(
        "https://ecommerce.routemisr.com/api/v1/auth/signin",
        values
      );
      localStorage.setItem("userToken", response.data.token);
      setToken(response.data.token);
      setUserMessage(response.data.message);
      setIsLoading(false);
      navigate("/");
    } catch (error) {
      setErrorMessage(error.response.data.message);
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-[calc(100vh-11rem)] flex flex-col justify-center bg-slate-100 rounded-xl px-4 py-6 lg:px-6">
      <div className="sm:mx-auto sm:w-full sm:max-w-2xl">
        <h2 className="mt-2 text-center text-2xl leading-8 font-bold tracking-tight text-slate-800">
          Sign in to your account
        </h2>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-2xl overflow-hidden rounded-xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm">
        <form onSubmit={formik.handleSubmit} className="grid grid-cols-1 gap-4 md:grid-cols-2 overflow-hidden">
          {userMessage ? (
            <div className="p-3 text-green-700 rounded-md bg-green-50 border border-green-200 md:col-span-2" role="alert">
              {userMessage}
            </div>
          ) : null}

          {errorMessage ? (
            <div className="p-3 text-red-700 rounded-md bg-red-50 border border-red-200 md:col-span-2" role="alert">
              {errorMessage}
            </div>
          ) : null}

          <div>
            <label htmlFor="email" className="block text-sm leading-6 font-medium text-slate-700">Email address</label>
            <div className="mt-2">
              <input
                id="email"
                type="email"
                name="email"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.email}
                className="block w-full rounded-md bg-white px-3 py-2 text-base text-slate-900 outline-1 -outline-offset-1 outline-slate-300 placeholder:text-slate-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm"
              />
            </div>
            {formik.errors.email && formik.touched.email && (
              <p className="text-red-600 text-sm mt-1">{formik.errors.email}</p>
            )}
          </div>

          <div>
            <label htmlFor="password" className="block text-sm leading-6 font-medium text-slate-700">Password</label>
            <div className="mt-2">
              <input
                id="password"
                type="password"
                name="password"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.password}
                className="block w-full rounded-md bg-white px-3 py-2 text-base text-slate-900 outline-1 -outline-offset-1 outline-slate-300 placeholder:text-slate-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm"
              />
            </div>
            {formik.errors.password && formik.touched.password && (
              <p className="text-red-600 text-sm mt-1">{formik.errors.password}</p>
            )}
          </div>

          <div className="md:col-span-2">
            <button
              type="submit"
              disabled={isLoading || !(formik.isValid && formik.dirty)}
              className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isLoading ? <i className="fa fa-spinner fa-spin"></i> : "Sign in"}
            </button>
          </div>
        </form>

        <p className="mt-6 text-center text-sm leading-6 text-slate-600">
          New here?{" "}
          <Link to="/register" className="font-semibold text-indigo-600 hover:text-indigo-500">
            Create account
          </Link>
        </p>
      </div>
    </div>
  );
}
