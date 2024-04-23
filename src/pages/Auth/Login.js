import React, { useState } from "react";
import axios from "axios";
import { useNavigate, useLocation, NavLink } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "../../styles/AuthStyles.css";
import { useAuth } from "../../context/auth";
import * as mod from "./../../url";
import { Layout } from "antd";
import TopHeader from "../../components/Layout/TopHeader";
import FooterArea from "../../components/Layout/FooterArea";
import "react-toastify/dist/ReactToastify.css";
import { FaRegEyeSlash } from "react-icons/fa6";
import { FaEye } from "react-icons/fa";
import {
  Box,
  Button,
  Container,
  FormControl,
  InputRightElement,
  FormLabel,
  Image,
  Input,
  InputGroup,
  Text,
  VStack,
} from "@chakra-ui/react";

const Login = () => {
  const [phoneOrEmail, setPhoneOrEmail] = useState("");
  const [password, setPassword] = useState("");
  const [auth, setAuth] = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [show, setShow] = useState(false);
  // const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // function validatephone(phoneOrEmail) {
  //     var regex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
  //     return regex.test(phoneOrEmail);
  //   };

  const handleClick = () => setShow(!show);

  const handleTogglePassword = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${mod.api_url}/api/v1/auth/login`, {
        phoneOrEmail,
        password,
      });
      if (res && res.data.success) {
        toast.success(res.data.message || "Login success full");

        setAuth({
          ...auth,
          user: res.data.user,
          token: res.data.token,
        });
        localStorage.setItem("auth", JSON.stringify(res.data));
        navigate(location.state || "/");
      } else {
        toast.error(res.data.message, "wrong your password or user");
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message, "Something went wrong");
    }
  };

  return (
    <>
      <TopHeader />
      <div className="login_page">
        <div className="wrapper">
          <div className="title_head">Login Form</div>
          <form onSubmit={handleSubmit}>
            <Box height="60px">
              <FormControl id="email" isRequired>
                <Input
                  placeholder="Email/Phone"
                  type="text"
                  autoFocus
                  value={phoneOrEmail}
                  onChange={(e) => setPhoneOrEmail(e.target.value)}
                  id="outlined-basic"
                  label="mobile/Email"
                  variant="outlined"
                  required
                  onclick="validatephone(document.form1.text1)"
                  height="50px"
                  borderRadius="30px"
                />
              </FormControl>
            </Box>
            <Box height="60px">
              <FormControl id="email" isRequired>
                <InputGroup>
                  <Input
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    id="outlined-basic"
                    label="Password"
                    variant="outlined"
                    required
                    height="50px"
                    borderRadius="30px"
                    type={show ? "text" : "password"}
                  />
                  <InputRightElement
                    width="20%"
                    height="80%"
                    marginRight="12px"
                    marginTop="6px"
                  >
                    <Button h="100%" onClick={handleClick}>
                      {show ? "Hide" : "Show"}
                    </Button>
                  </InputRightElement>
                </InputGroup>
              </FormControl>
            </Box>

            <div className="content">
              <div className="checkbox">
                <input type="checkbox" id="remember-me" />
                <label for="remember-me">Remember me</label>
              </div>
              <div
                className="pass-link"
                type="button"
                onClick={() => {
                  navigate("/forgot-password");
                }}
              >
                <NavLink to="/forgot-password">Forgot password?</NavLink>
              </div>
            </div>
            <div className="field">
              <input type="submit" value="Login" />
            </div>
            <hr />
            <div className="signup-link">
              Not a member? <NavLink to="/register">Signup now</NavLink>
            </div>
          </form>
        </div>
        <ToastContainer />
      </div>
      <FooterArea />
    </>
  );
};

export default Login;
