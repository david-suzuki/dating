import React from "react";
import { makeStyles } from "@material-ui/core/styles";

import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";

import styles from "../style/mainStyle.js";

// const useStyles = makeStyles(styles);
const useStyles = makeStyles({
  root: {
    padding: "20px 0px !important",
  },
});

export default function Footer() {
  const classes = useStyles();

  return (
    <div
      style={{
        backgroundColor: "black",
        padding: "50px 120px",
        color: "whitesmoke",
      }}
    >
      <GridContainer justifyContent="center">
        <GridItem xs={12} sm={6}>
          <h3>
            <b>株式会社</b>
          </h3>
          <p style={{ fontSize: "12px", color: "lightgrey" }}>
            〒100-0001 東京都
          </p>
          <p style={{ fontSize: "12px", color: "lightgrey" }}>
            TEL 03-1111-2222
          </p>
          <p style={{ fontSize: "12px", color: "lightgrey" }}>
            Mail abc@gmail.com
          </p>
        </GridItem>
        <GridItem xs={12} sm={2} className={classes.root}>
          <p>
            <a href="#top" style={{ color: "whitesmoke" }}>
              ホーム
            </a>
          </p>
          <p>
            <a href="#feature" style={{ color: "whitesmoke" }}>
              特徴
            </a>
          </p>
        </GridItem>
        <GridItem xs={12} sm={2} className={classes.root}>
          <p>
            <a href="#faq" style={{ color: "whitesmoke" }}>
              Q＆A
            </a>
          </p>
          <p>
            <a href="#contact" style={{ color: "whitesmoke" }}>
              お問い合わせ
            </a>
          </p>
        </GridItem>
        {/* <GridItem xs={12} sm={2} className={classes.root}>
                    <p><a target="_blank" href="https://apex.tokyo/" style={{ color: "whitesmoke" }}>会社概要</a></p>
                    <p><a target="_blank" href="https://able-beret-9af.notion.site/40f36c7b56b440bab00e0b2cd0f9f7cf" style={{ color: "whitesmoke" }}>プライバシーポリシー</a></p>
                    <p><a target="_blank" href="https://able-beret-9af.notion.site/49f6581e6c3d48548b89373092016152" style={{ color: "whitesmoke" }}>特定商取引法に基づく表記</a></p>
                </GridItem> */}
      </GridContainer>
    </div>
  );
}
