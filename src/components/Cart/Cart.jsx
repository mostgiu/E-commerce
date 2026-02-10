/**
 * Cart Component - Displays shopping cart items and allows users to manage their cart
 * Features:
 * - View all cart items
 * - Update product quantities
 * - Remove items from cart
 * - Clear entire cart
 * - Responsive layout (mobile card view, desktop table view)
 * - Proceed to checkout
 */

import React, { useEffect, useState } from "react";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Dropdown, DropdownItem, DropdownDivider } from "flowbite-react";
import Style from "./Cart.module.css";
import { CartContext } from "../Context/contexts";
import Loader from "../Loader/Loader";

export default function Cart() {
  // ============ STATE MANAGEMENT ============
  const [cartItems, setCartItems] = useState([]);
  // selected payment method for debugging / route state (not used)
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // ============ CONTEXT & HOOKS ============
  const {
    getToCart,
    removeCartItem,
    updateProduct,
    ClearCart,
    totalCartAmount,
  } = useContext(CartContext);

  const navigate = useNavigate();

  // ============ API CALLS ============
  /**
   * Fetch all cart items from the API
   */
  async function getAllCart() {
    let response = await getToCart();
    if (response?.status === 500 || response?.response?.status === 500) {
      setError("Server error: The API is temporarily unavailable. Please try again in a few moments.");
      setIsLoading(false);
    } else if (response?.data?.data?.products) {
      setCartItems(response.data.data.products);
      setError(null);
      setIsLoading(false);
    } else {
      setError("Failed to load cart. Please try again.");
      setIsLoading(false);
    }
  }

  /**
   * Remove a specific product from the cart
   * @param {string} productId - The ID of the product to remove
   */
  async function removeProduct(productId) {
    let response = await removeCartItem(productId);
    setCartItems(response?.data?.data?.products);
  }

  /**
   * Update the quantity of a product in the cart
   * @param {string} productId - The ID of the product to update
   * @param {number} count - The new quantity
   */
  async function updateCartProduct(productId, count) {
    let response = await updateProduct(productId, count);
    setCartItems(response?.data?.data?.products);
  }

  /**
   * Clear all items from the cart
   */
  async function ClearAllCart() {
    await ClearCart();
    setCartItems([]);
  }

  // ============ EFFECTS ============
  /**
   * Fetch cart items on component mount
   */
  // Fetch cart items on mount. Defer call to avoid synchronous setState in effect.
  useEffect(() => {
    const t = setTimeout(() => {
      getAllCart();
    }, 0);
    return () => clearTimeout(t);
  }, []);

  // ============ RENDER ============
  return (
    <>
      <div className="mx-auto min-h-screen flex items-center justify-center px-2">
        {/* Show loader while fetching data */}
        {isLoading ? (
          <Loader />
        ) : error ? (
          /* Show error message if API fails */
          <div className="container mx-auto p-6 bg-red-50 border border-red-200 rounded-lg max-w-2xl">
            <h2 className="text-xl font-bold text-red-700 mb-3">⚠️ Error Loading Cart</h2>
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={() => {
                setIsLoading(true);
                getAllCart();
              }}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
            >
              Try Again
            </button>
          </div>
        ) : (
          <div className="relative container mx-auto p-3 sm:p-4 md:p-6 bg-white rounded-xl shadow-lg border border-gray-200 max-w-7xl">
            {/* Header: Title and Clear Cart Button */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg sm:text-xl font-bold">Your Cart</h2>
              <button
                onClick={() => ClearAllCart()}
                className="bg-red-700 text-white px-3 py-2 rounded-xl cursor-pointer hover:bg-red-800 transition-all duration-300 text-sm sm:text-base"
              >
                Clear Cart
              </button>
            </div>

            {/* ====== MOBILE VIEW ====== */}
            {/* Card-based layout for mobile devices */}
            <div className="block md:hidden space-y-4">
              {(cartItems ?? []).length === 0 ? (
                <p className="text-center py-8 text-gray-500">
                  Your cart is empty
                </p>
              ) : (
                (cartItems ?? []).map((item) => (
                  <div
                    key={item.product.id}
                    className="border rounded-lg p-4 bg-gray-50 flex flex-col gap-3"
                  >
                    {/* Product Image and Info */}
                    <div className="flex gap-3">
                      <img
                        src={item.product.imageCover}
                        className="w-20 h-20 object-cover rounded-lg shrink-0"
                        alt={item.product.title}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm line-clamp-2">
                          {item.product.title}
                        </p>
                        <p className="text-gray-600 text-sm">
                          {item.price} EGP
                        </p>
                      </div>
                    </div>

                    {/* Quantity and Remove Button */}
                    <div className="flex items-center justify-between">
                      {/* Quantity Controls */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() =>
                            updateCartProduct(item.product.id, item.count - 1)
                          }
                          type="button"
                          className="flex items-center justify-center bg-gray-200 hover:bg-gray-300 rounded-full h-8 w-8 text-sm"
                        >
                          −
                        </button>
                        <span className="w-8 text-center font-medium">
                          {item.count}
                        </span>
                        <button
                          onClick={() =>
                            updateCartProduct(item.product.id, item.count + 1)
                          }
                          type="button"
                          className="flex items-center justify-center bg-gray-200 hover:bg-gray-300 rounded-full h-8 w-8 text-sm"
                        >
                          +
                        </button>
                      </div>

                      {/* Price and Remove */}
                      <div className="flex flex-col items-end gap-1">
                        <span className="font-semibold">
                          {item.price * item.count} EGP
                        </span>
                        <button
                          onClick={() => removeProduct(item.product.id)}
                          className="text-red-600 text-sm hover:underline"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* ====== DESKTOP VIEW ====== */}
            {/* Table-based layout for desktop and larger screens */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-sm text-left rtl:text-right text-body">
                {/* Table Header */}
                <thead className="text-sm text-body bg-neutral-secondary-medium border-b border-default-medium">
                  <tr>
                    <th scope="col" className="px-4 lg:px-6 py-3">
                      <span className="sr-only">Image</span>
                    </th>
                    <th scope="col" className="px-4 lg:px-6 py-3 font-medium">
                      Product
                    </th>
                    <th scope="col" className="px-4 lg:px-6 py-3 font-medium">
                      Qty
                    </th>
                    <th scope="col" className="px-4 lg:px-6 py-3 font-medium">
                      Price
                    </th>
                    <th scope="col" className="px-4 lg:px-6 py-3 font-medium">
                      Total
                    </th>
                    <th scope="col" className="px-4 lg:px-6 py-3 font-medium">
                      Action
                    </th>
                  </tr>
                </thead>

                {/* Table Body */}
                <tbody>
                  {(cartItems ?? []).length === 0 ? (
                    <tr>
                      <td
                        colSpan={6}
                        className="px-6 py-12 text-center text-gray-500"
                      >
                        Your cart is empty
                      </td>
                    </tr>
                  ) : (
                    (cartItems ?? []).map((item) => (
                      <tr
                        key={item.product.id}
                        className="bg-neutral-primary-soft border-b border-default hover:bg-neutral-secondary-medium"
                      >
                        {/* Product Image */}
                        <td className="p-3 lg:p-4">
                          <img
                            src={item.product.imageCover}
                            className="w-14 h-14 lg:w-20 lg:h-20 object-cover rounded"
                            alt={item.product.title}
                          />
                        </td>

                        {/* Product Name */}
                        <td className="px-4 lg:px-6 py-4 font-semibold text-heading max-w-50">
                          {item.product.title}
                        </td>

                        {/* Quantity Controls */}
                        <td className="px-4 lg:px-6 py-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() =>
                                updateCartProduct(
                                  item.product.id,
                                  item.count - 1,
                                )
                              }
                              type="button"
                              className="flex items-center justify-center bg-gray-200 hover:bg-gray-300 rounded-full h-7 w-7 text-sm"
                            >
                              −
                            </button>
                            <span className="w-6 text-center">
                              {item.count}
                            </span>
                            <button
                              onClick={() =>
                                updateCartProduct(
                                  item.product.id,
                                  item.count + 1,
                                )
                              }
                              type="button"
                              className="flex items-center justify-center bg-gray-200 hover:bg-gray-300 rounded-full h-7 w-7 text-sm"
                            >
                              +
                            </button>
                          </div>
                        </td>

                        {/* Unit Price */}
                        <td className="px-4 lg:px-6 py-4 font-semibold">
                          {item.price} EGP
                        </td>

                        {/* Total Price */}
                        <td className="px-4 lg:px-6 py-4 font-semibold">
                          {item.price * item.count} EGP
                        </td>

                        {/* Remove Button */}
                        <td className="px-4 lg:px-6 py-4">
                          <button
                            onClick={() => removeProduct(item.product.id)}
                            className="font-medium text-red-600 hover:underline cursor-pointer"
                          >
                            Remove
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* ====== CART FOOTER ====== */}
            {/* Display total amount and payment options dropdown */}
            <div className="mt-4 p-4 bg-gray-100 rounded-lg flex justify-between items-center">
              <span className="text-lg font-bold">Total Amount</span>
              <span className="text-xl font-bold">{totalCartAmount} EGP</span>
              
              {/* Payment Method Dropdown Menu */}
              <Dropdown label="Payment Options" color="blue">
                <DropdownItem
                    onClick={() => {
                      navigate("/checkout", { state: { paymentMethod: "cash On Delivery" } });
                    }}
                  >
                  💵 Cash
                </DropdownItem>
                <DropdownItem
                    onClick={() => {
                      navigate("/checkout", { state: { paymentMethod: "credit card" } });
                    }}
                  >
                  💳 Credit Card
                </DropdownItem>
              </Dropdown>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
