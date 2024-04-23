import React, { useState, useEffect } from "react";
import "./../../styles/ScreenProducts.css";
import axios from "axios";
import { Checkbox, Radio, Button } from "antd";
import { CCarousel } from "@coreui/react";
import { CCarouselCaption } from "@coreui/react";
import { CCarouselItem } from "@coreui/react";
import { CImage } from "@coreui/react";
import { Carousel } from "react-bootstrap";
import * as mod from "./../../../src/url";
import toast from "react-hot-toast";

function ScreenProducts() {
  const [isImageVisible, setIsImageVisible] = useState(false);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [uploadedData, setUploadedData] = useState(null);

  const getAllImg = async () => {
    try {
      const response = await axios.get(
        `${mod.api_url}/api/vi/multiple/multiple-get`
      );
      if (response.data.success) {
        setUploadedData(response.data.data);
      }
    } catch (error) {
      console.log(error);
      toast.error(
        "Something went wrong in getting the MultipleImageMultipleImage data"
      );
    }
  };
  useEffect(() => {
    getAllImg();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const scrollThreshold = 200;
      if (scrollPosition < scrollThreshold) {
        setIsImageVisible(true);
      } else {
        setIsImageVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
<>
  <div className={`banner_big_image ${isImageVisible ? "visible" : "visible"}`}>
    <div className="row">
      {uploadedData &&
        uploadedData?.map((item, index) => (
          <div className={`col-md-6 mt-4 `} key={item._id}>
            <div className="card " style={{ width: '100%', height: '100%', display:"contents" }}>
              <CImage
                className="card-img-top banner-imgs"
                src={`${mod.api_url}/api/vi/multiple/sliderImageII/${item._id}`}
                alt="Uploaded"
              />
            </div>
          </div>
        ))}
    </div>
  </div>
</>
  );
}

export default ScreenProducts;
