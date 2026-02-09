import { useQuery } from "@tanstack/react-query";
import Slick from "react-slick";
import axios from "axios";

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
  });

  if (isLoading) return null;

  return (
    <div className="px-2 sm:px-4 mb-6">
      <Slider {...settings}>
        {data.data.data.map((cat) => (
          <div key={cat._id} className="px-1 sm:px-2">
            <img
              src={cat.image}
              alt={cat.name}
              className="w-full h-24 sm:h-32 md:h-40 object-cover rounded-lg"
            />
          </div>
        ))}
      </Slider>
    </div>
  );
}
