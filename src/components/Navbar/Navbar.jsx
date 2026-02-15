import { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import Logo from "../../assets/bazarlo-logo.svg";
import { TokenContext, CartContext } from "../Context/contexts";
import { useContext } from "react";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  let { noOfCartItems, getToCart } = useContext(CartContext);
  let { token, setToken } = useContext(TokenContext);

  const linkClasses = ({ isActive }) =>
    `pb-1 border-b-2 transition-all ${
      isActive
        ? "border-black text-black"
        : "border-transparent text-black hover:text-black hover:border-black"
    }`;

  const mobileLinkClasses = ({ isActive }) =>
    `block py-2 transition-all ${
      isActive
        ? "text-black font-semibold border-l-4 border-black pl-3"
        : "text-black hover:text-black"
    }`;

  let navigate = useNavigate();
  function logout() {
    localStorage.removeItem("userToken");
    setToken(null);
    setIsMenuOpen(false);
    navigate("/Login");
  }

  useEffect(() => {
    if (localStorage.getItem("userToken")) {
      getToCart();
    }
  }, []);

  return (
    <nav className="bg-white fixed top-0 left-0 right-0 z-50 backdrop-blur-sm p-5">
      <div className="py-2 px-4 flex items-center justify-between text-black max-w-7xl mx-auto">
        <Link to="/" className="shrink-0">
          <img
            src={Logo}
            width={64}
            height={64}
            alt="Logo"
            className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24"
          />
        </Link>

        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center gap-6 xl:gap-10">
          {token ? (
            <>
              <NavLink to="/" className={linkClasses} end>
                Home
              </NavLink>
             
              <NavLink to="/Brands" className={linkClasses}>
                Brands
              </NavLink>
              <NavLink
                to="/Cart"
                className={({ isActive }) =>
                  `pb-1 border-b-2 transition-all relative ${
                    isActive
                      ? "border-black text-black"
                      : "border-transparent text-black hover:text-black hover:border-black"
                  }`
                }
              >
                <span className=" px-3">
                  Cart{" "}
                  {noOfCartItems === 0 ? (
                    <div className="hidden">0</div>
                  ) : (
                    <div className="text-black bg-white text-xs font-medium absolute -top-1 -right-3 px-1.5 py-0.5 rounded-full text-center">{noOfCartItems}</div>
                  )}
                </span>
              </NavLink>
              <NavLink to="/Wishlist" className={linkClasses}>
                Wishlist
              </NavLink>
              <NavLink to="/Categories" className={linkClasses}>
                Categories
              </NavLink>
              <NavLink to="/Products" className={linkClasses}>
                Products
              </NavLink>
            </>
          ) : null}
        </div>

        {/* Desktop Auth */}
        <div className="hidden lg:flex items-center gap-4">
          {token ? (
            <button
              onClick={logout}
              className="hover:text-sky-200 transition-colors flex items-center gap-2"
            >
              <i className="fa-solid fa-right-from-bracket"></i>
              Logout
            </button>
          ) : (
            <>
              <NavLink to="/Login" className={linkClasses}>
                Login
              </NavLink>
              <NavLink to="/Register" className={linkClasses}>
                Register
              </NavLink>
            </>
          )}
        </div>

        {/* Mobile: Cart badge + Hamburger */}
        <div className="flex items-center gap-3 lg:hidden">
          {token && (
            <Link
              to="/Cart"
              className="relative p-2 hover:bg-black/10 rounded-lg transition-colors"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              <span className="absolute top-0 right-0 bg-blue-500 text-xs font-medium px-1 rounded-full min-w-4.5 text-center">
                {noOfCartItems}
              </span>
            </Link>
          )}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 rounded-lg hover:bg-black/10 transition-colors"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden bg-transparent border-t border-black/20 px-4 py-4 backdrop-blur-sm">
          <ul className="flex flex-col gap-3">
            {token ? (
              <>
                <li>
                  <NavLink
                    to="/"
                    onClick={() => setIsMenuOpen(false)}
                    className={mobileLinkClasses}
                    end
                  >
                    Home
                  </NavLink>
                </li>
                <li>
                 
                </li>
                <li>
                  <NavLink
                    to="/Brands"
                    onClick={() => setIsMenuOpen(false)}
                    className={mobileLinkClasses}
                  >
                    Brands
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/Cart"
                    onClick={() => setIsMenuOpen(false)}
                    className={mobileLinkClasses}
                  >
                    Cart ({noOfCartItems})
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/Wishlist"
                    onClick={() => setIsMenuOpen(false)}
                    className={mobileLinkClasses}
                  >
                    Wishlist
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/Categories"
                    onClick={() => setIsMenuOpen(false)}
                    className={mobileLinkClasses}
                  >
                    Categories
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/Products"
                    onClick={() => setIsMenuOpen(false)}
                    className={mobileLinkClasses}
                  >
                    Products
                  </NavLink>
                </li>
              </>
            ) : null}
            <li className="border-t border-black/20 pt-3 mt-2">
              {token ? (
                <button
                  onClick={logout}
                  className="block py-2 hover:text-sky-200 w-full text-left"
                >
                  <span className="inline-flex items-center gap-2">
                    <i className="fa-solid fa-right-from-bracket"></i>
                    Logout
                  </span>
                </button>
              ) : (
                <div className="flex flex-col gap-2">
                  <NavLink
                    to="/Login"
                    onClick={() => setIsMenuOpen(false)}
                    className={mobileLinkClasses}
                  >
                    Login
                  </NavLink>
                  <NavLink
                    to="/Register"
                    onClick={() => setIsMenuOpen(false)}
                    className={mobileLinkClasses}
                  >
                    Register
                  </NavLink>
                </div>
              )}
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
}
