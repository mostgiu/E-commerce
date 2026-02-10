import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Slick from "react-slick";
import Loader from "../Loader/Loader";
import { Link } from "react-router-dom";
import { CartContext } from "../Context/contexts";
import {useContext} from "react";
export default function ProductDetails() {
  const { id, categoryName } = useParams();
  let { addToCart } = useContext(CartContext);
  async function addProductToCart(productId) {
    await addToCart(productId);
  }

  const [relatedProducts, setRelatedProducts] = useState([]);
  const [ProductDetails, setProductDetails] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  async function fetchProductDetails() {
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
  }

  async function fetchRelated() {
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
  }

  useEffect(() => {
    fetchProductDetails();
    fetchRelated();
  }, [id]);

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
            <button onClick={() => addProductToCart(ProductDetails._id)} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 cursor-pointer">
              Add to Cart
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 py-4">
          {relatedProducts?.map((product) => (
            <div
              key={product._id}
              className="border p-4 rounded-lg shadow-lg relative w-full max-w-sm mx-auto sm:mx-0"
              
            >
              <Link
                to={`/ProductDetails/${product._id} /${product.category.name}`}
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
              <p className="text-blue-600 font-bold">${product.price}</p>
              <div className="flex justify-between">
                <i className="fa fa-star text-amber-300 mb-6"></i>
                {product.ratingsAverage}
              </div>
              <button onClick={() => addProductToCart(product._id)} className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 absolute bottom-4">
                Add to Cart
              </button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
