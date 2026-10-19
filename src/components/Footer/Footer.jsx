import React, { useEffect } from "react";

export default function Footer() {
  useEffect(() => {}, []);
  return (
    <footer className="mt-auto w-full border-t border-[var(--line)] bg-[var(--bg-elevated)] text-[var(--text)]">
      <div className="mx-auto max-w-7xl px-4 py-6 text-center sm:px-6">
        <p className="text-[10px] uppercase tracking-[0.2em] text-[var(--muted)] sm:text-[11px]">
          © {new Date().getFullYear()} <span className="font-medium text-[var(--text)]">Bazarlo</span>. Luxury essentials for a timeless wardrobe.
        </p>
      </div>
    </footer>
  );
}
