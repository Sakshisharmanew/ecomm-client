import React, { useState, useEffect } from "react";
import UserMenu from "../../components/Layout/UserMenu";
import Layout from "./../../components/Layout/Layout";
import { useAuth } from "../../context/auth";
import toast from "react-hot-toast";
import axios from "axios";
import { confirmAlert } from "react-confirm-alert";
// import input from "@mui/material/input";
import { useNavigate } from "react-router-dom";
import "../../styles/dashboard.css";
import * as mod from "./../../url";
import { Box } from "@chakra-ui/react";

const Profile = () => {
  const navigate = useNavigate();
  const [auth, setAuth] = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [pincode, setPincode] = useState("");
  const [locality, setLocality] = useState("");
  const [states, setStates] = useState("");
  const [landmark, setLandmark] = useState("");
  const [city, setCity] = useState("");

  //get user data
  useEffect(() => {
    const { email, name, phone, pincode, locality, states, landmark, city } =
      auth?.user;
    setName(name);
    setPhone(phone);
    setEmail(email);
    // setAddress(address);
    setPincode(pincode);
    setLocality(locality);
    setStates(states);
    setLandmark(landmark);
    setCity(city);
  }, [auth?.user]);

  // form function
  const handleSubmit = async (e) => {
    e.preventDefault();
    confirmAlert({
      title: "Confirm yes or no",
      message: "Are you sure to update your details.",
      buttons: [
        {
          label: `Yes `,
          onClick: async () => {
            try {
              const { data } = await axios.put(
                `${mod.api_url}/api/v1/auth/profile`,
                {
                  name,
                  email,
                  password,
                  phone,
                  pincode,
                  locality,
                  states,
                  landmark,
                  city,
                  address,
                }
              );
              if (data?.errro) {
                toast.error(data?.error);
              } else {
                setAuth({ ...auth, user: data?.updatedUser });
                let ls = localStorage.getItem("auth");
                ls = JSON.parse(ls);
                ls.user = data.updatedUser;
                localStorage.setItem("auth", JSON.stringify(ls));
                toast.success("Profile Updated Successfully");
                navigate("/dashboard/user");
              }
            } catch (error) {
              console.log(error);
              toast.error("Something went wrong");
            }
          },
        },
        {
          label: "No",
        },
      ],
    });
  };

  return (
    <div className="special_margin">
      <Layout title={"Your Profile"}>
      <Box width="100%"  display="flex">
        <UserMenu />
        <Box width="95%" display="flex" >

        </Box>
        </Box>
        <div className="row">
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
              className="form-container "
              style={{ marginTop: "-40px", width: "100%" }}
            >
              <form onSubmit={handleSubmit} className="form-size">
                <h4 className="text-center title ">USER PROFILE</h4>
                <div className="row">
                  <div className="col-6">
                    <div className="mb-3 mt-2">
                      <input
                        id="outlined-required"
                        label="NAME"
                        variant="outlined"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="form-control"
                        placeholder="Enter Your Name"
                        autoFocus
                      />
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="mb-3 mt-2">
                      <input
                        id="outlined-basic"
                        label="Email"
                        variant="outlined"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="form-control"
                        placeholder="Enter Your Email"
                        disabled
                      />
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-6">
                    <div className="mb-3 mt-2">
                      <input
                        id="outlined-basic"
                        label="Password"
                        variant="outlined"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="form-control"
                        placeholder="Your Password"
                        disabled
                      />
                    </div>
                  </div>

                  <div className="col-6">
                    <div className="mb-3 mt-2">
                      <input
                        id="outlined-basic"
                        label="mobile"
                        variant="outlined"
                        type="number"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="form-control"
                        placeholder="Enter Your phone"
                        disabled
                      />
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-12">
                    <div className="mb-3 mt-2">
                      <input
                        id="outlined-basic"
                        label="state"
                        variant="outlined"
                        type="text"
                        value={states}
                        onChange={(e) => setStates(e.target.value)}
                        className="form-control"
                        placeholder="Enter Your State"
                      />
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-6">
                    <div className="mb-3 mt-2">
                      <input
                        id="outlined-required"
                        label="city"
                        variant="outlined"
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="form-control"
                        placeholder="Enter Your City"
                        required
                      />
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="mb-3 mt-2">
                      <input
                        id="outlined-basic"
                        label="pincode"
                        variant="outlined"
                        type="number"
                        value={pincode}
                        onChange={(e) => setPincode(e.target.value)}
                        className="form-control"
                        placeholder="Enter Your Pin Code"
                        required
                      />
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-6">
                    <div className="mb-3 mt-2">
                      <input
                        id="outlined-basic"
                        label="landmark"
                        variant="outlined"
                        type="text"
                        value={landmark}
                        onChange={(e) => setLandmark(e.target.value)}
                        className="form-control"
                        placeholder="Enter Your Lankmark"
                        required
                      />
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="mb-3 mt-2">
                      <input
                        id="outlined-basic"
                        label="locality"
                        variant="outlined"
                        type="text"
                        value={locality}
                        onChange={(e) => setLocality(e.target.value)}
                        className="form-control"
                        placeholder="Enter Your Locality"
                      />
                    </div>
                  </div>
                </div>
                <button type="submit" className="btn btn-primary btn_update">
                  UPDATE
                </button>
              </form>
            </div>
          </div>
        </div>
      </Layout>
    </div>
  );
};

export default Profile;
