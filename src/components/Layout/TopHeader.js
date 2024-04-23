import React, { useEffect, useState } from "react";
import Header from "antd/es/layout/layout";
import "./../../styles/Topheader.css";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/auth";
import toast from "react-hot-toast";
import SearchInput from "../Form/SearchInput";
import useCategory from "../../hooks/useCategory";
import { useCart } from "../../context/cart";
import { Badge } from "antd";
import { AiOutlineShopping } from "react-icons/ai";
import logo from "./../../img/logo.png";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import { ShoppingCartOutlined } from "@ant-design/icons";
import CurrencySelector from "./ChangeCurr";
import * as mod from "./../../url";
import axios from "axios";
import { MdCategory } from "react-icons/md";
import { AiTwotoneHome } from "react-icons/ai";
import { Box, Button, useDisclosure } from '@chakra-ui/react'
import { confirmAlert } from "react-confirm-alert";





function TopHeader() {
  const [isFixed, setIsFixed] = useState(false);
  const [subcategories, setSubcategories] = useState([]);
  const [hoveredCategoryId, setHoveredCategoryId] = useState(null);
  const [auth, setAuth] = useAuth();
  const [cart] = useCart();
  const categories = useCategory();
  const [searchTerm, setSearchTerm] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [showSubcategoryMenu, setShowSubcategoryMenu] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure()
  const navigate = useNavigate();



  const handleLogout = () => {
    
    confirmAlert({
      title: "Confirm logout",
      message: "Are you sure you want to log out?",
      buttons: [
        {
          label: "Yes",
          onClick: () => {
            setAuth({
              ...auth,
              user: null,
              token: "",
            });
            localStorage.removeItem("auth");
            navigate("/login");
            toast.success("Logout Successfully");
          },
        },
        {
          label: "No",
          onClick: () => {
            // Do nothing or any other action you want
          },
        },
      ],
    });
  };
  

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setIsFixed(true);
      } else {
        setIsFixed(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleSearch = (value) => {
    setSearchTerm(value);
    // ... rest of the search logic
  };

  const clearSearch = () => {
    setSearchTerm("");
    // ... rest of the logic to clear search
  };

  const getSubCategories = async (categoryId) => {
    try {
      const { data } = await axios.get(
        `${mod.api_url}/api/v1/subCategory/subcategry/${categoryId}`
      );
      setSubcategories(data?.subcategories);
      setHoveredCategoryId(categoryId);
    } catch (error) {
      console.error(error);
    }
  };

  const handleToggleDropdown = () => {
    const dropdownMenu = document.querySelector(".navbar-collapse");
  
    setShowDropdown(!showDropdown);
  
    if (dropdownMenu) {
      if (!showDropdown) {
        dropdownMenu.style.transformOrigin = "top";
      } else {
        dropdownMenu.style.transformOrigin = "bottom";
      }
    }
  };
  

  return (
    <>
    <Box
        bg="black"
        color="white"
        p={1}
        height="25px"
        marginBottom="2px"
        marginTop="2px"
        boxShadow="md"
      >
        <marquee style={{ fontWeight: "600" }}>
          Summer Sale Offer: Get 35% Off on All Items - Limited Time Only!
        </marquee>
      </Box>
      <div className={`top-header ${isFixed ? "fixed-header" : ""}`}>
        <nav className="navbar navbar-expand-lg ">
          <div className="container-fluid">
            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarTogglerDemo01"
              aria-controls="navbarTogglerDemo01"
              aria-expanded="false"
              aria-label="Toggle navigation"
              onClick={handleToggleDropdown}
            >
              <span className="navbar-toggler-icon"></span>
            </button>
            <div
              className={`collapse navbar-collapse headerName ${showDropdown ? "dropdown-open" : ""}`}
              id="navbarTogglerDemo01"
            >
              <Link to="/" className="navbar-brand">
                <img src={logo} style={{ width: 150, height: 60}} />
              </Link>

              <div
                className="nav-item dropdown"
                style={{ fontFamily: "monospace", position: "static" }}
                onMouseEnter={() => setShowSubcategoryMenu(true)}
              onMouseLeave={() => {
                setTimeout(() => setShowSubcategoryMenu(false), 3500);
              }}
              >
                <Link
                  className="nav-link dropdown-toggle navbarHeader"
                  style={{ fontFamily: "monospace" }}
                  to={"/categories"}
                  data-bs-toggle="dropdown"
                >
               Categories
                </Link>
                <ul
                  className="dropdown-menu dropdown-menu-left"
                  style={{ width: "45px", height:"auto", textAlign:"center" }}
                  onMouseEnter={() => setShowSubcategoryMenu(true)}
                onMouseLeave={() => setShowSubcategoryMenu(false)}
                >
                  <Button width="100%" padding="5px" >
                    <Link
                      className="dropdown-item"
                      to={"/categories"}
                      style={{ fontFamily: "monospace", width: 100,  overflowY: "auto", textAlign:"center" }}
                    >
                      All
                    </Link>
                  </Button>
                  {categories?.map((category) => (
                    <Button key={category._id} width="100%" marginTop="4px" padding="5px">
                      <div className="category-wrapper">
                        <Link
                          className="dropdown-item text-center"
                          to={`/category/${category.slug}`}
                          onMouseEnter={() => getSubCategories(category._id)}
                        >
                          {category.name}
                        </Link>
                        {hoveredCategoryId === category._id && (
                          <div className="text-center subcategory-menu">
                            <ul  style={{ width: "auto", height:"450px", marginLeft:"10px", overflowY: "auto", borderRadius:"20px", textAlign:"center"  }}>
                              {subcategories?.map((subCategory) => (
                                <li key={subCategory._id}
                                
                                >
                                  <h5>{subCategory.length}</h5>
                                  <Link
                                    className=" text-center dropdown-item text-center"
                                    style={{borderBottom:"1px solid  whitesmoke"}}
                                    to={`/subcategory/${subCategory.slug}`}
                                  >
                                    <li>{subCategory.name}</li>
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </Button>
                  ))}
                </ul>
              </div>

              <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
                <div className="search_name1" style={{ marginLeft: 1 }}>
                  <SearchInput onSearch={handleSearch} value={searchTerm} />
                </div>
                <Button background="#f8f9fa">
                <li className="nav-item" style={{ fontFamily: "monospace" }}>
                  <NavLink
                    to="/"
                    className="nav-link navbarHeader"
                    style={{ fontFamily: "monospace" }}
                  >
                  Home
                  </NavLink>
                </li>
                </Button>
                
                {!auth?.user ? (
                  <>
                  <Button background="#f8f9fa">
                    <li className="nav-item">
                      <NavLink to="/login" className="nav-link navbarHeader">
                        Login
                      </NavLink>
                    </li>
                    </Button>
                  </>
                ) : (
                  <>
                    <li className="nav-item dropdown">
                      <NavLink
                        className="nav-link dropdown-toggle"
                        href="#"
                        role="button"
                        data-bs-toggle="dropdown"
                        style={{ border: "none" }}
                      >
                        <ManageAccountsIcon />
                        {auth?.user?.name}
                      </NavLink>
                      <ul className="dropdown-menu">
                      <Button background="#f8f9fa" width="100%" marginBottom={3}>
                        <li>
                          <NavLink
                            to={`/dashboard/${
                              auth?.user?.role === 1 ? "admin" : "user"
                            }`}
                            className="dropdown-item navbarHeader"
                          >
                            Dashboard
                          </NavLink>
                        </li>
                        </Button>
                        <Button background="#f8f9fa" width="100%">
                        <li>
                          <NavLink
                            onClick={handleLogout}
                            className="dropdown-item navbarHeader"
                          >
                            Logout
                          </NavLink>
                        </li>
                        </Button>
                      </ul>
                    </li>
                  </>
                )}
                <li className="nav-item-cart">
                  <NavLink to="/cart" className="nav-link navbarHeader">
                    <Badge count={cart?.length} offset={[10, -5]}>
                      <AiOutlineShopping
                        style={{ fontSize: "30px", color: "#08c" }}
                      />
                    </Badge>
                  </NavLink>
                </li>
              </ul>
            </div>

            <div className="search_name" style={{ marginLeft: 1 }}>
              <SearchInput onSearch={handleSearch} value={searchTerm} />
              <li className="nav-item-1">
                <NavLink to="/cart" className="nav-link navbarHeader">
                  <Badge count={cart?.length} offset={[10, -5]}>
                    <AiOutlineShopping
                      style={{
                        fontSize: "30px",
                        color: "#08c",
                        marginLeft: "20px",
                      }}
                    />
                  </Badge>
                </NavLink>
              </li>
            </div>
          </div>
        </nav>
        {/* <Header /> */}
      </div>
    </>
  );
}

export default TopHeader;
