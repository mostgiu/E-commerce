import React, { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Slick from "react-slick";
import Loader from "../Loader/Loader";
import { Link } from "react-router-dom";
import { CartContext } from "../Context/contexts";
import {useContext} from "react";
export default function ProductDetails() {
  const { id, categoryName } = useParams();
  const navigate = useNavigate();
  let { addToCart, addToWishlist } = useContext(CartContext);
  const [wishlistIds, setWishlistIds] = useState(new Set());
  const [cartLoadingId, setCartLoadingId] = useState(null);
  const [wishlistLoadingId, setWishlistLoadingId] = useState(null);
  const minLoaderDelay = (ms = 500) => new Promise((resolve) => setTimeout(resolve, ms));

  async function addProductToCart(productId) {
    setCartLoadingId(productId);
    if (!localStorage.getItem("userToken")) {
      navigate("/login");
      setCartLoadingId(null);
      return;
    }
    try {
      await Promise.all([addToCart(productId), minLoaderDelay()]);
    } finally {
      setCartLoadingId(null);
    }
  }

  async function toggleWishlist(productId) {
    setWishlistLoadingId(productId);
    if (!localStorage.getItem("userToken")) {
      navigate("/register");
      setWishlistLoadingId(null);
      return;
    }

    try {
      const [response] = await Promise.all([addToWishlist(productId), minLoaderDelay()]);
      if (response?.status < 200 || response?.status >= 300) {
        return;
      }

      setWishlistIds((prev) => {
        const next = new Set(prev);
        if (next.has(productId)) {
          next.delete(productId);
        } else {
          next.add(productId);
        }
        return next;
      });
    } finally {
      setWishlistLoadingId(null);
    }
  }

  const [relatedProducts, setRelatedProducts] = useState([]);
  const [ProductDetails, setProductDetails] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const sliderRef = useRef(null);
  const productImages = ProductDetails.images?.length
    ? ProductDetails.images
    : ProductDetails.imageCover
      ? [ProductDetails.imageCover]
      : [];

  const fetchProductDetails = useCallback(async () => {
    return await axios
      .get(`https://ecommerce.routemisr.com/api/v1/products/${id}`)
      .then((res) => {
        setProductDetails(res.data.data);
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [id]);

  const fetchRelated = useCallback(async () => {
    return await axios
      .get(`https://ecommerce.routemisr.com/api/v1/products`)
      .then((res) => {
        let relatedProducts = res.data.data;
        relatedProducts = relatedProducts.filter(
          (product) => product.category.name == categoryName,
        );
        setRelatedProducts(relatedProducts);
      }).catch((error) => {
        console.error(error);
      })

      .finally(() => {
        setIsLoading(false);
      });
  }, [categoryName]);

  useEffect(() => {
    fetchProductDetails();
    fetchRelated();
  }, [fetchProductDetails, fetchRelated]);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    setActiveImageIndex(0);
  }, [id]);

  function SliderArrow({ direction, onClick }) {
    return (
      <button
        type="button"
        onClick={onClick}
        aria-label={`${direction === "next" ? "Next" : "Previous"} product image`}
        className={`absolute ${direction === "next" ? "right-3" : "left-3"} top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-[var(--line)] bg-[var(--bg-elevated)] text-[var(--text)] shadow-[0_8px_20px_rgba(0,0,0,0.08)] backdrop-blur-md transition hover:border-[var(--text)] hover:bg-[var(--bg)]`}
      >
        <i className={`fa-solid fa-chevron-${direction === "next" ? "right" : "left"}`} />
      </button>
    );
  }

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: true,
    prevArrow: <SliderArrow direction="previous" />,
    nextArrow: <SliderArrow direction="next" />,
    beforeChange: (_current, next) => setActiveImageIndex(next),
  };

  const Slider = Slick.default ?? Slick;

  return (
    <>
      {/* Product Details */}
      <div className="container mx-auto max-w-7xl p-3 sm:p-4">
      {isLoading ? <Loader /> : null}

        <div className="grid grid-cols-1 overflow-hidden rounded-[28px] border border-[var(--line)] bg-[var(--panel)] shadow-[0_12px_30px_rgba(0,0,0,0.04)] md:grid-cols-2 sm:p-6 lg:gap-8 lg:p-8 xl:gap-10">
          <div className="w-full min-w-0">
            <div className="flex flex-col gap-3 md:flex-row md:gap-4">
              <div className="order-1 min-w-0 overflow-hidden border border-[var(--line)] bg-[var(--bg-elevated)] p-2 sm:p-3 md:flex-1">
                <Slider ref={sliderRef} {...settings}>
                  {productImages.map((image, index) => (
                    <div key={`${image}-${index}`} className="px-0.5 pb-5">
                      <img
                        src={image}
                        alt={`${ProductDetails.title || "Product"} image ${index + 1}`}
                        className="aspect-[4/3] w-full rounded-xl object-contain object-center"
                      />
                    </div>
                  ))}
                </Slider>
              </div>
              {productImages.length > 1 ? (
                <div
                  aria-label="Product image thumbnails"
                  className="order-2 flex max-w-full gap-2 overflow-x-auto pb-1 md:max-h-[30rem] md:w-[76px] md:flex-none md:flex-col md:overflow-x-hidden md:overflow-y-auto md:pb-0"
                >
                  {productImages.map((image, index) => (
                    <button
                      key={`${image}-${index}`}
                      type="button"
                      onClick={() => sliderRef.current?.slickGoTo(index)}
                      aria-label={`Show product image ${index + 1}`}
                      aria-pressed={activeImageIndex === index}
                      className={`h-16 w-16 shrink-0 overflow-hidden border bg-[var(--bg-elevated)] p-1 transition sm:h-20 sm:w-20 md:h-auto md:w-full md:aspect-square ${
                        activeImageIndex === index
                          ? "border-[var(--text)]"
                          : "border-[var(--line)] hover:border-[var(--muted)]"
                      }`}
                    >
                      <img
                        src={image}
                        alt=""
                        className="h-full w-full object-contain"
                      />
                    </button>
                  ))}
                </div>
              ) : null}
            </div>
          </div>

          <div className="w-full min-w-0 flex flex-col justify-center p-4 sm:p-6 lg:py-8">
            <h1 className="mb-4 text-center text-2xl font-bold text-[var(--text)] sm:text-3xl lg:text-left">{ProductDetails.title}</h1>
            <p className="mb-4 text-center text-sm leading-6 text-[var(--muted)] sm:text-base lg:text-left">{ProductDetails.description}</p>
            <p className="mb-2 text-center text-sm text-[var(--muted)] lg:text-left">
              Category: {ProductDetails.category?.name}
            </p>
            <p className="mb-4 text-center text-2xl font-semibold text-[var(--accent-strong)] lg:text-left">
              {ProductDetails.price} EGP
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3">
              <button
                onClick={() => addProductToCart(ProductDetails._id)}
                disabled={cartLoadingId === ProductDetails._id}
                className="cursor-pointer border border-[var(--line)] bg-[var(--bg-elevated)] px-5 py-2.5 text-sm font-medium uppercase tracking-[0.18em] text-[var(--text)] transition hover:border-[var(--text)] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {cartLoadingId === ProductDetails._id ? (
                  <span className="inline-flex items-center gap-2">
                    <i className="fa fa-spinner fa-spin"></i>
                    Adding...
                  </span>
                ) : (
                  "Add to Cart"
                )}
              </button>
              <button
                onClick={() => toggleWishlist(ProductDetails._id)}
                disabled={wishlistLoadingId === ProductDetails._id}
                className="cursor-pointer rounded-full border border-[var(--line)] bg-[var(--panel-strong)] px-5 py-2.5 text-sm text-[var(--text)] transition hover:border-[var(--accent)] hover:text-[var(--accent)] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {wishlistLoadingId === ProductDetails._id ? (
                  <span className="inline-flex items-center gap-2">
                    <i className="fa fa-spinner fa-spin"></i>
                    Adding...
                  </span>
                ) : (
                  <>
                    <i className={`${wishlistIds.has(ProductDetails._id) ? "fa-solid text-rose-500" : "fa-regular"} fa-heart mr-2`}></i>
                    Add to Wishlist
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 py-4">
          {relatedProducts?.map((product) => (
            <div
              key={product._id}
              className="relative mx-auto w-full max-w-sm rounded-xl border border-[var(--line)] bg-[var(--panel-strong)] p-3 text-[var(--text)] shadow-[var(--shadow)] sm:mx-0"
            >
              <button
                onClick={() => toggleWishlist(product._id)}
                disabled={wishlistLoadingId === product._id}
                className="absolute right-4 top-4 z-10 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-[var(--line)] bg-[var(--panel)] text-[var(--text)] shadow-sm hover:text-[#ff9bb3]"
                aria-label="Toggle wishlist"
              >
                {wishlistLoadingId === product._id ? (
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-[var(--panel-strong)] text-[var(--text)]">
                    <i className="fa fa-spinner fa-spin text-xs"></i>
                  </span>
                ) : (
                  <i className={`${wishlistIds.has(product._id) ? "fa-solid text-rose-500" : "fa-regular"} fa-heart`}></i>
                )}
              </button>

              <Link
                to={`/ProductDetails/${product._id}/${product.category.name}`}
              >
                <img
                  src={product.imageCover}
                  alt={product.title}
                  className="w-full h-40 object-cover mb-4 rounded"
                />
                <h2 className="mb-2 text-base font-semibold text-[var(--text)]">
                  {product.title.substring(0, 10)}
                </h2>
                <p className="mb-4 text-sm text-[var(--muted)]">
                  {product.description.substring(0, 50)}...
                </p>
              </Link>
              <p className="mb-3 text-lg font-bold text-[var(--accent-strong)]">{product.price} EGP</p>
              <div className="mb-12 flex justify-between text-sm text-[var(--muted)]">
                <i className="fa fa-star text-amber-300 mb-6"></i>
                {product.ratingsAverage}
              </div>
              <button
                onClick={() => addProductToCart(product._id)}
                disabled={cartLoadingId === product._id}
                className="absolute bottom-3 left-3 right-3 mt-4 cursor-pointer border border-[var(--line)] bg-[var(--bg-elevated)] px-4 py-2 text-sm font-medium uppercase tracking-[0.18em] text-[var(--text)] transition hover:border-[var(--text)] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {cartLoadingId === product._id ? (
                  <span className="inline-flex items-center gap-2">
                    <i className="fa fa-spinner fa-spin"></i>
                    Adding...
                  </span>
                ) : (
                  "Add to Cart"
                )}
              </button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
