import axios from "axios";
import toast from "react-hot-toast";
import { useState } from "react";
import { CartContext } from "./contexts";

export default function CartContextProvider(props) {
  const [noOfCartItems, setNoOfCartItems] = useState(null);
  const [totalCartAmount, setTotalcartAmount] = useState(0);
  const [cartId, setCartId] = useState(null); // Store cart ID for checkout
  
  // Function to get fresh headers with current token
  const getHeaders = () => ({
    token: localStorage.getItem("userToken"),
  });

  async function getToCart() {
    const headers = getHeaders();
    if (!headers.token) {
      console.error("❌ Error: No authentication token. User not logged in.");
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
        return error;
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
        return error;
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
        return error;
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
        return error;
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
        return error;
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
        return error;
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
        return error;
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
        cashPayment
      }}
    >
      {props.children}
    </CartContext.Provider>
  );
}
