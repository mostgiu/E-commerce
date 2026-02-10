import React from "react";
import Style from './MainSlider.module.css'
import slider1 from '../../assets/slider1.jpeg'
import slider2 from '../../assets/slider2.jpeg'
import slider3 from '../../assets/slider3.jpeg'  
import slider4 from '../../assets/slider4.jpeg'  
import slider5 from '../../assets/slider5.jpeg'  
import slider6 from '../../assets/slider6.png'  
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
  return <>
    <Slider {...settings}>
            <div className="px-1 sm:px-2">
              <img src={slider1} alt="slider1" className="w-full h-40 sm:h-56 md:h-64 lg:h-80 object-cover rounded-lg"/>
            </div>
            <div className="px-1 sm:px-2">
              <img src={slider2} alt="slider2" className="w-full h-40 sm:h-56 md:h-64 lg:h-80 object-cover rounded-lg"/>
            </div>
            <div className="px-1 sm:px-2">
              <img src={slider3} alt="slider3" className="w-full h-40 sm:h-56 md:h-64 lg:h-80 object-cover rounded-lg"/>
            </div>
            <div className="px-1 sm:px-2">
              <img src={slider4} alt="slider4" className="w-full h-40 sm:h-56 md:h-64 lg:h-80 object-cover rounded-lg"/>
            </div>
            <div className="px-1 sm:px-2">
              <img src={slider5} alt="slider5" className="w-full h-40 sm:h-56 md:h-64 lg:h-80 object-cover rounded-lg"/>
            </div>
            <div className="px-1 sm:px-2">
              <img src={slider6} alt="slider6" className="w-full h-40 sm:h-56 md:h-64 lg:h-80 object-cover rounded-lg"/>
            </div>
          </Slider>
  </>;
}
