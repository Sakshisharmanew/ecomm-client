import React, { useEffect, useState } from "react";
import "./../../styles/ProductCategory.css";
import axios from "axios";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { Link } from "react-router-dom";
import * as mod from "./../../url.js";
import "react-responsive-carousel/lib/styles/carousel.min.css";

function ProductCategory() {
  const [categories, setCategories] = useState([]);
  const [isImageVisible, setIsImageVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const scrollThreshold = 10;
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

  const getAllCategory = async () => {
    try {
      const { data } = await axios.get(
        `${mod.api_url}/api/v1/category/get-category`
      );
      if (data?.success) {
        setCategories(data?.category);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllCategory();
  }, []);

  const responsive = {
    desktop: {
      breakpoint: { max: 3000, min: 600 },
      items: 6,
      slidesToSlide: 2,
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 5,
      slidesToSlide: 2,
    },
    mobile: {
      breakpoint: { max: 600, min: 0 },
      items: 4,
      slidesToSlide: 1,
    },
  };

  return (
    <>
      <hr />
      <div className="app_compo">
        <div className="py-3 bg-light app">
          <div className="catogryslid">
            <div className="row">
              <div className="col-12">
                <h2
                  className="mb-3"
                  style={{ fontFamily: "monospace", fontSize: 18 }}
                >
                  Our Categories
                </h2>
              </div>
              <Carousel
                responsive={responsive}
                autoPlay={true}
                autoPlaySpeed={3000}
                showDots={true}
                removeArrowOnDeviceType={["tablet", "mobile", "desktop"]}
                infinite={true}
              >
                {categories.map((c, index) => (
                  <div
                    className={`banner_image ${
                      isImageVisible ? "visible" : "visible"
                    }`}
                    key={index}
                  >
                    <div className="category-card">
                      <Link
                        className="dropdown-item headerName"
                        style={{ fontFamily: "monospace" }}
                        to={`/category/${c.slug}`}
                      >
                        <div className="category-card-img row">
                          <img
                            // src={require(`./../../img/categoryImg/${c?.image}`)}
                            src={`${mod.api_url}/api/v1/category/singlePhoto-category/${c._id}`}
                            className="catrgory-image"
                            alt="loading..."
                            
                          />
                        </div>
                        {/* <div className="row m-1 p-2">{c.name}</div> */}
                      </Link>
                    </div>
                  </div>
                ))}
              </Carousel>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ProductCategory;
