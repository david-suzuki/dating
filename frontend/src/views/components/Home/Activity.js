/*eslint-disable*/
import React from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import FormLabel from "@material-ui/core/FormLabel";

import activity1 from "assets/img/activity1.png";
import activity2 from "assets/img/activity2.png";
import activity3 from "assets/img/activity3.png";
import activity4 from "assets/img/activity4.png";

// core components
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import CustomInput from "components/CustomInput/CustomInput.js";
import Button from "components/CustomButtons/Button.js";
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";

// style for this view
import styles from "views/Components/style/mainStyle";

const useStyles = makeStyles(styles);

export default function Activity({ id }) {
  const classes = useStyles();

  return (
    <div style={{ padding: "80px 10%" }} id={id}>
      <div style={{ textAlign: "center" }}>
        <p style={{ fontSize: "16px", color: "#e12e3e" }}>
          <b>活⽤例</b>
        </p>
        <p style={{ fontSize: "28px", margin: "20px 0 80px 0" }}>
          <b>様々な業界の企業様にご利⽤いただいています</b>
        </p>
      </div>
      <GridContainer justify="center">
        <GridItem xs={12} sm={3}>
          <div
            style={{
              position: "relative",
              textAlign: "center",
              color: "white",
              fontSize: "20px",
            }}
          >
            <img src={activity1} style={{ width: "100%" }} />
            <div style={{ position: "absolute", top: "47%", left: "45%" }}>
              <b>測量</b>
            </div>
          </div>
        </GridItem>
        <GridItem xs={12} sm={3}>
          <div
            style={{
              position: "relative",
              textAlign: "center",
              color: "white",
              fontSize: "20px",
            }}
          >
            <img src={activity2} style={{ width: "100%" }} />
            <div style={{ position: "absolute", top: "47%", left: "45%" }}>
              <b>設計</b>
            </div>
          </div>
        </GridItem>
        <GridItem xs={12} sm={3}>
          <div
            style={{
              position: "relative",
              textAlign: "center",
              color: "white",
              fontSize: "20px",
            }}
          >
            <img src={activity3} style={{ width: "100%" }} />
            <div style={{ position: "absolute", top: "47%", left: "45%" }}>
              <b>建設</b>
            </div>
          </div>
        </GridItem>
        <GridItem xs={12} sm={3}>
          <div
            style={{
              position: "relative",
              textAlign: "center",
              color: "white",
              fontSize: "20px",
            }}
          >
            <img src={activity4} style={{ width: "100%" }} />
            <div style={{ position: "absolute", top: "47%", left: "45%" }}>
              <b>建築</b>
            </div>
          </div>
        </GridItem>
      </GridContainer>
    </div>
  );
}
