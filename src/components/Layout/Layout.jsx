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
      <main className="relative mx-auto min-h-screen max-w-7xl px-3 pb-24 pt-40 sm:px-4 sm:pb-8 sm:pt-44 md:px-6">
        <Outlet />
      </main>

      {showBackToTop ? (
        <button
          onClick={goToTop}
          className="fixed bottom-6 right-6 z-50 h-11 w-11 cursor-pointer border border-[var(--line)] bg-[var(--bg-elevated)] text-[var(--text)] shadow-[0_12px_24px_rgba(0,0,0,0.06)] transition-colors hover:border-[var(--text)]"
          aria-label="Back to top"
        >
          <i className="fa-solid fa-arrow-up"></i>
        </button>
      ) : null}

      <Footer />
    </>
  );
}
