import React, { useEffect, useState } from "react";
import Style from "./Login.module.css";
import { useFormik } from "formik";
import axios from "axios";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { TokenContext } from "../Context/TokenContext";
import { useContext } from "react";


export default function Login() {
  let {token, setToken} = useContext(TokenContext);
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
      console.log(setToken)
      setIsLoading(false);
      navigate("/");
    } catch (error) {
      setErrorMessage(error.response.data.message);
      setIsLoading(false);
    }
  }

  return (
    <>
      
      <>
        <div className="container p-4 sm:p-6 md:p-10"></div>

        <form onSubmit={formik.handleSubmit} className="max-w-md mx-auto px-4 sm:px-6">
          <h2 className="font-bold text-3xl mb-10 text-blue-500">login Now</h2>
          {userMessage ? (
            <div
              className="p-4 mb-4  text-green-600 rounded-base bg-green-100"
              role="alert"
            >
              {userMessage}
            </div>
          ) : null}
          {errorMessage ? (
            <div
              className="p-4 mb-4 text-red-600 rounded-base bg-red-100"
              role="alert"
            >
              {errorMessage}
            </div>
          ) : null}

          <div className="relative z-0 w-full mb-5 group">
            <input
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              value={formik.values.email}
              type="email"
              name="email"
              className="block py-2.5 px-0 w-full text-sm text-heading bg-transparent border-0 border-b-2 border-default-medium appearance-none focus:outline-none focus:ring-0 focus:border-brand peer"
              placeholder=" "
            />
            <label
              htmlFor="email"
              id="email"
              className="absolute text-sm text-body duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[left] peer-focus:start-0 peer-focus:text-fg-brand peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto"
            >
              email
            </label>
          </div>
          {formik.errors.email && formik.touched.email && (
            <p className="text-red-500 text-sm mt-1">{formik.errors.email}</p>
          )}

          <div className="relative z-0 w-full mb-5 group">
            <input
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              value={formik.values.password}
              type="password"
              name="password"
              className="block py-2.5 px-0 w-full text-sm text-heading bg-transparent border-0 border-b-2 border-default-medium appearance-none focus:outline-none focus:ring-0 focus:border-brand peer"
              placeholder=" "
            />
            <label
              htmlFor="password"
              id="password"
              className="absolute text-sm text-body duration-300 transform -translate-y-6 scale-75 top-3 -z-10  peer-focus:start-0 peer-focus:text-fg-brand peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto"
            >
              password
            </label>
            {formik.errors.password && formik.touched.password && (
              <p className="text-red-500 text-sm mt-1">
                {formik.errors.password}
              </p>
            )}
          </div>

          <div>
            {isLoading ? (
              <button
                type="submit"
                className="cursor-pointer text-white bg-blue-500 box-border border border-transparent hover:bg-brand-strong focus:ring-4 focus:ring-brand-medium shadow-xs font-medium leading-5 rounded-full text-sm px-4 py-2.5 focus:outline-1"
              >
                <i className=" fa fa-spinner fa-spin"></i>
              </button>
            ) : (
              <button
              disabled={!(formik.isValid && formik.dirty)}
                type="submit"
                className="cursor-pointer text-white bg-green-500 box-border border border-transparent hover:bg-brand-strong focus:ring-4 focus:ring-brand-medium shadow-xs font-medium leading-5 rounded-full text-sm px-4 py-2.5 focus:outline-1"
 >
                login
              </button>
            )}
          </div>
        </form>
      </>
      
    </>
  );
}
