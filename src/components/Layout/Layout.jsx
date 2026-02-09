import React, { useEffect } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../Navbar/Navbar";
import Footer from "../Footer/Footer";

export default function Layout() {
  useEffect(() => {}, []);

  return (
    <>
      <Navbar />
      <main className="container mx-auto px-3 sm:px-4 md:px-6 pt-20 sm:pt-24 pb-24 sm:pb-8 min-h-screen max-w-7xl">
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
