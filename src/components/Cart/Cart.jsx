import { useCallback, useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Style from "./Cart.module.css";
import { CartContext } from "../Context/contexts";
import Loader from "../Loader/Loader";
import PaymentLogo from "../PaymentLogo/PaymentLogo";

const paymentMethods = [
  {
    value: "cash On Delivery",
    label: "Cash on delivery",
    icon: "fa-money-bill-wave",
  },
  {
    value: "credit card",
    label: "Credit card",
  },
  {
    value: "paypal",
    label: "PayPal",
  },
  {
    value: "klarna",
    label: "Klarna",
  },
];

function formatPrice(amount) {
  return Number(amount || 0).toLocaleString("en-EG", {
    maximumFractionDigits: 2,
  });
}

export default function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionError, setActionError] = useState(null);
  const [qtyLoadingId, setQtyLoadingId] = useState(null);
  const [removeLoadingId, setRemoveLoadingId] = useState(null);
  const [isClearing, setIsClearing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState(paymentMethods[0].value);

  const {
    getToCart,
    removeCartItem,
    updateProduct,
    ClearCart,
    totalCartAmount,
  } = useContext(CartContext);
  const navigate = useNavigate();

  const getAllCart = useCallback(async () => {
    try {
      const response = await getToCart();
      const products = response?.data?.data?.products;

      if (Array.isArray(products)) {
        setCartItems(products);
        setError(null);
      } else {
        setError(
          response?.status === 500 || response?.response?.status === 500
            ? "The service is temporarily unavailable. Please try again shortly."
            : "We couldn't load your cart. Please try again.",
        );
      }
    } catch {
      setError("We couldn't load your cart. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [getToCart]);

  useEffect(() => {
    const timeoutId = window.setTimeout(getAllCart, 0);
    return () => window.clearTimeout(timeoutId);
  }, [getAllCart]);

  async function updateCartProduct(productId, count) {
    setActionError(null);
    setQtyLoadingId(productId);
    try {
      const [response] = await Promise.all([
        updateProduct(productId, count),
        new Promise((resolve) => window.setTimeout(resolve, 350)),
      ]);
      const products = response?.data?.data?.products;
      if (Array.isArray(products)) {
        setCartItems(products);
      } else {
        setActionError("We couldn't update this item. Please try again.");
      }
    } catch {
      setActionError("We couldn't update this item. Please try again.");
    } finally {
      setQtyLoadingId(null);
    }
  }

  async function removeProduct(productId) {
    setActionError(null);
    setRemoveLoadingId(productId);
    try {
      const [response] = await Promise.all([
        removeCartItem(productId),
        new Promise((resolve) => window.setTimeout(resolve, 350)),
      ]);
      const products = response?.data?.data?.products;
      if (
        response?.status >= 200 &&
        response.status < 300 &&
        Array.isArray(products)
      ) {
        setCartItems(products);
      } else {
        setActionError("We couldn't remove this item. Please try again.");
      }
    } catch {
      setActionError("We couldn't remove this item. Please try again.");
    } finally {
      setRemoveLoadingId(null);
    }
  }

  async function clearCart() {
    setActionError(null);
    setIsClearing(true);
    try {
      const response = await ClearCart();
      if (response?.status >= 200 && response.status < 300) {
        setCartItems([]);
      } else {
        setActionError("We couldn't clear your cart. Please try again.");
      }
    } catch {
      setActionError("We couldn't clear your cart. Please try again.");
    } finally {
      setIsClearing(false);
    }
  }

  function retryLoadingCart() {
    setIsLoading(true);
    setError(null);
    getAllCart();
  }

  if (isLoading) {
    return (
      <div className={Style.loading}>
        <Loader />
      </div>
    );
  }

  if (error) {
    return (
      <section className={Style.errorState} role="alert">
        <span className={Style.stateIcon}>
          <i className="fa-solid fa-triangle-exclamation" aria-hidden="true" />
        </span>
        <p className={Style.eyebrow}>Something went wrong</p>
        <h1 className={Style.stateTitle}>Your cart didn’t load</h1>
        <p className={Style.stateText}>{error}</p>
        <button className={Style.primaryButton} onClick={retryLoadingCart} type="button">
          Try again
        </button>
      </section>
    );
  }

  const itemCount = cartItems.reduce((count, item) => count + item.count, 0);

  return (
    <div className={Style.page}>
      <div className={Style.breadcrumbs} aria-label="Breadcrumb">
        <Link to="/">Home</Link>
        <i className="fa-solid fa-chevron-right" aria-hidden="true" />
        <span aria-current="page">Shopping bag</span>
      </div>

      <header className={Style.header}>
        <div>
          <p className={Style.eyebrow}>A little something for you</p>
          <h1 className={Style.title}>Your shopping bag</h1>
          <p className={Style.subtitle}>
            {itemCount === 0
              ? "Your next favourite thing is just around the corner."
              : `${itemCount} ${itemCount === 1 ? "item" : "items"} picked just for you.`}
          </p>
        </div>
        {cartItems.length > 0 ? (
          <button
            className={Style.clearButton}
            disabled={isClearing}
            onClick={clearCart}
            type="button"
          >
            {isClearing ? (
              <i className="fa-solid fa-spinner fa-spin" aria-hidden="true" />
            ) : (
              <i className="fa-regular fa-trash-can" aria-hidden="true" />
            )}
            Clear bag
          </button>
        ) : null}
      </header>

      {actionError ? (
        <p className={Style.actionError} role="alert">
          <i className="fa-solid fa-circle-exclamation" aria-hidden="true" />
          {actionError}
        </p>
      ) : null}

      {cartItems.length === 0 ? (
        <section className={Style.emptyState}>
          <span className={Style.stateIcon}>
            <i className="fa-solid fa-bag-shopping" aria-hidden="true" />
          </span>
          <p className={Style.eyebrow}>Nothing in here (yet)</p>
          <h2 className={Style.stateTitle}>Your bag is taking a breather</h2>
          <p className={Style.stateText}>
            Explore the collection and find something you’ll love.
          </p>
          <Link className={Style.primaryButton} to="/Products">
            Explore the collection
            <i className="fa-solid fa-arrow-right" aria-hidden="true" />
          </Link>
        </section>
      ) : (
        <div className={Style.content}>
          <section className={Style.items} aria-label="Items in your bag">
            {cartItems.map((item) => {
              const productId = item.product.id;
              const isUpdating = qtyLoadingId === productId;
              const isRemoving = removeLoadingId === productId;

              return (
                <article className={Style.item} key={productId}>
                  <div className={Style.product}>
                    <img
                      className={Style.productImage}
                      src={item.product.imageCover}
                      alt={item.product.title}
                    />
                    <div className={Style.productInfo}>
                      <h2 className={Style.productTitle}>{item.product.title}</h2>
                      <p className={Style.unitPrice}>
                        {formatPrice(item.price)} EGP <span>each</span>
                      </p>
                      <button
                        aria-label={`Remove ${item.product.title} from your cart`}
                        className={Style.removeButton}
                        disabled={isRemoving || isUpdating || isClearing}
                        onClick={() => removeProduct(productId)}
                        type="button"
                      >
                        {isRemoving ? (
                          <>
                            <i className="fa-solid fa-spinner fa-spin" aria-hidden="true" />
                            Removing item…
                          </>
                        ) : (
                          <>
                            <i className="fa-regular fa-trash-can" aria-hidden="true" />
                            Remove item
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  <div className={Style.itemControls}>
                    <div
                      aria-label={`Quantity of ${item.product.title}`}
                      className={Style.quantity}
                      role="group"
                    >
                      <button
                        aria-label={`Decrease quantity of ${item.product.title}`}
                        disabled={isUpdating || isRemoving || isClearing || item.count <= 1}
                        onClick={() => updateCartProduct(productId, item.count - 1)}
                        type="button"
                      >
                        <i className="fa-solid fa-minus" aria-hidden="true" />
                      </button>
                      <span aria-live="polite">
                        {isUpdating ? (
                          <i className="fa-solid fa-spinner fa-spin" aria-label="Updating" />
                        ) : (
                          item.count
                        )}
                      </span>
                      <button
                        aria-label={`Increase quantity of ${item.product.title}`}
                        disabled={isUpdating || isRemoving || isClearing}
                        onClick={() => updateCartProduct(productId, item.count + 1)}
                        type="button"
                      >
                        <i className="fa-solid fa-plus" aria-hidden="true" />
                      </button>
                    </div>
                    <p className={Style.lineTotal}>
                      {formatPrice(item.price * item.count)} <span>EGP</span>
                    </p>
                  </div>
                </article>
              );
            })}
            <Link className={Style.continueLink} to="/Products">
              <i className="fa-solid fa-arrow-left" aria-hidden="true" />
              Continue shopping
            </Link>
          </section>

          <aside className={Style.summary}>
            <p className={Style.eyebrow}>The details</p>
            <h2 className={Style.summaryTitle}>Order summary</h2>

            <div className={Style.summaryRow}>
              <span>Subtotal <span className={Style.muted}>({itemCount} items)</span></span>
              <span>{formatPrice(totalCartAmount)} EGP</span>
            </div>
            <div className={Style.summaryDivider} />
            <div className={`${Style.summaryRow} ${Style.totalRow}`}>
              <span>Total</span>
              <span>{formatPrice(totalCartAmount)} <small>EGP</small></span>
            </div>
            <p className={Style.taxNote}>Delivery details are added at checkout.</p>

            <fieldset className={Style.paymentOptions}>
              <legend>Choose how to pay</legend>
              {paymentMethods.map((method) => (
                <button
                  aria-pressed={paymentMethod === method.value}
                  className={`${Style.paymentOption} ${
                    paymentMethod === method.value ? Style.paymentSelected : ""
                  }`}
                  key={method.value}
                  onClick={() => setPaymentMethod(method.value)}
                  type="button"
                >
                  {method.value === "credit card" ? (
                    <PaymentLogo method="mastercard" />
                  ) : method.icon ? (
                    <i className={`fa-solid ${method.icon}`} aria-hidden="true" />
                  ) : (
                    <PaymentLogo method={method.value} />
                  )}
                  {method.value !== "klarna" ? <span>{method.label}</span> : null}
                  <span className={Style.radio}>
                    {paymentMethod === method.value ? (
                      <i className="fa-solid fa-check" aria-hidden="true" />
                    ) : null}
                  </span>
                </button>
              ))}
            </fieldset>

            <button
              className={`${Style.primaryButton} ${Style.checkoutButton}`}
              onClick={() =>
                navigate("/checkout", { state: { paymentMethod } })
              }
              type="button"
            >
              Continue to checkout
              <i className="fa-solid fa-arrow-right" aria-hidden="true" />
            </button>

            <p className={Style.secureNote}>
              <i className="fa-solid fa-lock" aria-hidden="true" />
              Secure checkout
            </p>
          </aside>
        </div>
      )}
    </div>
  );
}
