import React, { useCallback, useEffect, useState } from "react";
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

  async function addProductToCart(productId) {
    if (!localStorage.getItem("userToken")) {
      navigate("/login");
      return;
    }
    await addToCart(productId);
  }

  async function toggleWishlist(productId) {
    if (!localStorage.getItem("userToken")) {
      navigate("/register");
      return;
    }

    const response = await addToWishlist(productId);
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
  }

  const [relatedProducts, setRelatedProducts] = useState([]);
  const [ProductDetails, setProductDetails] = useState({});
  const [isLoading, setIsLoading] = useState(true);

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

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  const Slider = Slick.default ?? Slick;

  return (
    <>
      {/* Product Details */}
      <div className="container mx-auto p-3 sm:p-4 ">
      {isLoading ? <Loader /> : null}
        
        <div className="flex  border rounded-lg shadow-lg  sm:p-6">
          <div className="w-1/2 lg:w-2/5 xl:w-1/4">
            <Slider {...settings}>
              {ProductDetails.images?.map((image, index) => (
                <div key={index}>
                  <img
                    src={image}
                    alt={`Product Image ${index + 1}`}
                    className="h-48 sm:h-64 object-cover rounded"
                  />
                </div>
              ))}
            </Slider>
          </div>

          <div className="w-full lg:flex-1">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-4">{ProductDetails.title}</h1>
            <p className="mb-4">{ProductDetails.description}</p>
            <p className="text-sm text-gray-500 mb-2">
              Category: {ProductDetails.category?.name}
            </p>
            <p className="text-xl font-semibold mb-4">
              {ProductDetails.price} EGP
            </p>
            <div className="flex items-center gap-3">
              <button onClick={() => addProductToCart(ProductDetails._id)} className="bg-black text-white px-4 py-2 rounded border border-black hover:bg-white hover:text-black cursor-pointer transition-colors">
                Add to Cart
              </button>
              <button
                onClick={() => toggleWishlist(ProductDetails._id)}
                className="border border-slate-300 text-slate-700 px-4 py-2 rounded hover:bg-slate-100 cursor-pointer"
              >
                <i className={`${wishlistIds.has(ProductDetails._id) ? "fa-solid text-rose-500" : "fa-regular"} fa-heart mr-2`}></i>
                Add to Wishlist
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 py-4">
          {relatedProducts?.map((product) => (
            <div
              key={product._id}
              className="border p-4 rounded-lg shadow-lg relative w-full max-w-sm mx-auto sm:mx-0"
              
            >
              <button
                onClick={() => toggleWishlist(product._id)}
                className="absolute top-6 right-6 z-10 h-8 w-8 rounded-full bg-white/95 border border-slate-200 shadow-sm text-slate-600 hover:text-rose-500 cursor-pointer"
                aria-label="Toggle wishlist"
              >
                <i className={`${wishlistIds.has(product._id) ? "fa-solid text-rose-500" : "fa-regular"} fa-heart`}></i>
              </button>

              <Link
                to={`/ProductDetails/${product._id}/${product.category.name}`}
              >
                <img
                  src={product.imageCover}
                  alt={product.title}
                  className="w-full h-40 object-cover mb-4 rounded"
                />
                <h2 className="text-lg font-semibold mb-2">
                  {product.title.substring(0, 10)}
                </h2>
                <p className="text-gray-600 mb-6">
                  {product.description.substring(0, 50)}...
                </p>
              </Link>
              <h2 className="text-lg font-semibold mb-6">
                {product.title.substring(0, 10)}
              </h2>
              <p className="text-blue-600 font-bold">{product.price} EGP</p>
              <div className="flex justify-between">
                <i className="fa fa-star text-amber-300 mb-6"></i>
                {product.ratingsAverage}
              </div>
              <button onClick={() => addProductToCart(product._id)} className="mt-4 bg-black text-white px-4 py-2 rounded border border-black hover:bg-white hover:text-black absolute bottom-4 cursor-pointer transition-colors">
                Add to Cart
              </button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
