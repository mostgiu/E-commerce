import React, { useEffect } from "react";
import Style from './About.module.css'
export default function About() {
  useEffect(() => {}, []);
  return (
    <div className="container mx-auto px-4 py-8 flex flex-col items-center justify-center text-center max-w-3xl">
     <h1 className="text-3xl font-bold underline">
    Hello world!
  </h1>
    </div>
  );
}
