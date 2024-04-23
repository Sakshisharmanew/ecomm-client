import React, { useEffect, useState } from "react";
import "../styles/PaymentPage.css";
import Layout from "./../components/Layout/Layout";
import { useCart } from "../context/cart";
import { useAuth } from "../context/auth";
import { useNavigate } from "react-router-dom";
import DropIn from "braintree-web-drop-in-react";
import axios from "axios";
import toast from "react-hot-toast";
// import "../styles/CartStyles.css";
import * as mod from "./../../src/url.js";
import { Modal } from "react-bootstrap";
import { MdDeleteForever } from "react-icons/md";
import { confirmAlert } from "react-confirm-alert"; // Import
import braintree from "braintree-web";
import { Tilt } from "react-tilt";
import { Select } from "antd";
import { Hourglass } from "react-loader-spinner";
import { Button, Text } from "@chakra-ui/react";

function PaymentPage() {
  const [auth, setAuth] = useAuth();
  const [cart, setCart] = useCart();
  const [clientToken, setClientToken] = useState("");
  const [amount, setAmount] = useState("");
  const [discount, setDiscount] = useState("");
  const [instance, setInstance] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const lessPrice = discount - amount;
  const [errors, setErrors] = useState("");
  const [address, setAddress] = useState("");
  const [braintreeDropin, setBraintreeDropin] = useState(null);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const delevrychage = 50;
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [isAddressSelected, setIsAddressSelected] = useState(false);

  // Replace 'userId' with the actual user ID you want to fetch
  const fetchUserAddress = async () => {
    try {
      const userId = auth?.user?._id;
      const userI = auth?.user;
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

  const handleAddressSelection = (address) => {
    setSelectedAddress(address);
    // console.log("Selected Address:", address);
    setIsAddressSelected(true);
  };

  const [formData, setFormData] = useState({
    name: "",
    landmark: "",
    mobile: "",
    locality: "",
    city: "",
    state: "",
    pincode: "",
  });

  const openModal = () => {
    setShowAddressModal(true);
  };

  const closeModal = () => {
    setShowAddressModal(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const calculateTotalAmount = () => {
    const totalAmount = cart.reduce((total, item) => {
      const prices = (item.price * item.offers) / 100;
      const finalPrice = item.price - prices;
      return total + finalPrice * item.quantity;
    }, 0);
    // console.log(totalAmount, 'jjjjjjjjjjjjjjj');
    return totalAmount;
  };
  const calculateOldAmount = () => {
    const totalAmount = cart.reduce((total, item) => {
      const prices = item.price;
      // const finalPrice = item.price-prices;
      return total + prices * item.quantity;
    }, 0);
    // console.log(totalAmount, 'jjjjjjjjjjjjjjj');
    return totalAmount;
  };

  const handleDropInReady = (dropInInstance) => {
    console.log("Drop-in instance is ready:", dropInInstance);
    setInstance(dropInInstance);
  };

  const onErrorDropInInitialization = (error) => {
    console.error("Error during Drop-in initialization:", error);
  };

  // eslint-disable-next-line
  useEffect(() => {
    setAmount(calculateTotalAmount());
    setDiscount(calculateOldAmount());
  }, [calculateTotalAmount(), calculateOldAmount()]);

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

  const deleteUserAddress = async (addressId) => {
    try {
      const { data } = await axios.delete(
        `${mod.api_url}/api/v1/auth/user/address/${addressId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (data.success) {
        toast.success(data.message);
      }
      fetchUserAddress();
    } catch (error) {
      console.error(error.message);
    }
  };
  const [updatedAddress, setUpdatedAddress] = useState({
    name: "",
    state: "",
    city: "",
    landmark: "",
    locality: "",
    pincode: "",
    mobile: "",
  });

  const handleUpdateAddress = async (e, addressId) => {
    e.preventDefault();

    try {
      const response = await axios.put(
        `${mod.api_url}/api/v1/auth/user/updateadd/${addressId}`,
        updatedAddress,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status !== 200) {
        throw new Error("Failed to update user address");
      }

      setUpdatedAddress({
        name: "",
        state: "",
        city: "",
        landmark: "",
        locality: "",
        pincode: "",
        mobile: "",
      });

      console.log("Address updated successfully");
    } catch (error) {
      console.error(error.message);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedAddress((prevAddress) => ({
      ...prevAddress,
      [name]: value,
    }));
  };

  const handlePayment = async () => {
    try {
      setLoading(true);

      if (!selectedAddress) {
        setLoading(false);
        alert("Please choose your address before proceeding with the payment.");
        console.log(
          "Please choose your address before proceeding with the payment"
        );
        return;
      }
      // Assuming you have a state variable for selectedPaymentMethod
      // const selectedPaymentMethod = "COD"; // Change this based on your UI logic

      if (selectedPaymentMethod === "online") {
        // Online payment logic using Braintree
        const { nonce } = await instance.requestPaymentMethod();

        const orderData = {
          paymentMethod: "online",
          products: cart.map((item) => item._id),
          shipinginfo: selectedAddress,
          orderItems: cart.map((item) => ({
            name: item.name,
            image: item.images[0]?.filename || "",
            product: item._id,
            price: item.price,
            quantity: item.quantity,
          })),
          itemsPrice: amount,
          shippingPrice: amount > 499 ? 0 : delevrychage,
          taxPrice: 0,
          totalPrice: amount > 499 ? amount : amount + delevrychage,
          payment: {
            nonce,
          },
          buyer: {
            _id: auth.user._id,
            name: auth.user.name,
            email: auth.user.email,
          },
        };
        const { data } = await axios.post(
          `${mod.api_url}/api/v1/product/braintree/payment`,
          {
            nonce,
            orderData,
          }
        );

        // Handle success for online payment
        toast.success("Payment Completed Successfully");
      } else if (selectedPaymentMethod === "COD") {
        // Cash on Delivery (COD) logic
        const orderData = {
          paymentMethod: "COD",
          products: cart.map((item) => item._id),
          shipinginfo: selectedAddress,
          orderItems: cart.map((item) => ({
            name: item.name,
            image: item.images[0]?.filename || "",
            product: item._id,
            price: item.price,
            quantity: item.quantity,
          })),
          itemsPrice: amount,
          shippingPrice: amount > 499 ? 0 : delevrychage,
          taxPrice: 0,
          totalPrice: amount > 499 ? amount : amount + delevrychage,
          payment: {
            // You can leave payment empty for COD
          },
          buyer: {
            _id: auth.user._id,
            name: auth.user.name,
            email: auth.user.email,
          },
        };

        const { data } = await axios.post(
          `${mod.api_url}/api/v1/product/cod/payment`,
          {
            orderData,
          }
        );

        // Handle success for COD
        toast.success("Order Placed Successfully");
      }

      setLoading(false);
      localStorage.removeItem("cart");
      setCart([]);
      navigate("/dashboard/user/orders");
    } catch (error) {
      console.log(error, "error in handle payment");
      setLoading(false);
      // Handle errors or display a message to the user
      toast.error("This product is Out Of Stock");
    }
  };

  // handle address forn
  const isValidForm = () => {
    const { name, mobile, landmark, city, state } = formData;
    const errors = {};
    const nameRegex = /^[A-Za-z\s]+$/;

    if (!name.match(nameRegex)) {
      errors.name = "Please enter a valid name.";
    }
    if (mobile == "") {
      errors.phone = "Please enter a valid mobile.";
    }
    if (landmark == "") {
      errors.phone = "Please enter a valid addres.";
    }
    if (city == "") {
      errors.phone = "Please enter a valid cityname.";
    }
    if (state == "") {
      errors.phone = "Please enter a valid state.";
    }
    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  //address submitted
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isValidForm()) {
        const res = await axios.post(`${mod.api_url}/api/v1/auth/address`, {
          ...formData,
        });
        if (res && res.data.success) {
          toast.success(res.data && res.data.message);
          fetchUserAddress();
          closeModal();

          setFormData({
            name: "",
            mobile: "",
            state: "",
            city: "",
            locality: "",
            pincode: "",
            landmark: "",
          });
        } else {
          toast.error(res.data.message);
        }
      } else {
        console.log(errors);
        toast.error("fill the form");
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  };

  const defaultOptions = {
    reverse: false, // reverse the tilt direction
    max: 35, // max tilt rotation (degrees)
    perspective: 1000, // Transform perspective, the lower the more extreme the tilt gets.
    scale: 1.1, // 2 = 200%, 1.5 = 150%, etc..
    speed: 1000, // Speed of the enter/exit transition
    transition: true, // Set a transition on enter/exit.
    axis: null, // What axis should be disabled. Can be X or Y.
    reset: true, // If the tilt effect has to be reset on exit.
    easing: "cubic-bezier(.03,.98,.52,.99)", // Easing on enter/exit.
  };

  return (
    <Layout>
      <div>
        <Text textAlign="center" fontSize="18px" >Checkout Page</Text>
        {auth?.user?.address ? (
          <>
            <div className="mb-3 text-center ">
              <div>
                <Modal
                  show={showAddressModal}
                  // onHide={() => setShowAddressModal(false)}
                  onHide={closeModal}
                >
                  <Modal.Header closeButton>
                    <Modal.Title>Add New Address</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    <div className="container mt-5">
                      <form className="">
                        <div className="row mb-3">
                          <div className="col-md-4">
                            <div className="mb-3">
                              <label htmlFor="name">Full Name:</label>
                              <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="form-control"
                                placeholder="Enter Your Name"
                                autoFocus
                                id="outlined-basic"
                                label="Name"
                                variant="outlined"
                              />
                            </div>
                          </div>
                          <div className="col-md-4">
                            <label htmlFor="name">Mobile:</label>
                            <input
                              type="text"
                              id="mobile"
                              name="mobile"
                              value={formData.mobile}
                              onChange={handleChange}
                              className="input_type"
                              required
                            />
                          </div>
                          <div className="col-md-4">
                            <label htmlFor="state">State:</label>
                            <input
                              type="text"
                              id="state"
                              name="state"
                              value={formData.state}
                              onChange={handleChange}
                              required
                            />
                          </div>
                        </div>
                        <div className="row mb-3">
                          <div className="col-md-4">
                            <label htmlFor="city">City:</label>
                            <input
                              type="text"
                              id="city"
                              name="city"
                              value={formData.city}
                              onChange={handleChange}
                              required
                            />
                          </div>
                          <div className="col-md-4">
                            <label htmlFor="locality">Locality:</label>
                            <input
                              type="text"
                              id="locality"
                              name="locality"
                              value={formData.locality}
                              onChange={handleChange}
                              className="input_type"
                              required
                            />
                          </div>
                        </div>
                        <div className="row mb-3">
                          <div className="col-md-4">
                            <label htmlFor="pincode">Pincode Code:</label>
                            <input
                              type="text"
                              id="pincode"
                              name="pincode"
                              value={formData.pincode}
                              onChange={handleChange}
                              required
                            />
                          </div>
                          <div className="col-md-4">
                            <label htmlFor="landmark">Landmark:</label>
                            <input
                              type="text"
                              id="landmark"
                              name="landmark"
                              value={formData.landmark}
                              onChange={handleChange}
                              className="input_type"
                              required
                            />
                          </div>
                        </div>
                      </form>
                    </div>
                  </Modal.Body>
                  <Modal.Footer>
                    <Button variant="secondary" onClick={closeModal}>
                      Close
                    </Button>
                    <Button variant="primary" onClick={handleSubmit}>
                      Save
                    </Button>
                  </Modal.Footer>
                </Modal>
              </div>
            </div>
            <div
              className="col-md-6"
              style={{ width: "80%", display: "block", margin: "0 auto" }}
            >
              <div className="select-addres">
                <h5
                  className="text-center"
                  style={{
                    borderBottom: "1px solid black",
                    padding: "13px 24px",
                    fontWeight: 500,
                    textTransform: "uppercase",
                    borderRadius: "2px 2px 0 0 ",
                  }}
                >
                  Select Delivery Address
                </h5>
                <ul
                  style={{
                    overflow: "auto",
                    maxHeight: "100vw",
                    marginLeft: 5,
                  }}
                >
                  {address &&
                    address.map((address, index) => (
                      <li key={index}>
                        <input
                          type="radio"
                          id={`address-${index}`}
                          name="selectedAddress"
                          value={address.name} // or any other identifier
                          checked={selectedAddress === address}
                          style={{
                            width: "60px",
                            marginTop: "15px",
                            display: "inline-flex",
                          }}
                          onChange={() => handleAddressSelection(address)}
                        />
                        <label htmlFor={`address-${index}`}>
                          <table className="table">
                            <tbody>
                              <tr style={{ display: "inline-flex" }}>
                                <td className="delier-data">Name:</td>
                                <td>{address.name}</td>
                              </tr>
                              <tr style={{ display: "inline-flex" }}>
                                <td className="delier-data">City:</td>
                                <td>{address.city}</td>
                              </tr>
                              <tr style={{ display: "inline-flex" }}>
                                <td className="delier-data">Landmark:</td>
                                <td>{address.landmark}</td>
                              </tr>

                              <tr style={{ display: "inline-flex" }}>
                                <td className="delier-data">Pincode:</td>
                                <td>{address.pincode}</td>
                              </tr>
                              <tr style={{ display: "inline-flex" }}>
                                <td className="delier-data">State:</td>
                                <td>{address.state}</td>
                              </tr>
                              <tr style={{ display: "inline-flex" }}>
                                <td className="delier-data">Mobile:</td>
                                <td>{address.mobile}</td>
                              </tr>
                            </tbody>
                          </table>

                          <Button width="30%" colorScheme='linkedin' fontSize={10}
                            className="b"
                            style={{ margin: 0 }}
                            onClick={() => {
                              confirmAlert({
                                title: "Confirm yes or no",
                                message: "Are you sure to delete this.",
                                buttons: [
                                  {
                                    label: `Yes `,
                                    onClick: () =>
                                      deleteUserAddress(address._id),
                                  },
                                  {
                                    label: "No",
                                  },
                                ],
                              });
                            }}
                          >
                            <MdDeleteForever
                              className="delete-icon"
                              style={{ width: 150 }}
                            />
                          </Button>
                        </label>
                      </li>
                    ))}
                </ul>
                <hr />
                {selectedAddress && (
                  <div className="text-center">
                    <h2>Selected Address:</h2>
                    <table className="table table-bordered">
                      <tbody>
                        <tr>
                          <th>Name</th>
                          <td>{selectedAddress.name}</td>
                        </tr>
                        <tr>
                          <th>City</th>
                          <td>{selectedAddress.city}</td>
                        </tr>
                        <tr>
                          <th>Landmark</th>
                          <td>{selectedAddress.landmark}</td>
                        </tr>
                        <tr>
                          <th>Pincode</th>
                          <td>{selectedAddress.pincode}</td>
                        </tr>
                        <tr>
                          <th>Mobile</th>
                          <td>{selectedAddress.mobile}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </>
        ) : (
          <div className=" mb-3">
            {auth?.token ? (
              <Button width="100%" colorScheme='linkedin' fontSize={10}
                className="btn btn-outline-warning"
                onClick={() => navigate("/dashboard/user/profile")}
              >
                Update Address
              </Button>
            ) : (
              <Button width="100%" colorScheme='linkedin' fontSize={10}
                className="btn btn-outline-warning"
                onClick={() =>
                  navigate("/login", {
                    state: "/cart",
                  })
                }
              >
                Plase Login to checkout
              </Button>
            )}
          </div>
        )}
        <div
          className=" col-md-6 mt-2"
          style={{ width: "50%", display: "block", margin: "0 auto" }}
        >
          {!clientToken || !cart?.length ? (
            ""
          ) : (
            <>
              <div className="tilt-deisgn">
                <Tilt options={defaultOptions} style={{ height: "auto" }}>
                  <div
                    className="card"
                    style={{
                      width: "90%",
                      margin: "0 auto",
                      marginBottom: "15px",
                    }}
                  >
                    <div className="card-body">
                      <img
                        src="/images/addaddress.png"
                        style={{
                          width: "100%",
                          height: "auto",
                          display: "block",
                          marginBottom: "10px",
                        }}
                      />
                      <Button width="100%" colorScheme='linkedin' fontSize={10}
                        className="utton-224"
                        onClick={() => setShowAddressModal(true)}
                      >
                        Add Address
                      </Button>
                    </div>
                  </div>
                </Tilt>

                <Tilt options={defaultOptions} style={{ height: "auto" }}>
                  <div
                    className="card"
                    style={{
                      width: "90%",
                      margin: "0 auto",
                      marginBottom: "15px",
                    }}
                  >
                    {isAddressSelected ? (
                      <>
                        <div className="card-body">
                          <img
                            src="/images/payment.jpg"
                            style={{
                              width: "100%",
                              height: "auto",
                              display: "block",
                              marginBottom: "10px",
                            }}
                          />
                          <Button width="100%" colorScheme='linkedin' fontSize={10}
                            className="b"
                            onClick={() => setShowPaymentModal(true)}
                            disabled={!isAddressSelected} // Disable the button if an address is not selected
                          >
                            Select Payment Method
                          </Button>
                        </div>
                      </>
                    ) : (
                      <>
                        <h6 className="text-center" style={{ padding: "10px" }}>
                          Please Select you Shipping Address for Complete your
                          Payment
                        </h6>
                        <Hourglass
                          visible={true}
                          height="60"
                          width="60"
                          ariaLabel="hourglass-loading"
                          wrapperStyle={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            margin: "0 auto",
                            padding: "5px",
                            height: "100px",
                          }}
                          wrapperClass=""
                          colors={["#306cce", "#72a1ed"]}
                        />
                      </>
                    )}
                  </div>
                </Tilt>
              </div>
              <Modal
                show={showPaymentModal}
                onHide={() => setShowPaymentModal(false)}
              >
                {/* ... other modal content ... */}
                {/* <div className="text-center"> */}
                <h5 className="text-center" style={{ marginTop: "20px" }}>
                  Choose a payment show on below
                </h5>
                <Button width="100%" colorScheme='linkedin' fontSize={10}
                  className="b"
                  style={{ width: "80%", margin: "auto", display: "block" }}
                  onClick={() => setShowPaymentModal(false)}
                >
                  Cancel Your Payment
                </Button>
                <hr />
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <Tilt
                    options={defaultOptions}
                    style={{ height: "auto", width: "100%" }}
                  >
                    <div
                      className="card"
                      style={{ width: "10rem", marginLeft: "50px" }}
                    >
                      <div className="card-body">
                        <img
                          src="/images/online-payments.jpg"
                          style={{
                            width: "100%",
                            height: "80px",
                            display: "block",
                            marginBottom: "10px",
                          }}
                        />
                        <Button width="100%" colorScheme='linkedin' fontSize={10}
                          className="text-center "
                          onClick={() => setSelectedPaymentMethod("online")}
                        >
                          ONLINE
                        </Button>
                      </div>
                    </div>
                  </Tilt>

                  <Tilt
                    options={defaultOptions}
                    style={{ height: "auto", width: "100%" }}
                  >
                    <div
                      className="card"
                      style={{
                        width: "10rem",
                        marginLeft: "40px",
                        marginBottom: "20px",
                      }}
                    >
                      <div className="card-body">
                        <img
                          src="/images/cod.png"
                          style={{
                            width: "100%",
                            height: "80px",
                            display: "block",
                            marginBottom: "10px",
                          }}
                        />
                        <Button width="100%" colorScheme='linkedin' fontSize={10}
                          className="text-center "
                          onClick={() => setSelectedPaymentMethod("COD")}
                        >
                          COD
                        </Button>
                      </div>
                    </div>
                  </Tilt>
                </div>

                {/* Render content based on selected payment method */}
                {selectedPaymentMethod === "online" && (
                  <>
                    <DropIn
                      options={{
                        authorization: clientToken,
                        paypal: {
                          flow: "vault",
                        },
                      }}
                      onInstance={handleDropInReady}
                      onError={onErrorDropInInitialization}
                    />
                    <Button width="100%" colorScheme='linkedin' fontSize={10}
                      className="text-center "
                      style={{
                        width: "80%",
                        margin: "auto",
                        display: "block",
                        marginBottom: "10px",
                      }}
                      onClick={handlePayment}
                      disabled={
                        !clientToken ||
                        loading ||
                        !instance ||
                        !auth?.user?.address ||
                        amount <= 0 ||
                        !selectedAddress
                      }
                    >
                      {loading ? "Processing ...." : "Make Payment"}
                    </Button>
                  </>
                )}

                {selectedPaymentMethod === "COD" && (
                  <Button width="100%" colorScheme='linkedin' fontSize={10}
                    className="text-center"
                    style={{
                      width: "80%",
                      margin: "auto",
                      display: "block",
                      marginBottom: "10px",
                    }}
                    onClick={handlePayment}
                    disabled={
                      !auth?.user?.address || amount <= 0 || !selectedAddress
                    }
                  >
                    Confirm COD Order
                  </Button>
                )}
              </Modal>
            </>
          )}
        </div>
      </div>
    </Layout>
  );
}

export default PaymentPage;
