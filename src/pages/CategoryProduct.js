import React, { useState, useEffect } from "react";
import Layout from "../components/Layout/Layout";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Checkbox, Radio } from "antd";
import { Prices, Colorpic, Discount } from "../components/Prices";
import "./../../src/styles/catgorywise.css";
import "./../../src/styles/CategoryProductStyles.css";
import * as mod from "./../../src/url.js";
import { useCurrency } from "../context/CurrencyChange.js";
import { Box, Button } from "@chakra-ui/react";

const CategoryProduct = () => {
  const params = useParams();
  const navigate = useNavigate();
  const { selectedCurrency } = useCurrency();
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState({});
  const [checked, setChecked] = useState([]);
  const [radio, setRadio] = useState([]);
  const [colors, setColors] = useState([]);
  const [offers, setOffers] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (params?.slug) {
      getProductsByCategory();
    }
  }, [params?.slug]);

  // useEffect(() => {
  //   if (checked.length || radio.length) {
  //     getAllProducts();
  //   }
  // }, [checked.length, radio.length]);

  useEffect(() => {
    if (checked.length || radio.length || colors.length || offers.length) {
      filterProducts();
    }
  }, [checked, radio, colors, offers]);

  useEffect(() => {
    getAllCategories();
    getTotal();
  }, []);

  useEffect(() => {
    if (page === 1) {
      return;
    }
    loadMore();
  }, [page]);

  const getProductsByCategory = async () => {
    try {
      const { data } = await axios.get(
        `${mod.api_url}/api/v1/product/product-category/${params.slug}`
      );
      setProducts(data?.products);
      setCategory(data?.category);
    } catch (error) {
      console.log(error);
    }
  };

  const handleFilter = (value, id) => {
    let all = [...checked];
    if (value) {
      all.push(id);
    } else {
      all = all.filter((c) => c !== id);
    }
    setChecked(all);
  };

  const getAllProducts = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `${mod.api_url}/api/v1/product/product-list/${page}`
      );
      setLoading(false);
      setProducts(data.products);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  const filterProducts = async () => {
    try {
      const { data } = await axios.post(
        `${mod.api_url}/api/v1/product/product-filters`,
        {
          checked,
          radio,
          colors,
          offers,
        }
      );
      setProducts(data?.products);
    } catch (error) {
      console.log(error);
    }
  };

  const getAllCategories = async () => {
    try {
      const { data } = await axios.get(
        `${mod.api_url}/api/v1/category/get-category`
      );
      if (data?.success) {
        setCategories(data?.category);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getTotal = async () => {
    try {
      const { data } = await axios.get(
        `${mod.api_url}/api/v1/product/product-count`
      );
      setTotal(data?.total);
    } catch (error) {
      console.log(error);
    }
  };

  const loadMore = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `${mod.api_url}/api/v1/product/product-list/${page}`
      );
      setLoading(false);
      setProducts([...products, ...data?.products]);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="mt-3 category">
        <h4 className="text-center">Category - {category?.name}</h4>
        <h6 className="text-center">{products?.length} results found</h6>
        <div className="row">
          <div className="Category_class">
            <div
              className="col-2 filter"
              style={{ height: "100%", backgroundColor: "#e9e9ed" }}
            >
              <h4 className="text-center">categories</h4>
              <div className="d-flex flex-column">
                {categories?.map((c) => (
                  <Checkbox
                    key={c._id}
                    onChange={(e) => handleFilter(e.target.checked, c._id)}
                  >
                    {c.name}
                  </Checkbox>
                ))}
              </div>
              {/* price filter */}
              <h4 className="text-center mt-4">Price</h4>
              <div className="d-flex flex-column">
                <Radio.Group onChange={(e) => setRadio(e.target.value)}>
                  {Prices?.map((p) => (
                    <div key={p._id}>
                      <Radio value={p.array}>{p.name}</Radio>
                    </div>
                  ))}
                </Radio.Group>
              </div>
              <hr />
              <h4 className="text-center mt-4">colors</h4>
              <div className="d-flex flex-column">
                <Radio.Group onChange={(e) => setColors(e.target.value)}>
                  {Colorpic?.map((colr) => (
                    <div key={colr._id}>
                      <Radio value={colr.name}>
                        <span
                          className="color-box"
                          style={{
                            backgroundColor: colr.name,
                            width: "15px",
                            borderRadius: 50,
                            height: 15,
                            border: "1px solid gray",
                            display: "inline-block",
                          }}
                        ></span>
                        {colr.name}
                      </Radio>
                    </div>
                  ))}
                </Radio.Group>
              </div>
              <hr />
              <h4 className="text-center mt-4">Discounts</h4>
              <div className="d-flex flex-column">
                <Radio.Group onChange={(e) => setOffers(e.target.value)}>
                  {Discount?.map((disco) => (
                    <div key={disco._id}>
                      <Radio value={disco.offer}>{disco.name}</Radio>
                    </div>
                  ))}
                </Radio.Group>
              </div>

              {/* <div className="d-flex flex-column mb-5"> */}
              <Button width="100%" colorScheme='linkedin' fontSize={10}
                className="but"
                onClick={() => window.location.reload()}
              >
                RESET FILTERS
              </Button>
              {/* </div> */}
            </div>
            <Box  justifyContent="center" >
              <div className="d-flex flex-wrap">
                {products?.map((p) => (
                  <div className="categry-card m-2" key={p._id}>
                    {p.images.length > 0 && (
                      <img
                        src={require(`./../img/produtImg/${p.images[0].filename}`)}
                        className="card-img-tops"
                        alt={p.name}
                      />
                    )}

                    <div className="card-body">
                      <div className="card-name-price">
                        <h6 className="card-title">{p.name.slice(0, 20)}</h6>
                        <h5 className="card-title card-price">
                          {selectedCurrency} {p.price}
                        </h5>
                      </div>
                      {/* <p className="card-text ">
                        {p.description.substring(0, 20)}
                      </p> */}
                      <div className="card-name-price">
                        <Button width="100%" colorScheme='linkedin' fontSize={10}
                          className="butt"
                          onClick={() => navigate(`/product/${p.slug}`)}
                        >
                          More Details
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <Box>
               <div className="m-2 p-3">
                {products && products.length < total && (
                  <Button width="100%" colorScheme='linkedin' fontSize={10}
                    className=""
                    onClick={(e) => {
                      e.preventDefault();
                      setPage(page + 1);
                    }}
                  >
                    {loading ? "Loading ..." : "Loadmore"}
                  </Button>
                )}
              </div>
            </Box>
            </Box>
            
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CategoryProduct;
