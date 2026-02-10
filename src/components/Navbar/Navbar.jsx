import { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import Logo from "../../assets/logo.png";
import { TokenContext, CartContext } from "../Context/contexts";
import { useContext } from "react";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  let { noOfCartItems, getToCart } = useContext(CartContext);
  let { token, setToken } = useContext(TokenContext);

  const linkClasses = ({ isActive }) =>
    `pb-1 border-b-2 transition-all ${
      isActive
        ? "border-white text-white"
        : "border-transparent hover:text-sky-200 hover:border-sky-200"
    }`;

  const mobileLinkClasses = ({ isActive }) =>
    `block py-2 transition-all ${
      isActive
        ? "text-white font-semibold border-l-4 border-white pl-3"
        : "hover:text-sky-200"
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
    <nav className="bg-gray-500 fixed top-0 left-0 right-0 z-50">
      <div className="py-2 px-4 flex items-center justify-between text-white max-w-7xl mx-auto">
        <Link to="/" className="shrink-0">
          <img
            src={Logo}
            width={50}
            height={50}
            alt="Logo"
            className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14"
          />
        </Link>

        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center gap-6 xl:gap-10">
          {token ? (
            <>
              <NavLink to="/" className={linkClasses} end>
                Home
              </NavLink>
              <NavLink to="/About" className={linkClasses}>
                About
              </NavLink>
              <NavLink to="/Brands" className={linkClasses}>
                Brands
              </NavLink>
              <NavLink
                to="/Cart"
                className={({ isActive }) =>
                  `pb-1 border-b-2 transition-all relative ${
                    isActive
                      ? "border-white text-white"
                      : "border-transparent hover:text-sky-200 hover:border-sky-200"
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
              className="hover:text-sky-200 transition-colors"
            >
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
              className="relative p-2 hover:bg-sky-500 rounded-lg transition-colors"
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
              <span className="absolute top-0 right-0 bg-blue-500 text-xs font-medium px-1 rounded-full min-w-[18px] text-center">
                {noOfCartItems}
              </span>
            </Link>
          )}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 rounded-lg hover:bg-sky-500 transition-colors"
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
        <div className="lg:hidden bg-sky-600 border-t border-sky-500 px-4 py-4">
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
                  <NavLink
                    to="/About"
                    onClick={() => setIsMenuOpen(false)}
                    className={mobileLinkClasses}
                  >
                    About
                  </NavLink>
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
            <li className="border-t border-sky-500 pt-3 mt-2">
              {token ? (
                <button
                  onClick={logout}
                  className="block py-2 hover:text-sky-200 w-full text-left"
                >
                  Logout
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
