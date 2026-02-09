import React, { useEffect,useState } from "react";
import Style from './BrandDetails.module.css'
import { useParams } from "react-router-dom";
import axios from "axios";
export default function BrandDetails() {
  const { id } = useParams();
  const [brandDetails, setBrandDetails] = useState({});
  useEffect(() => {
    axios.get(`https://ecommerce.routemisr.com/api/v1/brands/${id}`).then((res) => {      
      setBrandDetails(res.data);
    }).catch((err) => {
      console.log(err, "err");
    });
  }, [id]);
  return <>
  <div className="container flex align-center items-center">
        <h1>{brandDetails.name}</h1>
                  <img src={brandDetails.image} alt={brandDetails.name} className="w-100 h-100" />
  </div>
  </>;
}
