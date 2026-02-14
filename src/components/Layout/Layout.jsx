import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../Navbar/Navbar";
import Footer from "../Footer/Footer";

export default function Layout() {
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    function handleScroll() {
      setShowBackToTop(window.scrollY > 300);
    }

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  function goToTop() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <>
      <Navbar />
      <main className="container mx-auto px-3 sm:px-4 md:px-6 pt-20 sm:pt-24 pb-24 sm:pb-8 min-h-screen max-w-7xl">
        <Outlet />
      </main>

      {showBackToTop ? (
        <button
          onClick={goToTop}
          className="fixed bottom-6 right-6 z-50 h-11 w-11 rounded-full bg-black text-white border border-black hover:bg-white hover:text-black transition-colors shadow-md cursor-pointer"
          aria-label="Back to top"
        >
          <i className="fa-solid fa-arrow-up"></i>
        </button>
      ) : null}

      <Footer />
    </>
  );
}
