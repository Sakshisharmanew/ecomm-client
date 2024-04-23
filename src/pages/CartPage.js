import React, { useState, useEffect } from "react";
import Layout from "./../components/Layout/Layout";
import { useCart } from "../context/cart";
import { useAuth } from "../context/auth";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import "../styles/CartStyles.css";
import * as mod from "./../../src/url.js";
import { RiDeleteBin2Fill } from "react-icons/ri";
import { Button } from "@chakra-ui/react";

const CartPage = () => {
  const [auth, setAuth] = useAuth();
  const [cart, setCart] = useCart();
  const [clientToken, setClientToken] = useState("");
  const [amount, setAmount] = useState("");
  const [discount, setDiscount] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const lessPrice = discount - amount;
  const [errors, setErrors] = useState("");
  const [address, setAddress] = useState("");
  const isMobile = window.innerWidth < 768;
  const delevrychage = 50;

  // Replace 'userId' with the actual user ID you want to fetch
  const fetchUserAddress = async () => {
    try {
      const userId = auth?.user?._id;
      // const token = auth?.token;

      // console.log(userI,'ppppp')
      const { data } = await axios.get(
        `${mod.api_url}/api/v1/auth/user/address/${userId}`
      );

      setAddress(data); // Set the fetched data into the address state
    } catch (err) {
      // Handle errors
      setErrors(err.response?.data?.message || "An error occurred");
    }
  };
  useEffect(() => {
    if (auth?.token) fetchUserAddress();
  }, [auth?.token]);

  const calculateTotalAmount = () => {
    const totalAmount = cart.reduce((total, item) => {
      const prices = (item.price * item.offers) / 100;
      const finalPrice = item.price - prices;
      return total + finalPrice * item.quantity;
    }, 0);
    return totalAmount;
  };
  const calculateOldAmount = () => {
    const totalAmount = cart.reduce((total, item) => {
      const prices = item.price;
      // const finalPrice = item.price-prices;
      return total + prices * item.quantity;
    }, 0);
    return totalAmount;
  };

  //add cart item same product
  const addToCart = (product) => {
    const existingProduct = cart.find((item) => item._id === product._id);
    if (existingProduct) {
      if (existingProduct.quantity < 20) {
        // If the product already exists, update the quantity
        const updatedCartItems = cart.map((item) =>
          item._id === product._id
            ? { ...item, quantity: existingProduct.quantity + 1 }
            : item
        );
        const itemsPrice = calculateTotalAmount();
        const oldPrice = calculateOldAmount();

        setAmount(itemsPrice);
        setDiscount(oldPrice);
        setCart(updatedCartItems);
        localStorage.setItem("cart", JSON.stringify(updatedCartItems));
        toast.success("One Item added");
      } else {
        toast.error(
          "!sorry you can not add more than 5 quantities of one product"
        );
      }
    } else {
      // If the product doesn't exist, add it to the cart with quantity = 1
      setCart([...cart, { ...product, quantity: 1 }]);
      localStorage.setItem(
        "cart",
        JSON.stringify([...cart, { ...product, quantity: 1 }])
      );
      toast.success("product added to cart");
    }
  };
  // eslint-disable-next-line
  useEffect(() => {
    setAmount(calculateTotalAmount());
    setDiscount(calculateOldAmount());
    // eslint-disable-next-line
  }, [calculateTotalAmount(), calculateOldAmount()]);

  // Item decreament
  const decrementCartItem = (productId) => {
    const existingProduct = cart.find((item) => item._id === productId);
    if (existingProduct) {
      if (existingProduct.quantity === 1) {
        toast.error("Quantity can't be decreased further");
        return; // Exit the function without making any changes
      } else {
        // If the quantity is more than 1, decrement the quantity
        const updatedCartItems = cart.map((item) =>
          item._id === productId
            ? { ...item, quantity: existingProduct.quantity - 1 }
            : item
        );
        // =-------------auto update payment when item will be decreases------------
        const itemsPrice = calculateTotalAmount();
        const oldPrice = calculateOldAmount();
        setDiscount(oldPrice);
        setAmount(itemsPrice);
        setCart(updatedCartItems);
        localStorage.setItem("cart", JSON.stringify(updatedCartItems));
        toast.success("One Item removed");
      }
    }
  };

  const removeCartItem = (pid) => {
    try {
      let myCart = [...cart];
      let index = myCart.findIndex((item) => item._id === pid);
      myCart.splice(index, 1);
      setCart(myCart);
      localStorage.setItem("cart", JSON.stringify(myCart));
    } catch (error) {
      console.log(error);
    }
  };

  //get payment gateway token
  const getToken = async () => {
    try {
      const { data } = await axios.get(
        `${mod.api_url}/api/v1/product/braintree/token`
      );
      setClientToken(data?.clientToken);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getToken();
  }, [auth?.token]);

  const handlePlaceOrder = () => {
    navigate("/cart/payments");
  };

  const handleAddToCart = () => {
    navigate("/");
  };

  return (
    <>
      <Layout>
        <div className=" cart-page">
          <h1 className="text-center bg-light ">
            {!auth?.user
              ? "Hello Guest"
              : `Hello  ${auth?.token && auth?.user?.name}`}
            <p className="text-center">
              {cart?.length
                ? `You Have ${cart.length} items in your cart ${
                    auth?.token ? "" : "please login to checkout !"
                  }`
                : " Your Cart Is Empty"}
            </p>
          </h1>

          {cart?.length ? (
            <div className="container mt-5 ">
              <div className="row">
                <div className="col-md-7 left_side">
                  {cart?.map((item) => (
                    <div className="card flex-row" key={item._id}>
                      <div className="col-md-3 product_card">
                        <button
                          style={{ border: "none", background: "white" }}
                          onClick={() =>
                            navigate(`/product/${item.slug}/`)
                              ? window.scrollTo({
                                  top: 0,
                                  left: 0,
                                  behavior: "smooth",
                                }) //for scrolling to top that page
                              : window.scrollTo({
                                  top: 0,
                                  left: 0,
                                  behavior: "smooth",
                                })
                          }
                        >
                          {item?.images?.length > 0 && (
                            <img
                              src={require(`./../img/produtImg/${item.images[0].filename}`)}
                              className="card-img-top"
                              alt={item.name}
                            />
                          )}
                        </button>
                      </div>
                      <div className="col-md-3 items_details">
                        <p
                          className="item_name"
                          style={{
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            maxWidth: isMobile ? "10ch" : "45ch",
                          }}
                        >
                          {item.name}
                        </p>
                        {/* <p>{item.description.substring(0, 20)}</p> */}
                        <span className="item_price">{item.currency}</span>
                        &nbsp;
                        <span>
                          <del className="old_price">
                            {" "}
                            {item.price * item.quantity}{" "}
                          </del>
                        </span>
                        <h6 className="new_price" style={{ color: "green" }}>
                          {" "}
                          {item.offers}% Discount &nbsp;
                          <span>{item.currency}</span>
                          {(() => {
                            // Calculate discounted price
                            const prices = (item.price * item.offers) / 100;
                            const finalPrice = item.price - prices;
                            const discounted = finalPrice * item.quantity;
                            return (
                              <>
                                <span>{discounted.toFixed(2)}</span>
                              </>
                            );
                          })()}
                        </h6>
                      </div>
                      <div className="col-md-3 cart-remove-btn d-flex justify-content-end">
                        <button
                          className="btn  p-2 m-2 bg-light  border button-28"
                          onClick={() => decrementCartItem(item._id)}
                        >
                          {" "}
                          -{" "}
                        </button>
                        <input
                          type="text"
                          class="p-0 m-0 bg-light border button-28"
                          style={{ width: 30, height: 30, textAlign: "center" }}
                          value={item.quantity}
                        />
                        <button
                          className="btn p-2 m-2 bg-light  border button-28"
                          onClick={() => addToCart(item)}
                        >
                          {" "}
                          +{" "}
                        </button>
                      </div>
                      <div className="col-md-2 cart-remove-btn d-flex justify-content-end">
                        <button
                          className="btn btn-danger"
                          onClick={() => removeCartItem(item._id)}
                        >
                          {" "}
                          <RiDeleteBin2Fill />{" "}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="col-md-5 cart-summary ">
                  <div className="cart  _35mLK5">
                    <h4 className="_3aPjap">Price Details</h4>
                    <div className="row">
                      <div className="col-6">
                        <div className="Item">Price({cart?.length} Item)</div>
                      </div>
                      <div className="col-6">
                        <div className="Item">
                          {discount.toLocaleString("en-US", {
                            style: "currency",
                            currency: "INR",
                          })}
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-6">
                        <div className="Item">Discount</div>
                      </div>
                      <div className="col-6">
                        <div className="Items  Item">
                          -
                          {lessPrice.toLocaleString("en-US", {
                            style: "currency",
                            currency: "INR",
                          })}
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-6">
                        <div className="Item">Delevery Charges</div>
                      </div>
                      <div className="col-6">
                        <div className="Items Item">
                          {amount > 499 ? "FREE" : delevrychage}
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-6">
                        <div className="Item">Total Amount:</div>
                      </div>
                      <div className="col-6">
                        {amount > 499 ? (
                          <>
                            <div className="Item">
                              {amount.toLocaleString("en-US", {
                                style: "currency",
                                currency: "INR",
                              })}
                            </div>
                          </>
                        ) : (
                          (delevrychage + amount).toLocaleString("en-US", {
                            style: "currency",
                            currency: "INR",
                          })
                        )}
                      </div>
                    </div>
                  </div>
                  {}
                  <Button
                    width="100%"
                    colorScheme="linkedin"
                    fontSize={10}
                    className="text-cent"
                    style={{ marginTop: "10px", marginBottom: "35px" }}
                    onClick={() => handlePlaceOrder()}
                  >
                    Place Order{" "}
                    {loading && (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        width={18}
                        height={18}
                      ></svg>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center">
              {" "}
              <h4>Your Cart is Empty</h4>
              <Button
                width="30%"
                colorScheme="linkedin"
                marginBottom={3}
                fontSize={10}
                onClick={handleAddToCart}
              >
                Shop Now
              </Button>
              <br></br>
              <a
                href="https://giphy.com/embed/8PA8Ew3nw97yg"
                target="_blank"
                rel="noopener noreferrer"
              >
                <iframe
                  src="https://giphy.com/embed/8PA8Ew3nw97yg"
                  width="100%"
                  height="auto"
                  frameBorder="0"
                  class="giphy-embed"
                  allowFullScreen
                ></iframe>
              </a>
            </div>
          )}
        </div>
      </Layout>
    </>
  );
};
export default CartPage;
