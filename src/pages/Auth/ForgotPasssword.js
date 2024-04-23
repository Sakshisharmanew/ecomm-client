import React, { useState } from "react";
import Layout from "./../../components/Layout/Layout";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import "../../styles/AuthStyles.css";
import * as mod from "./../../url";
import FooterArea from "../../components/Layout/FooterArea";
import TopHeader from "../../components/Layout/TopHeader";
import Modal from "react-modal";
import { Box, Input } from "@chakra-ui/react";
import { Button } from "antd";
import { useToast } from "@chakra-ui/react";

const ForgotPasssword = () => {
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const toast = useToast();
  const [showOTPModal, setShowOTPModal] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    newPassword: "",
    phone: "",
    otp: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // form function
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${mod.api_url}/api/v1/auth/forgot-password`,
        formData
      );
      if (res && res.data.success) {
        toast.success(res.data && res.data.message);

        navigate("/login");
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
    // finally {
    //   closeModal();
    // }
  };
  const generateOTP = async () => {
    if (formData.phone.length !== 10) {
      return toast.error("Invalid phone number");
    }

    try {
      const res = await axios.post(`${mod.api_url}/api/v1/auth/generate-otp`, {
        phone: formData.phone,
        email: formData.email,
        mode: "reset password", // Set your desired mode
      });
      toast.success("OTP sent successfully");
    } catch (error) {
      console.error(error);
      toast.error("Error while sending OTP");
    }
  };

  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const doubleClick = () => {
    if (!formData.phone || !formData.email || !formData.newPassword) {
      toast({
        title: "Fill the all Input",
        status: "success",
        duration: 9000,
        isClosable: true,
      });
    }
    generateOTP();
    openModal();
  };

  return (
    <>
      <TopHeader />
      <div className="login_page">
        <div className="wrapper">
          <div className="title_head">Reset Password</div>
          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-6">
                <div className="field">
                  <input
                    type="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="form-control"
                    id="exampleInputEmail1"
                    placeholder=" Resigterd Mobile"
                    required
                  />
                </div>
              </div>
              <div className="col-6">
                <div className="field">
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="form-control"
                    id="exampleInputEmail1"
                    placeholder="Resigterd Email"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-6">
                <div className="field">
                  <input
                    type="password"
                    name="newPassword"
                    value={formData.newPassword}
                    onChange={handleChange}
                    className="form-control"
                    id="exampleInputPassword1"
                    placeholder="new Password"
                    required
                  />
                </div>
              </div>
              <div className="col-6">
                <div className="field">
                  <input
                    type="submit"
                    className="submit_btn"
                    value="Gernate OTP"
                    onClick={doubleClick}
                  />
                </div>
                <Modal
                  isOpen={modalIsOpen}
                  onRequestClose={closeModal}
                  contentLabel="OTP Modal"
                  style={{
                    content: {
                      width: "50%",
                      height: "200px",
                      margin: "auto",
                      border: "1px solid #ccc",
                      background: "#fff",
                      overflow: "hidden",
                      borderRadius: "8px",
                    },
                  }}
                >
                  <Box display="flex" marginBottom="10px">
                    <Input
                      type="text"
                      name="otp"
                      value={formData.otp}
                      onChange={handleChange}
                      label="OTP"
                      variant="outlined"
                      placeholder=" OTP"
                      height="30px"
                    />
                  </Box>

                  <div className="row">
                    <Button
                      style={{ marginTop: "10px", marginBottom: "10px" }}
                      onClick={handleSubmit}
                    >
                      Submit
                    </Button>
                    <Button onClick={closeModal}>Close Modal</Button>
                  </div>
                </Modal>
              </div>
            </div>

            <hr />

            <div className="signup-link">
              <Link to="/Login">Login</Link>
            </div>
          </form>
        </div>
      </div>
      <FooterArea />
    </>
  );
};

export default ForgotPasssword;
