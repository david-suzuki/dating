import React from "react";
import PropTypes from "prop-types";

import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";

import styles from "assets/jss/material-dashboard-pro-react/components/typographyStyle.js";

const useStyles = makeStyles(styles);

export default function Success(props) {
  const classes = useStyles();
  const { children } = props;

  return typeof children !== "undefined" ? (
    <div
      className={classes.defaultFontStyle + " " + classes.successText}
      style={{ fontSize: "12px", marginTop: "30px", marginBottom: "-20px" }}
    >
      <GridContainer justify="center">
        <GridItem xs={1} sm={1} md={1} style={{ textAlign: "right" }}>
          <i className="fas fa-check-circle"></i>
        </GridItem>
        <GridItem xs={11} sm={11} md={11}>
          {children.split("\n").map((i, key) => {
            return (
              <div key={key} style={{ textAlign: "left" }}>
                {i}
              </div>
            );
          })}
          {/* {children} */}
        </GridItem>
      </GridContainer>
    </div>
  ) : (
    <div />
  );
}

Success.propTypes = {
  children: PropTypes.node,
};
