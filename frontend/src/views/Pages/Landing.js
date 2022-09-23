import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { Router, Route, Switch, Redirect, withRouter } from "react-router-dom";
// @material-ui/core components

import TopHeader from "views/components/Landing/TopHeader.js";
import LandingFooter from "views/components/Landing/LandingFooter";
// import TopCarousel from "views/Components/Landing/TopCarousel.js";
// import ContactForm from "views/Components/Landing/ContactForms.js";
// import Activity from "views/Components/Landing/Activity.js";
// import Feature from "views/Components/Landing/Feature.js";
// import Output from "views/Components/Landing/Output.js";
// import Workflow from "views/Components/Landing/Workflow.js";
// import Faq from "views/Components/Landing/Faq.js";

const Landing = (user, props) => {
  const { ...rest } = props;
  return (
    <div>
      <TopHeader id="top" />
      <LandingFooter />
    </div>
  );
};

const mapStateToProps = (state, ownProps) => ({
  user: state.auth.user,
});

const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(Landing));
