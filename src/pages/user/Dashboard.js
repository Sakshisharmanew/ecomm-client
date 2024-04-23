import React from "react";
import Layout from "../../components/Layout/Layout";
import UserMenu from "../../components/Layout/UserMenu";
import { useAuth } from "../../context/auth";
import "../../styles/dashboard.css";
import { Box } from "@chakra-ui/react";
import { Avatar, AvatarBadge, AvatarGroup } from '@chakra-ui/react'
import { AiOutlineUser } from "react-icons/ai";


const Dashboard = () => {
  const [auth] = useAuth();

  return (
    <>
      <Layout title={"Dashboard - Ecommerce App"}>
      <UserMenu />
        <Box width="100%"  display="flex">
        <div
            className="col-md-12 demo content-area"
            style={{
              overflowY: "auto",
              display: "flex",
              flexDirection: "row",
              flexWrap: "nowrap",
            }}
          >
            <div className="p-3 userD">
              <h4 className="text-center"><Avatar bg='teal.500'  justifyContent="center"/> <br></br>
              User Details  
              </h4>
              <table className="table table-bordered">
                <tbody>
                <tr>
                    <th>Name:</th>
                    <td>{auth?.user?.name}</td>
                  </tr>
                  <tr>
                    <th>Email:</th>
                    <td>{auth?.user?.email}</td>
                  </tr>
                  <tr>
                    <th>Pincode:</th>
                    <td>{auth?.user?.pincode}</td>
                  </tr>
                  <tr>
                    <th>State:</th>
                    <td>{auth?.user?.states}</td>
                  </tr>
                  <tr>
                    <th>City:</th>
                    <td>{auth?.user?.city}</td>
                  </tr>
                  <tr>
                    <th>Locality:</th>
                    <td>{auth?.user?.locality}</td>
                  </tr>
                  <tr>
                    <th>Landmark:</th>
                    <td>{auth?.user?.landmark}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

      
        </Box>
      </Layout>
    </>
  );
};

export default Dashboard;
