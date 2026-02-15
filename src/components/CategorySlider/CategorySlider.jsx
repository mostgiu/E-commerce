import { useQuery } from "@tanstack/react-query";
import Slick from "react-slick";
import axios from "axios";
import { Link } from "react-router-dom";

export default function CategorySlider() {
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 7,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 1500,
    responsive: [
      { breakpoint: 1280, settings: { slidesToShow: 5 } },
      { breakpoint: 1024, settings: { slidesToShow: 4 } },
      { breakpoint: 640, settings: { slidesToShow: 3 } },
      { breakpoint: 480, settings: { slidesToShow: 2 } },
    ]
  };
const Slider = Slick.default ?? Slick;
  function getCatslider() {
    return axios.get(
      "https://ecommerce.routemisr.com/api/v1/categories"
    );
  }

  const { data, isLoading } = useQuery({
    queryKey: ["categoriesSlider"],
    queryFn: getCatslider,
    staleTime: 1000 * 60 * 5,
  });

  if (isLoading) return null;

  return (
    <div className="px-0 mb-1">
      <Slider {...settings}>
        {data.data.data.map((cat) => (
          <div key={cat._id} className="px-1.5 sm:px-2.5 h-49">
            <Link
              to={`/categories/${cat._id}`}
              state={{ categoryName: cat.name }}
              className="flex h-full flex-col bg-slate-50 border border-slate-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
            >
              <img
                src={cat.image}
                alt={cat.name}
                className="w-full h-36 shrink-0 object-cover object-center"
              />
              <p className="h-14 px-2 flex items-center justify-center text-center text-sm font-medium text-slate-700 leading-tight line-clamp-2">
                {cat.name}
              </p>
            </Link>
          </div>
        ))}
      </Slider>
    </div>
  );
}
