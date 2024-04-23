import React from "react";
import Layout from "./../components/Layout/Layout";
import { useSearch } from "../context/search";
import { useNavigate } from "react-router-dom";
import "../styles/serch.css";
import { toast } from "react-hot-toast";
import { useCart } from "../context/cart";
import { useCurrency } from "../context/CurrencyChange";
import { MagnifyingGlass } from "react-loader-spinner";
import { Box, Button, Text } from "@chakra-ui/react";

const Search = () => {
  const [values, setValues] = useSearch();
  const navigate = useNavigate();
  const [cart, setCart] = useCart();
  const { selectedCurrency } = useCurrency();

  return (
    <Layout title={"Search results"}>
      {/* <div className=" col-12 container"> */}
      <Box 
      display="flex"
      width="100%"
      flexDirection="column"
      justifyContent="center"
      >
          <div className="col-md-12  d-flex flex-wrap">
            <Box  display="grid"  alignItems="center" width="100%"
            justifyContent="center"
            textAlign="center"
            >
            <Button colorScheme='gray' >Search Resuts</Button>
              
              <Text>
                {values?.results.length < 1 ? (
                  <>
                    <Text textAlign="center" display="grid" >Search your product</Text>
                    <br></br>
                    <MagnifyingGlass
                      visible={true}
                      height="80"
                      width="80"
                      ariaLabel="magnifying-glass-loading"
                      wrapperStyle={{}}
                      wrapperClass="magnifying-glass-wrapper"
                      glassColor="#c0efff"
                      color="#e15b64"
                    />
                  </>
                ) : null}
              </Text>
            </Box>

            <div className="d-flex flex-wrap mt-2 resuts ">
              {values?.results.map((p) => (
                <div className="card m-2 " key={p._id}>
                  <button
                    style={{ border: "none", background: "white" }}
                    onClick={() => navigate(`/product/${p.slug}/`)}
                  >
                    {p.images.length > 0 && (
                      <img
                        // style={{ margin: 0, padding: 24, width: 150 }}
                        src={require(`./../img/produtImg/${p.images[0].filename}`)}
                        className="card-img-tops"
                        alt={p.name}
                      />
                    )}
                  </button>
                  <div className="card-body">
                    <div className="card-name-price">
                      <h5 className="card-title">{p.name.slice(0, 10)} |</h5>
                      <h5 className="card-title card-price text-right">
                        <span>{selectedCurrency}</span>&nbsp;
                        <span>{p.price}</span>
                      </h5>
                    </div>
                    {/* <p className="card-text ">
                    {p.description.substring(0, 30)}...
                  </p> */}
                    <div className="card-name-price">
                      <Button width="48%" colorScheme='linkedin' fontSize={12} marginRight={1}
                        className="butt"
                        onClick={() => {
                          const existingProduct = cart.find(
                            (item) => item._id === p._id
                          );
                          if (existingProduct) {
                            navigate("/cart");
                          } else {
                            setCart([...cart, { ...p, quantity: 1 }]);
                            localStorage.setItem(
                              "cart",
                              JSON.stringify([...cart, { ...p, quantity: 1 }])
                            );
                            navigate("/cart");
                          }
                        }}
                      >
                        Buy Now
                      </Button>
                      <Button width="49%" colorScheme='linkedin' fontSize={10}
                        className="butt"
                        onClick={() => {
                          const itemExists = cart.some(
                            (item) => item._id === p._id
                          );
                          if (itemExists) {
                            // If the item already exists, show an error toast message
                            navigate("/cart");
                          } else {
                            setCart([...cart, { ...p, quantity: 1 }]);
                            localStorage.setItem(
                              "cart",
                              JSON.stringify([...cart, { ...p, quantity: 1 }])
                            );
                            toast.success("Item Added to cart");
                          }
                        }}
                      >
                        ADD TO CART
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        {/* </div> */}
        </Box>
    </Layout>
  );
};

export default Search;
