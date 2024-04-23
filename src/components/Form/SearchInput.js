import React from "react";
import { useSearch } from "../../context/search";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import SearchIcon from "@mui/icons-material/Search";
import "./../../styles/Topheader.css";
import * as mod from './../../url';

const SearchInput = () => {
  const [values, setValues] = useSearch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.get(
        `${mod.api_url}/api/v1/product/search/${values.keyword}`
      );
      setValues({ ...values, results: data, keyword: "" }); // Clear the keyword after search
      navigate("/search");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <form
        className="d-flex search-form"
        role="search"
        onSubmit={handleSubmit}
      >
        <input
          className="form-control me-3"
          style={{ fontFamily: "monospace" }}
          type="search"
          placeholder="Search for Products, Brands & More"
          aria-label="Search"
          value={values.keyword}
          onChange={(e) => setValues({ ...values, keyword: e.target.value })}
        />
        <button className="btn btn-outline-success Search_icon" type="submit">
          <SearchIcon />
        </button>
      </form>
    </div>
  );
};

export default SearchInput;
