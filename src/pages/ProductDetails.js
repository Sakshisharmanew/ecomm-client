import React, { useState, useEffect } from "react";
import Layout from "./../components/Layout/Layout";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/ProductDetailsStyles.css";
import { useCart } from "../context/cart";
import * as mod from "./../../src/url.js";
import { Rate } from "antd";
import { Progress } from "antd";
import { Tooltip, Space } from "antd";
import Magnifier from "react-image-magnify";
import { FaStar } from "react-icons/fa";
import { FcLike } from "react-icons/fc";
import { FcDislike } from "react-icons/fc";
import { TbCertificate } from "react-icons/tb";
import Modal from "react-modal";
import { useCurrency } from "../context/CurrencyChange.js";
import { Hourglass } from "react-loader-spinner";
import { useAuth } from "../context/auth.js";
import { toast } from "react-toastify";
import { Button, Text } from "@chakra-ui/react";

const colorOptions = ["#4285F4", "#EA4335", "#FBBC05", "#34A853"];

const ProductDetails = () => {
  const params = useParams();
  const { selectedCurrency } = useCurrency();

  const navigate = useNavigate();
  const [product, setProduct] = useState({});
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [colorProducts, setColorProducts] = useState([]);
  const [cart, setCart] = useCart([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [rating, setRating] = useState(0);
  const [popupPosition, setPopupPosition] = useState({ x: 0, y: 0 });
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [auth, setAuth] = useAuth();

  const [likeStatus, setLikeStatus] = useState([]);
  useEffect(() => {
    // Initialize likeStatus with false for each review
    setLikeStatus(Array(product?.reviews?.length).fill(false));
  }, [product.reviews]);
  const handleLikeReview = async (reviewIndex) => {
    try {
      const userId = auth.user._id;
      // console.log(userId, "userId");
      const updatedLikeStatus = [...likeStatus];
      const review = product.reviews[reviewIndex];

      if (!review.likes.includes(userId)) {
        review.likes.push(userId);

        await axios.put(
          `/api/v1/product/${product._id}/reviews/${reviewIndex}/like`,
          {
            userId: userId,
          }
        );

        updatedLikeStatus[reviewIndex] = true;
        setLikeStatus(updatedLikeStatus);
      } else {
        toast.error("User has already liked this review");
      }
    } catch (error) {
      console.error("Error liking review:", error);
    }
  };

  useEffect(() => {
    if (params?.slug) getProduct();
  }, [params?.slug]);

  //getProduct
  const getProduct = async () => {
    try {
      const { data } = await axios.get(
        `${mod.api_url}/api/v1/product/get-product/${params.slug}`
      );
      setProduct(data?.product);
      setRating(data?.product?.rating || 0);
      getSimilarProduct(data?.product._id, data?.product.category._id);
    } catch (error) {
      console.log(error);
    }
  };

  const getSimilarProduct = async (pid, cid) => {
    // window.location.reload();
    try {
      const { data } = await axios.get(
        `${mod.api_url}/api/v1/product/related-product/${pid}/${cid}`
      );
      setRelatedProducts(data?.products);
      setSelectedImage(null);
    } catch (error) {
      console.log(error);
    }
  };

  // console.log(colorProducts,'ppppppppppp')

  const buyNow = () => {
    const existingProduct = cart.find((item) => item._id === product._id);
    if (existingProduct) {
      navigate("/cart");
    } else {
      // If the product doesn't exist, add it to the cart and redirect to the checkout page
      setCart([
        ...cart,
        { ...product, quantity: 1, size: selectedSize, colors: selectedColor },
      ]);
      localStorage.setItem(
        "cart",
        JSON.stringify([
          ...cart,
          {
            ...product,
            quantity: 1,
            size: selectedSize,
            colors: selectedColor,
          },
        ])
      );

      navigate("/cart");
    }
  };
  const handleSizeChange = (event) => {
    setSelectedSize(event.target.value);
  };

  const handleColorChange = (event) => {
    setSelectedColor(event.target.value);
  };

  // const handleLikeToggle = () => {
  //   setLike((prevLike) => !prevLike);
  //   setTotalLike((prevCount) => (like ? prevCount - 1 : prevCount + 1));
  // };

  // const handleLikeAdd = () => {
  //   console.log("Product added to cart!");
  // };

  // const handleLikeLess = () => {
  //   console.log("Disliked!");
  // };

  const handleImageClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const reviewsToShowInitially = 5;
  const [visibleReviews, setVisibleReviews] = useState(reviewsToShowInitially);

  const handleLoadMore = () => {
    setVisibleReviews(
      (prevVisibleReviews) => prevVisibleReviews + reviewsToShowInitially
    );
  };
  const result = (() => {
    let ratingCounts = {};

    product?.reviews?.forEach((review) => {
      const { rating } = review;
      ratingCounts[rating] = (ratingCounts[rating] || 0) + 1;
    });

    // console.log("Rating Counts:", ratingCounts);

    return { ratingCounts };
  })();

  //
  const openImageModal = (filename) => {
    setSelectedImage(filename);
  };

  return (
    <Layout>
      <h1 className="text-center" style={{ marginBottom: "10px" }}>
        Product Details
      </h1>
      <hr />
      <div className="row product-details justify-content-center single-page  ">
        <div className="col-md-6 mt-1 top_data">
          <div className="w-[45%] flex-1 flex flex-col p-6">
            {product?.images && (
              <>
                <div className="top-20">
                  {selectedImage ? (
                    <div className="cursor-pointer transition-all relative">
                      <div className="relative">
                        <img
                          src={require(`./../img/produtImg/${selectedImage}`)}
                          alt="Selected Image"
                          className="thumb"
                        />
                        {isPopupVisible && (
                          <div
                            className="popup"
                            style={{
                              position: "fixed",
                              top: `${popupPosition.y}px`,
                              left: `${popupPosition.x}px`,
                            }}
                          >
                            {/* Zoomed-in content */}
                            <img
                              src={require(`./../img/produtImg/${selectedImage}`)}
                              alt="Selected Image"
                              className="zoomed-in-image"
                              style={{
                                height: "250px",
                                width: "300px",
                                transform: "scale(1.5)",
                              }}
                            />
                            {/* Add more content or customize as needed */}
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <img
                      src={require(`./../img/produtImg/${product.images[0].filename}`)}
                      className="cursor-pointer transition-all thumb"
                      alt={product.name}
                    />
                  )}
                </div>
                {product.images.map((pro, imageIndex) => (
                  <img
                    className="productImg_det"
                    key={imageIndex}
                    src={require(`./../img/produtImg/${pro.filename}`)}
                    alt={`Image ${imageIndex + 1}`}
                    onClick={() => openImageModal(pro.filename)}
                  />
                ))}
              </>
            )}
          </div>
          {product.quantity <= 0 ? (
            <Button width="90%" colorScheme='red' fontSize={14} className="b">
              Notify Me{" "}
            </Button>
          ) : (
            <Button width="90%" marginBottom="3px"  colorScheme='linkedin' fontSize={14} className="but" onClick={buyNow} >
              Buy Now{" "}
            </Button>
          )}
        </div>

        {/* details part*/}
        <div className="col-md-6  product-details-info">
          <div
            className="scroller-bar"
            style={{
              height: "500px",
              width: "100%",
              overflowY: "auto",
              scrollbarWidth: "thin", // Firefox
              WebkitOverflowScrolling: "touch", // iOS
              marginLeft: "8px",
              padding: "10px",
            }}
          >
            <style>
              {`
                  ::-webkit-scrollbar {
                    width: 5px;
                    height: 0px;
                  }
                  ::-webkit-scrollbar-thumb {
                    background-color: #ccc; // Set your desired scrollbar color
                  }
                `}
            </style>
            <div className="row">
              <div className="col-12 product-name">
                <h5>{product.name} </h5>
              </div>
            </div>
            <h6>
              {product.offers > 0 ? (
                <h6 style={{ color: "green" }}>
                  {/* Calculate discounted price  */}
                  {(() => {
                    // Calculate discounted price
                    const prices = (product.price * product.offers) / 100;
                    const finalPrice = product.price - prices;
                    const disc = product.price - finalPrice;
                    return (
                      <>
                        You save Extra {selectedCurrency}
                        {/* {selectedCurrency}  */}
                        {disc.toFixed(2)} off
                        <br />
                        <br />
                        <span>
                          {selectedCurrency} {finalPrice.toFixed(2)}
                        </span>
                      </>
                    );
                  })()}
                  &nbsp; &nbsp;
                  <del>
                    {selectedCurrency}
                    {product.price}
                  </del>
                  &nbsp; &nbsp; {product.offers}% off !!!!
                </h6>
              ) : (
                <h6 style={{ color: "green" }}>
                  {(() => {
                    const prices = (product.price * product.offers) / 100;
                    const finalPrice = product.price - prices;
                    const disc = product.price - finalPrice;
                    return (
                      <>
                        <br />
                        <br />
                        <span>
                          {selectedCurrency} {finalPrice.toFixed(2)}
                        </span>
                      </>
                    );
                  })()}
                </h6>
              )}
            </h6>
            <h6>Category : {product?.category?.name}</h6>
            <h6>
              <strong>Color: </strong> {product.colors}
            </h6>
            {product.quantity <= 0 ? (
              <>
                <h2 style={{ color: "red" }}>Sold Out </h2>
                <h5 style={{ color: "red" }}>
                  This item is currently out of stock
                </h5>
              </>
            ) : (
              ""
            )}
            <h6>
              <strong>Brand Name: </strong>
              {product.brand}
            </h6>
            {product?.category?.name === "clothes" ? (
              <>
                <div className="">
                  <label className="one">
                    S
                    <input
                      className="input-section"
                      type="radio"
                      value="S"
                      name="sizeGroup"
                      onChange={handleSizeChange}
                    />
                  </label>

                  <label className="one">
                    M
                    <input
                      className="input-section"
                      type="radio"
                      value="M"
                      name="sizeGroup"
                      onChange={handleSizeChange}
                    />
                  </label>

                  <label className="one">
                    L
                    <input
                      className="input-section"
                      type="radio"
                      value="L"
                      name="sizeGroup"
                      onChange={handleSizeChange}
                    />
                  </label>

                  <label className="one">
                    XL
                    <input
                      className="input-section"    
                      type="radio"
                      value="XL"
                      name="sizeGroup"
                      onChange={handleSizeChange}
                    />
                  </label>

                  <label className="one">
                    XXL
                    <input
                      className="input-section"
                      type="radio"
                      value="XXL"
                      name="sizeGroup"
                      onChange={handleSizeChange}
                    />
                  </label>
                </div>
              </>
            ) : (
              ""
            )}

            <br />

            <h6>
              <strong>Product Delivery time: </strong>{" "}
              <strong style={{ color: "green" }}>
                within {product.deleverydate}
              </strong>
            </h6>

            {/* <strong>Product Color: </strong>
              <div className="container">
                <img src="/images/skyblue1.jpg" style={{width:"60px", height:"60px", marginRight:"10px"}}/>
                <img src="/images/red1.jpg" style={{width:"60px", height:"60px",  marginRight:"10px"}}/>
                <img src="/images/fogibag1.jpg" style={{width:"60px", height:"60px",  marginRight:"10px"}}/>
                <img src="/images/blackbag1.jpg" style={{width:"60px", height:"60px", marginRight:"10px"}}/>
              </div> */}
            {/* <div className="container">
                {colorOptions.map((color, index) => (
                  <React.Fragment key={index}>
                    <input
                      type="radio"
                      className="radio"
                      name="colorGroup"
                      value={color}
                      onChange={handleColorChange}
                      style={{
                        padding: "1px",
                        width: "20px",
                        marginLeft: "25px",
                      }}
                    />
                    <label
                      className={`color-lable ${
                        selectedColor === color ? "selected" : ""
                      }`}
                      htmlFor={`radio-${index + 1}`}
                      style={{ backgroundColor: color }}
                    ></label>
                  </React.Fragment>
                ))}
              </div> */}
            <br></br>
            <div className="row">
              <div className="col-12">
                <h5>Description: </h5>
                <h6>
                  {/* {product.description} */}
                  {(() => {
                    const pro = product.description;
                    if (typeof pro !== "string") {
                      return <div>Invalid description</div>;
                    }
                    const wordsArray = pro.split(";");
                    return (
                      <>
                        <div>
                          {wordsArray.map((info, index) => (
                            <p key={index}>
                              {" "}
                              <span style={{ fontSize: 20 }}>.</span> &nbsp;
                              {info.trim()}
                            </p>
                          ))}
                        </div>
                      </>
                    );
                  })()}
                </h6>
                <div>{product && <div></div>}</div>
              </div>

              <h1>{product.title}</h1>
              <div className="rating-and-review">
                <h5 style={{ marginLeft: "5px", marginRight: "9px" }}>
                  {product?.reviews?.length}, Ratings & Reviews:
                </h5>
                <div
                  className="review-total-pper"
                  style={{ display: "inline-flex", background: "green" }}
                >
                  <h6 style={{ display: "inline-flex" }}>
                    <h6
                      style={{
                        color: "white",
                        marginTop: "3px",
                        marginLeft: "2px",
                      }}
                    >
                      5
                    </h6>
                  </h6>
                  <FaStar
                    style={{
                      color: "white",
                      display: "inline-flex",
                      marginTop: "2px",
                      marginLeft: "3px",
                    }}
                  />
                </div>
              </div>
            </div>
            <div>
              <hr />
              {product?.reviews?.slice(0, visibleReviews).map((r, index) => (
                <>
                  <div key={r.reviewId} style={{ color: "green" }}>
                    <div className="rating-back">
                      <h6 style={{ color: "white", display: "inline-flex" }}>
                        {r?.rating}
                      </h6>
                      <FaStar
                        style={{
                          color: "white",
                          display: "inline-flex",
                          marginLeft: "2px",
                          marginBottom: "2px",
                        }}
                      />
                    </div>
                    <p
                      style={{
                        display: "inline",
                        marginRight: "10px",
                        color: "#7b7676",
                      }}
                    >
                      {" "}
                      {r?.comment}
                    </p>
                    <img
                      // src={require(`./../img/produtImg/${r?.images[0]}`)}
                      src="/images/e2.png"
                      alt="Selected Image"
                      className="revieimgaes"
                      onClick={handleImageClick}
                    />
                    <Modal
                      isOpen={isModalOpen}
                      onRequestClose={handleCloseModal}
                      contentLabel="Image Modal"
                      style={{
                        content: {
                          width: "350px",
                          height: "350px",
                          margin: "auto",
                          marginTop: "60px",
                        },
                      }}
                    >
                      <img
                        src="/images/e2.png"
                        alt="Selected Image"
                        className="revieimgaes"
                        style={{ width: "100%", height: "80%" }}
                      />
                      <Button width="100%" colorScheme='linkedin' fontSize={14} marginTop={2} className="b" onClick={handleCloseModal}>
                        Close
                      </Button>
                    </Modal>

                    <div
                      className="like-dislike-icon"
                      // onClick={handleLikeToggle}
                    >
                      {!likeStatus[index] ? (
                        <FcLike
                          onClick={() => handleLikeReview(index)}
                          style={{
                            color: "black",
                            width: "20px",
                            height: "20px",
                          }}
                        />
                      ) : (
                        <FcDislike
                          onClick={() => handleLikeReview(index)}
                          style={{
                            color: "black",
                            width: "20px",
                            height: "20px",
                          }}
                        />
                      )}
                      <span> {r.likes.length}</span>
                    </div>
                    <div>
                      <h6 style={{ color: "#7b7676" }}>
                        Our Customer : {r?.user?.name}
                      </h6>
                      <h6 style={{ color: "#7b7676" }}>
                        <TbCertificate /> - Certified Buyer, {r?.user?.city}
                      </h6>
                    </div>
                    <hr />
                  </div>
                </>
              ))}
            </div>
            {visibleReviews < product?.reviews?.length && (
              <Button width="30%" margin="0 auto" colorScheme='linkedin' fontSize={10} onClick={handleLoadMore}>
                {/* <p>Load More</p> */}
                <Hourglass
                  visible={true}
                  height="20"
                  width="20"
                  ariaLabel="hourglass-loading"
                  wrapperStyle={{
                    display: "inline",
                    marginRight: "8px",
                  }}
                  wrapperClass=""
                  colors={["white", "white"]}
                />
              </Button>
            )}
            <div className="responsive-container">
              <div className="col-md-12 mt-1 left-side">
                <div className="row">
                  {/* <p>No. of reviews: {product?.reviews?.length}</p> */}
                  <h6 className="text-center">Total Satisfied Users</h6>

                  {[5, 4, 3, 2, 1].map((rating) => (
                    <div className="row" key={rating}>
                      <div className="col-3">
                        {rating}{" "}
                        <FaStar
                          style={{
                            color: "black",
                            display: "inline-flex",
                            marginLeft: "2px",
                            marginBottom: "2px",
                          }}
                        />
                      </div>

                      <div className="col-6">
                        <div
                          style={{
                            height: "7px",
                            backgroundColor: "#ddd",
                            borderRadius: "2px",
                            marginTop: "2px",
                          }}
                        >
                          <div
                            style={{
                              height: "100%",

                              width: !result.ratingCounts[rating]
                                ? "0%"
                                : `${
                                    (result.ratingCounts[rating] /
                                      (product?.reviews?.length || 1)) *
                                    10
                                  }%`,
                              backgroundColor:
                                rating === 1
                                  ? "red"
                                  : rating === 2
                                  ? "yellow"
                                  : "green",
                              borderRadius: "2px",
                            }}
                          ></div>
                        </div>
                      </div>
                      <div className="col-3">
                        {result.ratingCounts[rating] || 0}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              {/* <div className="col-md-6 mt-1 right-side">
                <div className="row">
                  <div className="col-12">
                    <h6 className="text-center">Total Success Orders</h6>
                    <Tooltip title="99% Customers was Satisfied">
                      <Progress percent={99} success={{ percent: 99 }} />
                    </Tooltip>
                    <Space wrap>
                      <Tooltip title="99% Customers was Satisfied">
                        <Progress
                          percent={99}
                          success={{ percent: 99 }}
                          type="circle"
                        />
                      </Tooltip>
                    </Space>
                  </div>
                </div>
              </div> */}
            </div>
          </div>
        </div>
      </div>
      <hr
        style={{
          background:
            "linear-gradient(to right, red, orange, yellow, green, blue, indigo, violet)",
          height: "5px",
          border: "none",
        }}
      />

      <hr />

      <div className="container-fluid row mt-3 similar-products">
        <h4 className="text-center">Similar Products ➡️</h4>
        {relatedProducts.length < 1 && (
          <p className="text-center">No Similar Products found</p>
        )}
        <div className=" col-12  d-flex flex-wrap simmiler">
          {relatedProducts?.map(
            (p, index) =>
              index < 12 && (
                <div className="card m-1" key={p._id}>
                  <button width="100%" colorScheme='linkedin' fontSize={10}
                    style={{ border: "none" }}
                    onClick={() =>
                      navigate(`/product/${p.slug}`)
                        ? window.location.reload({
                            top: 0,
                            left: 0,
                            behavior: "smooth",
                          })
                        : window.scrollTo({
                            top: 0,
                            left: 0,
                            behavior: "smooth",
                          })
                    }
                  >
                    {p.images.length > 0 && (
                      <img
                        style={{
                          margin: 5,
                          width: "95%",
                          height: 150,
                        }}
                        src={require(`./../img/produtImg/${p.images[0].filename}`)}
                        className="hover:scale-105 cursor-pointer transition-all "
                        alt={p.name}
                      />
                    )}
                  </button>
                  <div className="card-body">
                    <div className="card-name-price">
                      <h5 className="card-title">{p.name.slice(0, 8)} | </h5>
                      <h5 className="card-title card-price">
                        {selectedCurrency}
                        {p.price}
                      </h5>
                    </div>
                    <p className="card-text ">
                      {/* {p.description.substring(0, 60)}... */}
                      {p?.offers ? (
                        <h5 className="offer-name" style={{ color: "green" }}>
                          Offers &nbsp; {p.offers}%
                        </h5>
                      ) : (
                        ""
                      )}
                    </p>
                    <Button width="100%" colorScheme='linkedin' fontSize={14} onClick={buyNow}>
                      Buy Now
                    </Button>
                    <style>
                      {`
                .scroller-bar::-webkit-scrollbar {
                  width: 5px;
                  height: 0px;
                  margin-left: auto; // Move scrollbar to the right
                }

                .scroller-bar::-webkit-scrollbar-thumb {
                  background-color: #ccc; // Set your desired scrollbar color
                }
              `}
                    </style>
                  </div>
                </div>
              )
          )}
        </div>
      </div>
    </Layout>
  );
};
export default ProductDetails;
