import React, { Fragment, useEffect, useState } from "react";
import { connect } from "react-redux";
import { Router, Route, Switch, Redirect, withRouter } from "react-router-dom";

import PropTypes from "prop-types";
import { Grid, Box, Typography, isWidthUp, withWidth } from "@material-ui/core";
import SearchBar from "material-ui-search-bar";
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

import TopHeader from "views/components/Home/TopHeader.js";
import Footer from "views/components/Home/Footer";
import TopCarousel from "views/components/Home/TopCarousel.js";
import FeatureSection from "views/components/Home/FeatureSection";

function Home(props) {
  const { user, isAuthenticated } = props;

  const [item, setItem] = useState({});
  const [search, setSearch] = useState("");
  const [field, setField] = useState('name');

  useEffect(() => {
  
  }, []);

  // const onSearch = (val, field) => {
  //   let searchCon = {
  //     val: val,
  //     field: field
  //   }
  //   setSearch(searchCon);
  // }

  const getSearchResult = (val) => {
    let searchCon = {
      val: val,
      field: field
    }
    setItem(searchCon);
  }

  const cancelSearch = () => {
    setSearch("")
  }

  const handleSearchField = (event) => {
    setField(event.target.value);
  };

  return (
    <Fragment>
      <TopHeader id="top" />
      <TopCarousel isAuthenticated={isAuthenticated} />

      <Grid container style={{ marginTop: "20px", marginBottom: "20px" }}>
        <Grid
          item
          xs={12}
          sm={12}
          lg={2}
          data-aos="zoom-in-up"
          data-aos-delay="200"
        >
          <SearchBar
            style={{ margin:10}}
            value={search}
            onChange={(newValue) => setSearch(newValue)}
            onRequestSearch={() => getSearchResult(search)}
            onCancelSearch={() => cancelSearch()}
            placeholder="検索"
          />
          <FormControl fullWidth>
            <Select
              style={{ background: "white", minHeight: 48, 
                      borderRadius: 3, paddingLeft: 12, margin:10}}
              value={field}
              onChange={handleSearchField}
              displayEmpty
              inputProps={{ 'aria-label': 'Without label' }}
            >
              {/*<MenuItem value="" disabled>フィールドを選択 ...</MenuItem>*/}
              <MenuItem value="name">氏名</MenuItem>
              <MenuItem value="birthday">生年月日</MenuItem>
              <MenuItem value="blood">血液型</MenuItem>
              <MenuItem value="birthplace">出身地</MenuItem>
              <MenuItem value="language">言語</MenuItem>
              <MenuItem value="character">性格</MenuItem>
              <MenuItem value="play">趣味や余暇の過ごし方</MenuItem>
              <MenuItem value="job">職業</MenuItem>
              <MenuItem value="income">年収</MenuItem>
              <MenuItem value="education">学歴</MenuItem>
              <MenuItem value="living">居住地</MenuItem>
              <MenuItem value="faith">信仰</MenuItem>
              <MenuItem value="meal">食事</MenuItem>
              <MenuItem value="interest">興味・関心</MenuItem>
              <MenuItem value="introduction">自己紹介</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid
          item
          xs={12}
          sm={12}
          lg={10}
          data-aos="zoom-in-up"
          data-aos-delay="200"
        >
          <FeatureSection isAuthenticated={isAuthenticated} user={user} search={item} />
        </Grid>
      </Grid>
      <Footer />
    </Fragment>
  );
}

Home.propTypes = {
  // selectHome: PropTypes.func.isRequired
};

const mapStateToProps = (state, ownProps) => ({
  isAuthenticated: state.auth.isAuthenticated,
  user: state.auth.user,
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Home));
// export default Home;
