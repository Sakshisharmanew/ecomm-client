import React, { useState, useEffect } from "react";
import { Layout } from "antd";
import axios from "axios";
import * as mod from "./../../url.js";
import { useAuth } from "../../context/auth";
import "./../../styles/OrdersDetails.css";
import { PiHandCoinsBold } from "react-icons/pi";
import { FaUsers } from "react-icons/fa";
import { FcCallTransfer } from "react-icons/fc";
import { FcShare } from "react-icons/fc";
import TopHeader from "../../components/Layout/TopHeader.js";
import FooterArea from "../../components/Layout/FooterArea";
import ProgressBar from "react-bootstrap/ProgressBar";
import { MDBRow, MDBCol } from "mdb-react-ui-kit";
import { useNavigate, useParams } from "react-router-dom";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import { Box, Button, Heading, Image, StackDivider, Text } from "@chakra-ui/react";
import { Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react";
import {  Modal } from "antd";
import BillPreview from "./BillPreview.js";
import { Card, CardHeader, CardBody, CardFooter } from '@chakra-ui/react'

const iconStyle = {
  color: "green",
  marginRight: "10px",
  display: "block",
  margin: "auto",
  width: "40px",
  height: "40px",
};

function OrdersDetails() {
  const [orders, setOrders] = useState(null);
  const navigate = useNavigate();
  // const { orderId } = useParams();
  const [auth, setAuth] = useAuth();
  const params = useParams();
  const [copied, setCopied] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isPreviewModalVisible, setIsPreviewModalVisible] = useState(false);

  const { _id: orderId } = params;

  const getOrders = async () => {
    try {
      const { data } = await axios.get(
        `${mod.api_url}/api/v1/auth/orders/${orderId}`
      );
      setOrders(data);
    } catch (error) {
      console.log(error);
    }
  };

  const cencelorder = async () => {
    try {
      confirmAlert({
        title: "Confirm Order Cancellation",
        message: "Are you sure you want to cancel this order?",
        buttons: [
          {
            label: "Yes",
            onClick: async () => {
              try {
                const { data } = await axios.put(
                  `${mod.api_url}/api/v1/auth/orderCancel/${orderId}/canceled`
                );
                setOrders(data);
              } catch (error) {
                console.error("Error on order cancellation:", error);

                if (error.response) {
                  // The request was made and the server responded with a status code
                  console.error(
                    "Server responded with status code:",
                    error.response.status
                  );
                  console.error("Server response data:", error.response.data);
                } else if (error.request) {
                  // The request was made but no response was received
                  console.error("No response received from the server");
                } else {
                  // Something happened in setting up the request that triggered an Error
                  console.error("Error setting up the request:", error.message);
                }
              }
            },
          },
          {
            label: "No",
            onClick: () => console.log("Cancellation canceled"),
          },
        ],
      });
    } catch (error) {
      console.error("Error on cancel confirmation:", error);
    }
  };

  useEffect(() => {
    if (auth?.token) getOrders();
  }, [auth?.token]);

  const copyOrderId = () => {
    const orderIdText = orders._id;

    const tempInput = document.createElement("input");

    tempInput.value = orderIdText;

    document.body.appendChild(tempInput);

    tempInput.select();

    document.execCommand("copy");
    document.body.removeChild(tempInput);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  const handleView = (orders) => {
    setSelectedOrder(orders);
    setIsPreviewModalVisible(true);
  };

  const handlePrint = () => {
    const printContent = document.getElementById("bill-preview");

    if (printContent) {
      const printWindow = window.open("", "_blank");
      printWindow.document.write(
        "<html><head><title>Print</title></head><body>"
      );
      printWindow.document.write(printContent.innerHTML);
      printWindow.document.write("</body></html>");
      printWindow.document.close();
      printWindow.print();
    } else {
      console.error("Element with ID 'bill-preview' not found");
    }
  };

  const handleClosePreviewModal = () => {
    setIsPreviewModalVisible(false);
  };

  return (
    <>
      <TopHeader />
      <Layout title={"Order Details"}>
        <h1 className="text-center">Order Details</h1>
        {orders ? (
          <>
            <p className="text-center">
              Order ID: {orders._id}
              <Button colorScheme="blue" marginLeft="5px" onClick={copyOrderId}>
                Copy
              </Button>
              {copied && (
                <span style={{ marginLeft: "0.5rem", color: "green" }}>
                  Copied!
                </span>
              )}
            </p>
            {/* <p>Order Date: {moment(orders.createdAt).format('MMMM Do YYYY')}</p> */}
            {/* ... other order details */}
          </>
        ) : (
          <p>Loading order details...</p>
        )}
        <Box p={1} width="100%" display="flex">
          <Tabs isFitted variant="enclosed" width="100%">
            <TabList mb="1em">
              <Tab>Delivery Address</Tab>
              <Tab>Your Rewards</Tab>
              <Tab>More actions</Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                <Box width="100%" textAlign="center">
                  <Text>
                    <div style={{ textAlign: "center" }}>
                      <FaUsers style={iconStyle} />
                    </div>

                    <strong>{orders?.shipinginfo?.name}</strong>
                  </Text>
                  <Text>
                    landmark- {orders?.shipinginfo?.landmark} <br />
                    State- {orders?.shipinginfo?.state} <br />
                    city- {orders?.shipinginfo?.city}
                    <br />
                    locality- {orders?.shipinginfo?.locality}
                    <br />
                    Pincode- {orders?.shipinginfo?.pincode}
                  </Text>
                  <Text>
                    <div style={{ textAlign: "center" }}>
                      <FcCallTransfer style={iconStyle} />
                    </div>
                    <strong>Phone Number</strong>
                  </Text>
                  <Text>{orders?.shipinginfo?.mobile}</Text>
                </Box>
              </TabPanel>
              <TabPanel>
                <Box>
                  <div style={{ textAlign: "center" }}>
                    <PiHandCoinsBold style={iconStyle} />
                  </div>
                  <Text textAlign="center">0 SuperCoins Cashback</Text>
                  <Text className="text-center">
                    Use it to save on your next order
                  </Text>
                  <Box textAlign="center">
                    {orders?.orderItems.map((itme, index) => (
                      <>
                        {(() => {
                          let dashedString = itme.name.replace(
                            /(\s{1}|\s{2,3})/g,
                            "-"
                          ); // Replace 2 or more spaces with a dash

                          // Remove dash at the end if present
                          if (dashedString.endsWith("-")) {
                            dashedString = dashedString.slice(0, -1);
                          }
                          return (
                            <>
                              <Box
                                onClick={() =>
                                  navigate(`/product/${dashedString}/`)
                                }
                                style={{ color: "blue", cursor: "pointer" }}
                              >
                    

                             
                              <Card
  direction={{ base: 'column', sm: 'row' }}
  overflow='hidden'
  variant='outline'
  width="100%"
>
  <Image
  src={require(`./../../img/produtImg/${itme?.image}`)}
    objectFit='cover'
    width="100%"
    height="250px"
    // maxW={{ base: '100%', sm: '100px' }}

  />

  <StackDivider>
    <CardBody>
      <Heading size='md'>Product: {itme.name.slice(0, 40)}</Heading>

      <Text py='2'>
      Quantity: {itme.quantity}
      </Text>
      <Text py='2'>
      Price: {itme.price}
      </Text>
      <Text py='2'>
      Total Price: {itme.totalPrice}
      </Text>
    </CardBody>
  </StackDivider>
</Card>
 </Box>
                            </>
                          );
                        })()}
                      </>
                    ))}
                  </Box>
                </Box>
              </TabPanel>

              <TabPanel>
                <Box textAlign="center">
                  <div style={{ textAlign: "center" }}>
                    <FcShare style={iconStyle} />
                    <Text>Manage your Order</Text>{" "}
                  </div>
                  {orders?.status?.toLowerCase() === "deliverd" ? (
                    <>
                      <Button
                        colorScheme="blue"
                        type="button"
                        width="48%"
                        className=""
                      >
                        Return
                      </Button>
                    </>
                  ) : (
                    <Button
                      colorScheme="red"
                      marginLeft="5px"
                      type="button"
                      width="40%"
                      className=""
                      onClick={cencelorder}
                    >
                      Cancel
                    </Button>
                  )}
                  <Button
                    width="40%"
                    marginLeft={1}
                    colorScheme="blue"
                    onClick={handlePrint}
                  >
                    Download Invoice
                  </Button>
                  <Button
                    className="button"
                    onClick={() => handleView(orders)}
                    style={{ marginRight: 5 }}
                  >
                    View
                  </Button>
                </Box>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Box>

        <Box width="100%" display="flex">
          <Box p={2} width="100%">
            <p
              className="text-center lead fw-bold mb-4 pb-2"
              style={{ color: "#f37a27" }}
            >
              Tracking Order
            </p>
            <MDBRow>
              <MDBCol lg="6" style={{ width: "100%", margin: "0 auto" }}>
                <div className="horizontal-timeline">
                  <ProgressBar
                    now={
                      orders?.status?.toLowerCase() === "processing"
                        ? 20
                        : orders?.status?.toLowerCase() === "shipped"
                        ? 50
                        : orders?.status?.toLowerCase() === "deliverd"
                        ? 100
                        : orders?.status?.toLowerCase() === "canceled"
                        ? 100
                        : 5
                    }
                    variant={
                      orders?.status?.toLowerCase() === "canceled"
                        ? "danger"
                        : "success"
                    }
                    style={{
                      height: "6px",
                      marginBottom: "5px",
                      border: "1px solid green",
                      background:
                        orders?.status?.toLowerCase() === "deliverd"
                          ? "green"
                          : "inherit",
                    }}
                  />

                  <ul
                    className="list-inline items d-flex justify-content-between"
                    style={{
                      listStyle: "none",
                      marginTop: 10,
                      padding: 0,
                      marginRight: 10,
                    }}
                  >
                    <li className="list-inline-item items-list">
                      <p
                        className="py-1 px-2 rounded text-white"
                        style={{
                          backgroundColor:
                            orders?.status?.toLowerCase() === "processing"
                              ? "#f37a27"
                              : "grey",
                        }}
                      >
                        processing
                      </p>
                    </li>
                    {orders?.status?.toLowerCase() !== "canceled" && (
                      <>
                        <li className="list-inline-item items-list">
                          <p
                            className="py-1 px-2 rounded text-white"
                            style={{
                              backgroundColor:
                                orders?.status?.toLowerCase() === "shipped"
                                  ? "#f37a27"
                                  : "grey",
                            }}
                          >
                            Shipped
                          </p>
                        </li>
                        <li
                          className="list-inline-item items-list text-end"
                          style={{ marginRight: "-8px" }}
                        >
                          <p
                            className="py-1 px-2 rounded text-white"
                            style={{
                              backgroundColor:
                                orders?.status?.toLowerCase() === "deliverd"
                                  ? "#f37a27"
                                  : "grey",
                            }}
                          >
                            deliverd
                          </p>
                        </li>
                      </>
                    )}
                    {orders?.status?.toLowerCase() === "canceled" && (
                      <li className="list-inline-item items-list">
                        <p
                          className="py-1 px-2 rounded text-white"
                          style={{
                            backgroundColor: "#f37a27",
                          }}
                        >
                          canceled
                        </p>
                      </li>
                    )}
                  </ul>
                </div>
              </MDBCol>
            </MDBRow>
          </Box>
        </Box>
        <Modal
          title="Bill Preview"
          open={isPreviewModalVisible} // Use 'open' instead of 'visible'
          onCancel={handleClosePreviewModal}
          footer={null}
          width="80%"
          style={{ top: 20 }}
        >
          {selectedOrder && (
            <div style={{ height: "auto", overflowY: "auto" }}>
              <BillPreview order={selectedOrder} />
            </div>
          )}
        </Modal>
      </Layout>
      <FooterArea />
    </>
  );
}

export default OrdersDetails;
