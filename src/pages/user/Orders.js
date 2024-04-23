import React, { useState, useEffect } from "react";
import UserMenu from "../../components/Layout/UserMenu";
import Layout from "./../../components/Layout/Layout";
import axios from "axios";
import { useAuth } from "../../context/auth";
import moment from "moment";
import * as mod from "./../../url.js";
import "./../../styles/order.css";
import "./star.css";
import { Modal } from "react-bootstrap";
// import ExternalInfo from "components/ExternalInfo";
import Box from "@mui/material/Box";
import toast from "react-hot-toast";
import { useCurrency } from "../../context/CurrencyChange.js";
import { Link, useNavigate } from "react-router-dom";
import Star from "./star.js";
import {
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
  Button,
} from '@chakra-ui/react'


const Orders = () => {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();
  const { selectedCurrency } = useCurrency();
  const [showModal, setShowModal] = useState(false);
  const [productIdInModal, setProductIdInModal] = useState(null);
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(0);
  const [images, setImages] = useState([]);
  const [auth] = useAuth();
  const [isModalOpen, setModalOpen] = useState(false);
  const [asModalOpen, setAsModalOpen] = useState(false);
  const [selectedProductIndex, setSelectedProductIndex] = useState(null);


  const handleCloseModal = () => {
    setSelectedProductIndex(null);
    setModalOpen(false);
  };
  const handleStarClick = (index) => {
    setRating(index + 1); // Rating is index + 1 (since index is zero-based)
  };

  const stars = Array.from({ length: 5 }, (_, index) => (
    <Star
      key={index}
      filled={index < rating}
      onClick={() => handleStarClick(index)}
    />
  ));

  const selectedProduct =
    selectedProductIndex !== null ? orders[selectedProductIndex] : null;
  const selectedOrder = selectedProduct !== null ? selectedProduct : null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (!rating || isNaN(parseFloat(rating))) {
        toast.error("Please provide a valid rating.");
        return;
      }
      const formData = new FormData();
      formData.append("comment", comment);
      formData.append("rating", rating);

      for (let i = 0; i < images.length; i++) {
        formData.append("images", images[i]);
      }

      const response = await axios.post(
        `${mod.api_url}/api/v1/product/${productIdInModal}/addreviews`,
        formData
      );

      const data = response.data;

      if (response.status === 200) {
        // onReviewAdded();
        console.log("Review added successfully");
        toast.success(data.message || "Review added successfully");
        setComment("");
        setRating(0);
        setImages([]);
        closeModal();
      } else {
        // Handle errors
        console.error("Failed to add review:", data.message);
        toast.error("Failed to add review:", data.message);
      }
    } catch (error) {
      toast.error("Error adding review:", error.message);
    }
  };

  const getOrders = async () => {
    try {
      const { data } = await axios.get(`${mod.api_url}/api/v1/auth/orders`);
      setOrders(data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  useEffect(() => {
    if (auth?.token) getOrders();
  }, [auth?.token]);

  const openModal = (productId) => {
    setProductIdInModal(productId);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const handleImageChange = (e) => {
    const selectedImages = Array.from(e.target.files);
    setImages(selectedImages);
  };

  const handleImageClick = (orderId) => {
    navigate(`/dashboard/user/orders/${orderId}`);
  };

  const handleTrackOrderClick = () => {
    setAsModalOpen(true);
    console.log("Clicked track button");
  };

  useEffect(() => {
    console.log("Modal state changed:", asModalOpen);
  }, [asModalOpen]);

  const closeModals = () => {
    setAsModalOpen(false);
  };

  return (
    <Layout title={"Your Orders"}>
     <Box width="100%"  display="flex">
        <UserMenu />
        </Box>
        <div
          className="col-md-12"
          style={{
            overflowY: "auto",
            display: "flex",
            flexDirection: "row",
            flexWrap: "nowrap",
          }}
        >
          <div
            className="table-container"
            style={{ overflowY: "auto", width: "100%" }}
          >
            <h1 className="text-center">All Orders</h1>

            {orders?.map((o, orderIndex) => (
        <div key={orderIndex}>
          <div className="border shadow" key={orderIndex}>
            {o?.products?.map((p, productIndex) => (
              <>
                <Link key={orderIndex} to={o._id}>
                  <Table
                    variant="striped"
                    colorScheme="teal"
                    size="sm"
                    key={orderIndex}
                    onClick={() => handleImageClick(o._id)}
                  >
                    <Thead>
                      <Tr>
                        <Th scope="col">S.No</Th>
                        <Th scope="col">Image</Th>
                        <Th scope="col">Product</Th>
                        <Th scope="col">Date</Th>
                        <Th scope="col">Payment</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      <Tr
                        key={productIndex}
                        onClick={() => handleImageClick(orderIndex)}
                        style={{ cursor: "pointer" }}
                      >
                        <Td>{orderIndex * o.products.length + productIndex + 1}</Td>
                        <Td className="">
                          <img
                            src={require(`./../../img/produtImg/${p?.images[0]?.filename}`)}
                            className="orderImage"
                            alt={p.name.slice(0, 15)}
                            width="20px"
                            height="100px"
                          />
                        </Td>
                        <Td>{p.name.slice(0, 15)}</Td>
                        <Td>
                          {o?.createdAt
                            ? moment(o.createdAt).format("MMMM Do YYYY")
                            : "N/A"}
                        </Td>
                        <Td
                          style={
                            o?.paymentMethod === "online"
                              ? { fontWeight: "bold", color: "green" }
                              : { fontWeight: "bold", color: "red" }
                          }
                        >
                          {o?.paymentMethod}
                        </Td>
                      </Tr>
                    </Tbody>
                  </Table>
                </Link>

                <div className="container">
                  <h1>{o?.buyer?.address?.name}</h1>
                </div>
                {o.status === "deliverd" ? (
                  <>
                  
                    <div className="mb-3 text-center ">
                      <div>
                        <button
                          className="btn btn-outline-primary"
                          key={p._id}
                          onClick={() => openModal(p._id)}
                        >
                          Rate & Review your product
                        </button>
                        <Modal show={showModal} onHide={closeModal}>
                          <Modal.Header closeButton>
                            <Modal.Title>Add your Review</Modal.Title>
                          </Modal.Header>
                          <Modal.Body>
                            <div className="container mt-5">
                              <form className="">
                                <div className="row mb-12">
                                  <div className="row mb-12">
                                      <label>
                                        Images:
                                        <input
                                          type="file"
                                          accept="image/*"
                                          multiple
                                          onChange={handleImageChange}
                                        />
                                      </label>
                                  </div>
                                  <Box
                                    spacing={1}
                                    sx={{
                                      "& > legend": {
                                        marginTop: 2,
                                      },
                                    }}
                                  >
                                    <div className="text-center" style={{background:"white"}}>
                                      {stars}
                                    </div>
                                  </Box>
                                </div>
                                <div className="row mb-12">
                                    <label>
                                      Comment:
                                      <textarea
                                        style={{
                                          width: "100%",
                                          height: "auto",
                                          border: "1px solid",
                                        }}
                                        value={comment}
                                        onChange={(e) =>
                                          setComment(e.target.value)
                                        }
                                      />
                                    </label>
                                </div>
                              </form>
                            </div>
                          </Modal.Body>
                          <Modal.Footer>
                          <Button colorScheme='red' onClick={closeModal} width="45%">close</Button>
                            <Button
                              colorScheme='green'
                              onClick={handleSubmit}
                              width="49%"
                            >
                              Save
                            </Button>
                          </Modal.Footer>
                        </Modal>
                      </div>
                    </div>
                  </>
                ) : (
                  ""
                )}
              </>
            ))}
          </div>
        </div>
      ))}

            </div>
          </div>
    </Layout>
  );
};

export default Orders;
