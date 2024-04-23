import { Checkbox, Radio, Button } from "antd";
import * as mod from "./../../url";
import axios from "axios";
import React, { useState, useEffect } from "react";
import { CCarousel } from "@coreui/react";
import { CCarouselCaption } from "@coreui/react";
import { CCarouselItem } from "@coreui/react";
import toast from "react-hot-toast";
import { CImage } from "@coreui/react";
const Slider = () => {
  const [uploadedData, setUploadedData] = useState(null);

  const getSlider = async () => {
    try {
      const { data } = await axios.get(
        `${mod.api_url}/api/v1/slider/get-slider`
      );
      if (data.success) {
        setUploadedData(data.sliderData);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong in getting the slider data");
    }
  };
  useEffect(() => {
    getSlider();
  }, []);
  return (
    <div>
      <CCarousel controls indicators interval={2000}>
        {uploadedData &&
          uploadedData?.map((item, index) => (
            <CCarouselItem className="line-by-line">
              <CImage
                className="d-block w-100  banner-img"
                // src={require(`./../../img/dynamicSlider/${item.image}`)}
                src={`${mod.api_url}/api/v1/slider/get-slider/${item._id}`}
                alt="Uploaded"
              />
              <CCarouselCaption
                className={` ${index % 2 === 0 ? "odd-card" : "even-card"}`}
                key={item._id}
              >
                <h5 className="line" style={{ fontSize: 16 }}>
                  --{item.title}--
                </h5>
                <h2
                  className="line"
                  style={{
                    fontFamily: "sans-serif",
                    fontWeight: 300,
                    fontSize: 12,
                  }}
                >
                  {item.subTitle}
                </h2>
                <h5 className="line" style={{ fontSize: 16 }}>
                  {item.des}
                </h5>
                <Button
                  href={item.link}
                  className="line"
                  style={{ height: 28, fontSize: 12 }}
                >
                  Start to Buying
                </Button>
              </CCarouselCaption>
            </CCarouselItem>
          ))}
      </CCarousel>
    </div>
  );
};
export default Slider;
