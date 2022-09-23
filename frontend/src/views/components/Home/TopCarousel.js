import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Grid from '@material-ui/core/Grid';

import bkImage from "assets/img/bg.jpg";
import logo from "assets/img/auth_logo.png";

import Button from "components/CustomButtons/Button.js";
import SearchBar from "material-ui-search-bar";
import * as userService from "services/userService";

export default function TopCarousel(props) {
  const { isAuthenticated } = props;

  // const [search, setSearch] = useState("");
  // const [field, setField] = useState('name');
  // const [placeholder, setPlaceholder] = useState("検索");

  // useEffect(() => {
  //   let searchInput = document.getElementsByClassName("MuiInputBase-input MuiInput-input")[0];
  //   searchInput.style.fontWeight = "bold";

  //   let fieldSelect = document.getElementsByClassName("MuiSelect-root MuiSelect-select MuiSelect-selectMenu MuiInputBase-input MuiInput-input")[0];
  //   fieldSelect.style.fontWeight = null;
  //   if (field === "") {
  //     fieldSelect.style.color = "#575757";
  //   } else {
  //     fieldSelect.style.color = null;
  //   }
  // }, [field]);

  // const getSearchResult = (val) => {
  //   props.onSearch(val, field);
  // }

  // const cancelSearch = () => {
  //   setSearch("")
  // }

  // const handleSearchField = (event) => {
  //   setField(event.target.value);
  // };

  return (
    <div
      style={{
        width: "100%",
        backgroundSize: "100% 100%",
        backgroundImage: "url(" + bkImage + ")",
        padding: "200px 10% 30px 10%",
      }}
    >
      <img src={logo} alt="..." width="400px" />
      <br />
      <br />
      <p style={{ fontSize: "22px", color: "white" }}>
        <b>アルファーマッチングは本当に出会える</b>
      </p>
      <p style={{ fontSize: "22px", color: "white", marginBottom: 100,  }}>
        <b>マッチングサービスです。</b>
      </p>
      {!isAuthenticated && (
        <Button
          style={{
            backgroundColor: "#e12e3e",
            color: "white",
            fontSize: "16px",
            marginTop: "50px",
          }}
        >
          <a
            href="/auth/register"
            style={{ color: "white" }}
            rel={"noindex nofollow"}
          >
            会員登録はこちら
          </a>
        </Button>
      )}
    </div>
  );
}

TopCarousel.propTypes = {
  isAuthenticated: PropTypes.bool.isRequired,
};
