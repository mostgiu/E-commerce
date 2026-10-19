import Slick from "react-slick";
import { Link } from "react-router-dom";
import maincarusel1 from "../../assets/maincarusel-1.jpg";
import maincarusel2 from "../../assets/maincarusel-2.jpg";
import maincarusel3 from "../../assets/maincarusel-3.jpg";
import mainSlider4 from "../../assets/mainSlider-4.jpg";
import Style from "./MainSlider.module.css";

const slides = [
  {
    image: maincarusel2,
    eyebrow: "The new edit",
    title: "Modern essentials",
    description: "Easy layers, made for every day.",
  },
  {
    image: maincarusel3,
    eyebrow: "Find your look",
    title: "A fresh perspective",
    description: "Pieces that feel like you.",
  },
  {
    image: maincarusel1,
    eyebrow: "Smart living",
    title: "Tech worth a closer look",
    description: "Little upgrades. Big difference.",
  },
  {
    image: mainSlider4,
    eyebrow: "Make some noise",
    title: "Find your rhythm",
    description: "Explore the things you love.",
  },
];

export default function MainSlider() {
  const Slider = Slick.default ?? Slick;
  const settings = {
    dots: true,
    arrows: false,
    infinite: true,
    speed: 650,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2400,
    cssEase: "cubic-bezier(0.22, 1, 0.36, 1)",
    pauseOnHover: true,
    pauseOnFocus: true,
    swipeToSlide: true,
    responsive: [
      { breakpoint: 900, settings: { slidesToShow: 2 } },
      { breakpoint: 560, settings: { slidesToShow: 1 } },
    ],
  };

  return (
    <div className={Style.slider}>
      <Slider {...settings}>
        {slides.map((slide) => (
          <div className={Style.slide} key={slide.title}>
            <Link className={Style.card} to="/Products">
              <img className={Style.image} src={slide.image} alt="" />
              <span className={Style.shade} aria-hidden="true" />
              <span className={Style.copy}>
                <span className={Style.eyebrow}>{slide.eyebrow}</span>
                <span className={Style.title}>{slide.title}</span>
                <span className={Style.description}>{slide.description}</span>
                <span className={Style.cta}>
                  Discover
                  <i className="fa-solid fa-arrow-right" aria-hidden="true" />
                </span>
              </span>
            </Link>
          </div>
        ))}
      </Slider>
    </div>
  );
}
