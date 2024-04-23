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

const SubCategoryProduct = () => {
  const params = useParams();
  const navigate = useNavigate();
  const { selectedCurrency } = useCurrency();

  const [products, setProducts] = useState([]);
  const [subcategories, setSubcategories] = useState({});
  const [checked, setChecked] = useState([]);
  const [radio, setRadio] = useState([]);
  const [colors, setColors] = useState([]);
  const [offers, setOffers] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [subcategory, setSubcategory] = useState([]);
  const [loading, setLoading] = useState(false);
  //   console.log(subcategories,'subcategories')

  useEffect(() => {
    if (params?.slug) {
      getProductsBySubCategory();
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
    // getAllSubCategories();
    getTotal();
  }, []);

  useEffect(() => {
    if (page === 1) {
      return;
    }
    loadMore();
  }, [page]);

  const getProductsBySubCategory = async () => {
    try {
      const { data } = await axios.get(
        `${mod.api_url}/api/v1/product/product-subcategory/${params.slug}`
      );
      console.log(data, "getProductsBySubCategory");

      setProducts(data?.products);
      setSubcategory(data?.subcategory);
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

  //   const getAllSubCategories = async () => {
  //     try {
  //       const { data } = await axios.get(
  //         `${mod.api_url}/api/v1/subcategory/subcategories`
  //       );
  //       console.log(data,'getAllSubCategories')
  //       if (data?.success) {
  //         setSubcategories(data?.subcategory);
  //       }
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   };

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
        <h4 className="text-center">Category - {subcategory?.name}</h4>
        <h6 className="text-center">{products?.length} results found</h6>
        <div className="row">
          <div className="Category_class">
            <div
              className="col-2 filter"
              style={{ height: "100%", backgroundColor: "#e9e9ed" }}
            >
              <h4 className="text-center">categories</h4>
              <div className="d-flex flex-column">
                {/* {subcategory?.map((c) => (
                  <Checkbox
                    key={c._id}
                    onChange={(e) => handleFilter(e.target.checked, c._id)}
                  >
                    {c.name}
                  </Checkbox>
                ))} */}
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
              <button
                className="button-26"
                onClick={() => window.location.reload()}
              >
                RESET FILTERS
              </button>
              {/* </div> */}
            </div>
            <div className="col-40 swiper-container">
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
                        <h5 className="card-title">{p.name.slice(0, 20)}</h5>
                        <h5 className="card-title card-price">
                          {selectedCurrency} {p.price}
                        </h5>
                      </div>
                      <p className="card-text ">
                        {p.description.substring(0, 20)}...
                      </p>
                      <div className="card-name-price">
                        <button
                          className="button-27"
                          onClick={() => navigate(`/product/${p.slug}`)}
                        >
                          More Details
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="m-2 p-3">
                {products && products.length < total && (
                  <button
                    className="btn btn-warning"
                    onClick={(e) => {
                      e.preventDefault();
                      setPage(page + 1);
                    }}
                  >
                    {loading ? "Loading ..." : "Loadmore"}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default SubCategoryProduct;
