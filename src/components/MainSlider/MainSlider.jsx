import React from "react";
import maincarusel1 from '../../assets/maincarusel-1.jpg'
import maincarusel2 from '../../assets/maincarusel-2.jpg'
import maincarusel3 from '../../assets/maincarusel-3.jpg'
import mainSlider4 from '../../assets/mainSlider-4.jpg'

import Slick from "react-slick";

export default function MainSlider() {
  const Slider = Slick.default ?? Slick;
  var settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 1 } },
      { breakpoint: 768, settings: { slidesToShow: 1 } },
    ]
  };
  const newSlidesModules = import.meta.glob("../../assets/components/*.{png,jpg,jpeg,webp,avif,svg}", {
    eager: true,
    import: "default",
  });

  const newSlides = Object.values(newSlidesModules);
  const fallbackSlides = [maincarusel1, maincarusel2, maincarusel3, mainSlider4];
  const slides = newSlides.length > 0 ? newSlides : fallbackSlides;

  return (
    <div className="rounded-2xl overflow-hidden shadow-lg border border-slate-200 bg-white">
      <Slider {...settings}>
        {slides.map((slide, index) => (
          <div key={index} className="px-0">
            <div className="relative">
              <img src={slide} alt={`slider-${index + 1}`} className="w-full h-52 sm:h-64 md:h-80 lg:h-96 object-cover" />
              <div className="absolute inset-0 bg-linear-to-r from-black/55 via-black/20 to-transparent"></div>
              <div className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 text-white max-w-xs sm:max-w-md">
                <p className="text-xs sm:text-sm uppercase tracking-[0.2em] text-slate-200 mb-2">New Season</p>
                <h2 className="text-lg sm:text-3xl font-bold leading-tight">Discover Trending Picks</h2>
                <p className="text-xs sm:text-sm text-slate-100 mt-2">Fresh arrivals with unbeatable daily deals.</p>
              </div>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
}
