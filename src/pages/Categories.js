import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import useCategory from "../hooks/useCategory";
import Layout from "../components/Layout/Layout";
import "../styles/Categories.css";
import Box from "@mui/material/Box";
import { Text } from '@chakra-ui/react'
import { MdCategory } from 'react-icons/md';
const Categories = () => {
  const categories = useCategory();
  return (
    <Layout title={"All Categories"}>
      <div className="container">
        <div className="row">
        <Text fontSize="24px" className="text-center" >All Category</Text>
          {categories.map((c) => (
            <div className="col-lg-4 col-md-12  gx-3 gy-3" style={{padding:"10px"}} key={c._id}>
              <Box padding={1}>
                <Link to={`/category/${c.slug}`} className="btn cat-btn">
                  {/* <img
                    className="image-size"
                    style={{ height: 80, width: 80 }}
                    src={c?.image}
                    alt=""
                  /> */}
                  <h4>{c.name}</h4>
                </Link>
              </Box>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Categories;
