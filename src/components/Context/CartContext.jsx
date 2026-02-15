import axios from "axios";
import toast from "react-hot-toast";
import { useState } from "react";
import { CartContext } from "./contexts";

export default function CartContextProvider(props) {
  const [noOfCartItems, setNoOfCartItems] = useState(null);
  const [totalCartAmount, setTotalcartAmount] = useState(0);
  const [cartId, setCartId] = useState(null); // Store cart ID for checkout
  const [wishlistCount, setWishlistCount] = useState(0);

  function clearCartState() {
    setNoOfCartItems(0);
    setTotalcartAmount(0);
    setCartId(null);
    setWishlistCount(0);
  }
  
  // Function to get fresh headers with current token
  const getHeaders = () => ({
    token: localStorage.getItem("userToken"),
  });

  function handleApiError(error, fallbackMessage, shouldClearOn401 = false) {
    const status = error?.response?.status;
    const apiMessage = error?.response?.data?.message;

    if (shouldClearOn401 && status === 401) {
      clearCartState();
    }

    if (status === 500) {
      toast.error("Service is temporarily unavailable. Please try again.", { duration: 1800 });
    } else if (status && status !== 401) {
      toast.error(apiMessage || fallbackMessage, { duration: 1500 });
    }

    return error?.response || error;
  }

  async function getToCart() {
    const headers = getHeaders();
    if (!headers.token) {
      clearCartState();
      return { 
        status: 401, 
        data: { error: "Please login first" } 
      };
    }
    return await axios
      .get("https://ecommerce.routemisr.com/api/v1/cart", {
        headers: headers,
      })
      .then((response) => {
        setNoOfCartItems(response.data.numOfCartItems);
        setTotalcartAmount(response.data.data.totalCartPrice);
        setCartId(response.data.data._id); // Store the cart ID

        return response;
      })
      .catch((error) => {
        console.error("❌ Cart API Error:", error.response?.status, error.response?.data);
        return handleApiError(error, "Failed to load cart", true);
      });
  }
  async function addToCart(productId) {
    const headers = getHeaders();
    return await axios
      .post(
        "https://ecommerce.routemisr.com/api/v1/cart",
        { productId },
        {
          headers: headers,
        },
      )
      .then((response) => {
        toast.success(response.data.message, { duration: 1000 });
        setNoOfCartItems(response.data.numOfCartItems);
        setTotalcartAmount(response.data.data.totalCartPrice);
        return response;
      })
      .catch((error) => {
        console.error("❌ Add To Cart Error:", error.response?.status, error.response?.data);
        return handleApiError(error, "Failed to add product to cart");
      });
  }

  /* remove item from cart */

  async function removeCartItem(productId) {
    const headers = getHeaders();
    return await axios
      .delete(`https://ecommerce.routemisr.com/api/v1/cart/${productId}`, {
        headers: headers,
      })
      .then((response) => {
        toast.success(response.data.message, { duration: 1000 });
        setNoOfCartItems(response.data.numOfCartItems);
        setTotalcartAmount(response.data.data.totalCartPrice);

        return response;
      })
      .catch((error) => {
        console.error("❌ Remove Cart Item Error:", error.response?.status, error.response?.data);
        return handleApiError(error, "Failed to remove cart item");
      });
  }

  /* update Producy */

  async function updateProduct(productId, count) {
    const headers = getHeaders();
    return await axios
      .put(
        `https://ecommerce.routemisr.com/api/v1/cart/${productId}`,
        {
          count,
        },
        {
          headers: headers,
        },
      )
      .then((response) => {
        toast.success(response.data.message, { duration: 1000 });
        setNoOfCartItems(response.data.numOfCartItems);
        setTotalcartAmount(response.data.data.totalCartPrice);

        return response;
      })
      .catch((error) => {
        console.error("❌ Update Product Error:", error.response?.status, error.response?.data);
        return handleApiError(error, "Failed to update cart item");
      });
  }

  /* Clear Cart Function */
  async function ClearCart() {
    const headers = getHeaders();
    return await axios
      .delete("https://ecommerce.routemisr.com/api/v1/cart", {
        headers: headers,
      })
      .then((response) => {
        toast.success(response.data.message, { duration: 1000 });
        setNoOfCartItems(0);
        setTotalcartAmount(0);
        return response;
      })
      .catch((error) => {
        console.error("❌ Clear Cart Error:", error.response?.status, error.response?.data);
        return handleApiError(error, "Failed to clear cart");
      });
  }

  async function onlinePayment(shippingDetails) {
    const headers = getHeaders();
    if (!cartId) {
      console.error("❌ Error: No cart ID found. Cannot proceed with payment.");
      return { status: 400, data: { error: "No cart found" } };
    }
    const redirectUrl = window.location.origin;
    return await axios
      .post(`https://ecommerce.routemisr.com/api/v1/orders/checkout-session/${cartId}?url=${redirectUrl}`, { shippingDetails }, { headers })
      .then((response) => {
        console.log(response.data.session.url);
        window.location.href = response.data.session.url;
        return response;
      })
      .catch((error) => {
        console.error("❌ Online Payment Error:", error.response?.status, error.response?.data);
        return handleApiError(error, "Online payment failed");
      });
  }

  async function cashPayment(shippingDetails) {
    const headers = getHeaders();
    if (!cartId) {
      console.error("❌ Error: No cart ID found. Cannot proceed with payment.");
      return { status: 400, data: { error: "No cart found" } };
    }
    return await axios
      .post(`https://ecommerce.routemisr.com/api/v1/orders/${cartId}`, { shippingDetails }, { headers })
      .then((response) => {
        return response;
      })
      .catch((error) => {
        console.error("❌ Cash Payment Error:", error.response?.status, error.response?.data);
        return handleApiError(error, "Cash payment failed");
      });
  }

  async function addToWishlist(productId) {
    const headers = getHeaders();
    if (!headers.token) {
      return { status: 401, data: { error: "Please login first" } };
    }

    return await axios
      .post(
        "https://ecommerce.routemisr.com/api/v1/wishlist",
        { productId },
        { headers: headers },
      )
      .then((response) => {
        toast.success(response.data.message || "Added to wishlist", { duration: 1000 });
        setWishlistCount(response.data?.data?.length || 0);
        return response;
      })
      .catch((error) => {
        console.error("❌ Add To Wishlist Error:", error.response?.status, error.response?.data);
        return handleApiError(error, "Failed to add item to wishlist");
      });
  }

  async function getWishlist() {
    const headers = getHeaders();
    if (!headers.token) {
      clearCartState();
      return { status: 401, data: { error: "Please login first" } };
    }

    return await axios
      .get("https://ecommerce.routemisr.com/api/v1/wishlist", {
        headers: headers,
      })
      .then((response) => {
        setWishlistCount(response.data?.count || response.data?.data?.length || 0);
        return response;
      })
      .catch((error) => {
        console.error("❌ Get Wishlist Error:", error.response?.status, error.response?.data);
        return handleApiError(error, "Failed to load wishlist", true);
      });
  }

  async function removeFromWishlist(productId) {
    const headers = getHeaders();
    if (!headers.token) {
      return { status: 401, data: { error: "Please login first" } };
    }

    return await axios
      .delete(`https://ecommerce.routemisr.com/api/v1/wishlist/${productId}`, {
        headers: headers,
      })
      .then((response) => {
        toast.success(response.data.message || "Removed from wishlist", { duration: 1000 });
        setWishlistCount(response.data?.data?.length || 0);
        return response;
      })
      .catch((error) => {
        console.error("❌ Remove From Wishlist Error:", error.response?.status, error.response?.data);
        return handleApiError(error, "Failed to remove item from wishlist");
      });
  }



  return (
    <CartContext.Provider
      value={{
        addToCart,
        getToCart,
        removeCartItem,
        updateProduct,
        ClearCart,
        noOfCartItems,
        totalCartAmount,
        cartId,
        onlinePayment,
        cashPayment,
        addToWishlist,
        removeFromWishlist,
        getWishlist,
        wishlistCount,
        clearCartState
      }}
    >
      {props.children}
    </CartContext.Provider>
  );
}
