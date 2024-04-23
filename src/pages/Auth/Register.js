import React, { useState } from "react";
import Layout from "./../../components/Layout/Layout";
import axios from "axios";
import { useNavigate, NavLink } from "react-router-dom";
import toast from "react-hot-toast";
import "../../styles/AuthStyles.css";
import * as mod from "./../../url";
import TopHeader from "../../components/Layout/TopHeader";
import FooterArea from "../../components/Layout/FooterArea";
import Modal from "react-modal";
import { Box, Input, Button } from "@chakra-ui/react";


const Register = () => {
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
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

  const generateOTP = async () => {
    if (formData.phone.length !== 10) {
      return toast.error("Invalid phone number");
    }

    try {
      const res = await axios.post(`${mod.api_url}/api/v1/auth/generate-otp`, {
        phone: formData.phone,
        email: formData.email,
        mode: "new user", // Set your desired mode
      });
      toast.success("OTP sent on mobile & email");
    } catch (error) {
      console.error(error);
      toast.error("Error while sending OTP");
    }
  };

  const isValidForm = () => {
    const { name, email, password, phone, otp } = formData;
    const nameRegex = /^[A-Za-z\s]+$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
    const phoneRegex = /^([+]\d{2}[ ])?\d{10}$/;
    const otpRegex = /^([+]\d{2}[ ])?\d{6}$/;

    const newErrors = {};

    if (!name.match(nameRegex)) {
      newErrors.name = "Please enter a valid name.";
    }

    if (!email.match(emailRegex)) {
      newErrors.email = "Please enter a valid email address.";
    }

    if (!password.match(passwordRegex)) {
      newErrors.password = "Wrong format of password.";
    }

    if (!phone.match(phoneRegex)) {
      newErrors.phone = "Please enter a valid phone number.";
    }
    if (!otp.match(otpRegex)) {
      newErrors.otp = "Please enter a valid otp number.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isValidForm()) {
      try {
        const res = await axios.post(
          `${mod.api_url}/api/v1/auth/register`,
          formData
        );
        if (res && res.data.success) {
          toast.success(res.data.message);
          setTimeout(() => {
            navigate("/login");
          }, 2000);
        } else {
          toast.error(res.data.message);
        }
      } catch (error) {
        console.error(error);
        toast.error("Something went wrong");
      }
    } else {
      toast.error("Fill the form correctly");
    }
  };

  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const doubleClicked = () => {
    if (!formData.name || !formData.email || !formData.password || !formData.phone) {
      toast({
        title: 'Fill all the Input',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return;
    }
    generateOTP();
    openModal();
  };
  


  return (
    <>
    <TopHeader />
      <div className="register_page">
        <div className="register_wrapper">
          <div className="form">
            <h4 className="title">REGISTER FORM</h4>

            <div className="field">
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter Your Name"
                // label="Name"
                variant="outlined"
                error={!!errors.name}
                helperText={errors.name}
              />
            </div>
            <div className="field">
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                label="Email"
                variant="outlined"
                placeholder="Enter Your email"
                error={!!errors.email}
                helperText={errors.email}
              />
            </div>
            <div className="field">
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                label="Password"
                variant="outlined"
                placeholder="Enter Your password"
                error={!!errors.password}
                helperText={errors.password}
              />
            </div>
            <div className="field">
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                label="Phone"
                variant="outlined"
                placeholder="Enter Your mobile"
                error={!!errors.phone}
                helperText={errors.phone}
              />
            </div>



<div className="col-12" style={{ marginTop: "6px" }}>
  <input
    type="submit"
    className="submit_btn"
    value="Generate OTP"
    onClick={doubleClicked}
    style={{
      height: "40px",
      width: "75%",
      marginLeft: "50px",
      marginTop: "10px",
      borderRadius: "30px"
    }}
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
    overlay: {
      background: "rgba(0, 0, 0, 0.5)"
    }
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
      placeholder="OTP"
      error={!!errors.otp}
      helperText={errors.otp}
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










            {/* </div> */}
            <hr />
            <div className="col-6 Register_Header">
              <NavLink to="/login" className="nav-link">
                <span>Existing customer</span>
                <span style={{ color: "blue", margin: 5 }}>Login Here</span>
              </NavLink>
            </div>
          </div>
        </div>
      </div>
      <FooterArea />
      </>
  );
};

export default Register;
