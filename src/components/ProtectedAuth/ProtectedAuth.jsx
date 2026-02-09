import React, { useEffect,useState } from "react";
import Style from './ProtectedAuth.module.css'
import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { TokenContext } from "../Context/TokenContext";

export default function ProtectedAuth({ children }) {
  const { token } = useContext(TokenContext);

  if (token) {
    return <Navigate to="/" replace />;
  }

  return children;
}
