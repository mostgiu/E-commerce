import React, { useEffect } from "react";
import Style from './Footer.module.css'
export default function Footer() {
  useEffect(() => {}, []);
  return (
    <footer className="bg-sky-600 text-center w-full p-4 sm:p-6 text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4">
        <p className="text-sm sm:text-base">© {new Date().getFullYear()} E-Commerce. All rights reserved.</p>
      </div>
    </footer>
  );
}
