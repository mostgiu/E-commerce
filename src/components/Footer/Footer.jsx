import React, { useEffect } from "react";
import Style from './Footer.module.css'
export default function Footer() {
  useEffect(() => {}, []);
  return (
    <footer className="bg-slate-950 text-center w-full p-4 sm:p-6 text-slate-100 mt-auto border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4">
        <p className="text-sm sm:text-base text-slate-300">
          © {new Date().getFullYear()} <span className="text-indigo-400 font-semibold">E-Commerce</span>. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
