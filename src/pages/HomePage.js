import React, { useState, useEffect } from "react";
import { Link, NavLink, redirect, useNavigate } from "react-router-dom";
import { Prices } from "../components/Prices";
import { useCart } from "../context/cart";
import axios from "axios";
import toast from "react-hot-toast";
import Layout from "./../components/Layout/Layout";
import "../styles/Homepage.css";
import Rate from "./Rate";
import { useAuth } from "../context/auth";
import { useCurrency } from "../context/CurrencyChange";
import ProductCategory from "../components/Layout/ProductCategory";
import ScreenProducts from "../components/Layout/ScreenProducts";
import * as mod from "./../../src/url.js";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import CurrencyConverter from "./OnlineCurr.js";
import { Hourglass, RotatingTriangles } from "react-loader-spinner";
import Slider from "../components/Layout/slider.js";
import _debounce from "lodash/debounce";
import { Box, Button } from "@chakra-ui/react";

const HomePage = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useCart();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const { selectedCurrency } = useCurrency();
  const [loadingMore, setLoadingMore] = useState(false);

  useEffect(() => {
    getTotal();
    getAllProducts();
  }, []);

  // Get total count
  const getTotal = async () => {
    try {
      const { data } = await axios.get(
        `${mod.api_url}/api/v1/product/product-count`
      );
      setTotal(data?.total);
    } catch (error) {
      console.error("Error fetching total count:", error);
    }
  };

  // Get products
  const getAllProducts = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `${mod.api_url}/api/v1/product/product-list/${page}`
      );
      setLoading(false);

      if (page === 1) {
        setProducts(data.products);
      } else {
        setProducts((prevProducts) => [...prevProducts, ...data?.products]);
      }
    } catch (error) {
      setLoading(false);
      console.error("Error fetching products:", error);
    }
  };

  // Load more on button click
  const handleLoadMoreClick = async () => {
    setLoadingMore(true);

    // Simulate loading with a timeout
    await new Promise((resolve) => setTimeout(resolve, 10));

    setPage((prevPage) => prevPage + 1);
    setLoadingMore(false);
  };

  useEffect(() => {
    const handleScroll = _debounce(() => {
      const { scrollTop, clientHeight, scrollHeight } =
        document.documentElement;

      if (scrollTop + clientHeight >= scrollHeight - 200) {
        if (!loading && !loadingMore && products.length < total) {
          setPage((prevPage) => prevPage + 1);
        }
      }
    }, 20);

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [loading, loadingMore, products, total]);

  // Load more when the page changes
  useEffect(() => {
    if (page > 1) {
      getAllProducts();
    }
  }, [page]);

  return (
    <>
      <Layout title={"ALl Products - Best offers "}>
        <Slider />
        <div>
          <ProductCategory />
        </div>
        <ScreenProducts />
        <div className="container-fluid row mt-3 home-page">
          <div className="col-12 swiper-container">
            <div className="product-grid">
              {products?.map((p) => (
                <>
                  <div className="product-card" key={p._id}>
                    {p.quantity <= 0 ? (
                      <>
                        <p
                          className="stock"
                          style={{
                            color: "white",
                            background: "red",
                          }}
                        >
                          Sold
                        </p>
                      </>
                    ) : (
                      <>
                        <p
                          className="stock"
                          style={{
                            color: "white",
                            background: "green",
                          }}
                        >
                          In stock
                        </p>
                      </>
                    )}
                    <button
                      className="product-image w-100"
                      onClick={() => {
                        navigate(`/product/${p.slug}/`);
                        window.scrollTo({
                          top: 0,
                          left: 0,
                          behavior: "smooth",
                        });
                      }}
                    >
                      {p.images.length > 0 && (
                        <img
                          src={require(`./../img/produtImg/${p?.images[0]?.filename}`)}
                          alt="uploading...."
                        />
                      )}
                    </button>

                    {/* Stock status badge */}

                    <div className="product-details">
                      <h5 className="product-title">{p.name.slice(0, 20)}</h5>
                      <div className="product-price">
                        <span>{selectedCurrency}</span>&nbsp;
                        <span>{p.price}</span>
                        &nbsp;
                      </div>

                      {/* Display offers */}
                      {p.offers > 0 && (
                        <p className="product-offers">
                          <span style={{ color: "green" }}>Offers: </span>
                          {p.offers}%
                        </p>
                      )}

                      {/* Star ratings */}
                      <div
                        className="col text-center"
                        style={{ color: "yellow" }}
                      >
                        <div className="star-rating">
                          {[1, 2, 3, 4, 5].map((starValue) => (
                            <p key={starValue} className="star">
                              <FontAwesomeIcon
                                className="star"
                                icon={faStar}
                                color={
                                  p.ratting >= starValue ? "golden" : "#ddd"
                                }
                              />
                            </p>
                          ))}
                        </div>
                      </div>

                      {/* Product actions */}
                      <div className="product-actions">
                        {p.quantity <= 0 ? (
                          <Button width="50%" colorScheme='red' fontSize={10} marginRight={1}
                            className="butto"
                            style={{ color: "white" }}
                          >
                            Notify Me
                          </Button>
                        ) : (
                          <Button width="50%" colorScheme='linkedin' fontSize={10} marginRight={1}
                            className="butt"
                            onClick={() => {
                              const existingProduct = cart.find(
                                (item) => item._id === p._id
                              );
                              if (existingProduct) {
                                navigate("/cart");
                              } else {
                                setCart([...cart, { ...p, quantity: 1 }]);
                                localStorage.setItem(
                                  "cart",
                                  JSON.stringify([
                                    ...cart,
                                    { ...p, quantity: 1 },
                                  ])
                                );
                                navigate("/cart");
                              }
                            }}
                          >
                            Buy Now
                          </Button>
                        )}

                        <Button width="50%" colorScheme='linkedin' fontSize={10}
                          className="butt"
                          onClick={() => {
                            const itemExists = cart.some(
                              (item) => item._id === p._id
                            );
                            if (itemExists) {
                              navigate("/cart");
                            } else {
                              setCart([...cart, { ...p, quantity: 1 }]);
                              localStorage.setItem(
                                "cart",
                                JSON.stringify([...cart, { ...p, quantity: 1 }])
                              );
                              toast.success("Item Added to Cart");
                            }
                          }}
                        >
                          Add to Cart
                        </Button>
                      </div>
                    </div>
                  </div>
                </>
              ))}
            </div>
            <div></div>

            <div className="text-center m-4 p-6">
              {products && products.length < total && (
                <Button width="100%" colorScheme='linkedin' fontSize={10}
                  className="load-div"
                  onClick={(e) => handleLoadMoreClick(e)}
                  disabled={loadingMore}
                >
                  {loadingMore ? (
                    <Hourglass
                      visible={true}
                      height="40"
                      width="40"
                      ariaLabel="hourglass-loading"
                      wrapperStyle={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        margin: "0 auto",
                        padding: "5px",
                        height: "50px",
                      }}
                      wrapperClass=""
                      colors={["#306cce", "#72a1ed"]}
                    />
                  ) : (
                    <>
                    <Hourglass
                      visible={true}
                      height="30"
                      width="30"
                      ariaLabel="hourglass-loading"
                      wrapperStyle={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        margin: "0 auto",
                        padding: "5px",
                        height: "50px",
                      }}
                      wrapperClass=""
                      colors={["white", "white"]}
                    />
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
};

export default HomePage;
