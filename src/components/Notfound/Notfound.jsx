import React, { useEffect } from "react";
import Style from './Notfound.module.css'
import NotfoundImage from '../../assets/notfound.jpg'
export default function Notfound() {
  useEffect(() => {}, []);
  return (
    <div className="flex justify-center items-center min-h-[50vh] px-4">
      <img src={NotfoundImage} alt="Not Found" className="w-full max-w-md object-contain rounded-lg" />
    </div>
  );
}
