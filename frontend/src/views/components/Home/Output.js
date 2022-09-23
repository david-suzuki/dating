/*eslint-disable*/
import React from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";

// core components
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Button from "components/CustomButtons/Button.js";

// style for this view
import styles from "views/Components/style/mainStyle";

const useStyles = makeStyles(styles);
const useMyStyles = makeStyles({
  root: {
    padding: "0px 12px !important",
  },
});

export default function Output({ id }) {
  const classes = useStyles();
  const classesMy = useMyStyles();

  return (
    <div style={{ padding: "80px 15%" }} id={id}>
      <div style={{ textAlign: "center" }}>
        <p style={{ fontSize: "16px", color: "#e12e3e" }}>
          <b>機能</b>
        </p>
        <p style={{ fontSize: "28px", margin: "30px 0 80px 0" }}>
          <b>幅広い処理に対応しています</b>
        </p>
      </div>
      <GridContainer justify="center">
        <GridItem xs={12} sm={3} className={classesMy.root}>
          <div className={classes.outputDiv}>
            <b>グラウンドデータ(DTM)</b>
            <p style={{ color: "black" }}>.las/.laz/.xyz/.txt</p>
          </div>
        </GridItem>
        <GridItem xs={12} sm={3} className={classesMy.root}>
          <div className={classes.outputDiv}>
            <b>簡易図化(⼀般図)</b>
            <p style={{ color: "black" }}>.dwg/.dgn/.dm/.shp/.pdf</p>
          </div>
        </GridItem>
        <GridItem xs={12} sm={3} className={classesMy.root}>
          <div className={classes.outputDiv}>
            <b>等⾼線</b>
            <p style={{ color: "black" }}>.dwg/.dxf/.shp/.pdf</p>
          </div>
        </GridItem>
        <GridItem xs={12} sm={3} className={classesMy.root}>
          <div className={classes.outputDiv}>
            <b>縦横断図</b>
            <p style={{ color: "black" }}>.dwg/.dxf/.sima</p>
          </div>
        </GridItem>
      </GridContainer>
      <GridContainer justify="center" style={{ marginTop: "30px" }}>
        <GridItem xs={12} sm={3} className={classesMy.root}>
          <div className={classes.outputDiv}>
            <b>オルソ画像</b>
            <p style={{ color: "black" }}>.tif/.tiff/.jpeg/.kml</p>
          </div>
        </GridItem>
        <GridItem xs={12} sm={3} className={classesMy.root}>
          <div className={classes.outputDiv}>
            <b>⼟量計算(メッシュ法)</b>
            <p style={{ color: "black" }}>.csv</p>
          </div>
        </GridItem>
        <GridItem xs={12} sm={3} className={classesMy.root}>
          <div className={classes.outputDiv}>
            <b>簡易精度管理表</b>
            <p style={{ color: "black" }}>.xlsx</p>
          </div>
        </GridItem>
        <GridItem xs={12} sm={3} className={classesMy.root}>
          <div className={classes.outputDiv}>
            <b>公共精度管理表</b>
            <p style={{ color: "black" }}>.xlsx</p>
          </div>
        </GridItem>
      </GridContainer>
    </div>
  );
}
