import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Grid, Typography, isWidthUp, withWidth } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

import CodeIcon from "@material-ui/icons/Code";
import BuildIcon from "@material-ui/icons/Build";
import ComputerIcon from "@material-ui/icons/Computer";
import BarChartIcon from "@material-ui/icons/BarChart";
import HeadsetMicIcon from "@material-ui/icons/HeadsetMic";
import CalendarTodayIcon from "@material-ui/icons/CalendarToday";
import CloudIcon from "@material-ui/icons/Cloud";
import MeassageIcon from "@material-ui/icons/Message";
import CancelIcon from "@material-ui/icons/Cancel";
import Pagination from "@material-ui/lab/Pagination";

import Button from "components/CustomButtons/Button.js";
import Button2 from "components/CustomButtons/Button2.js";
import CustomInput from "components/CustomInput/CustomInput.js";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import Snackbar from "components/Snackbar/Snackbar.js";
import Slide from "@material-ui/core/Slide";
import AddAlert from "@material-ui/icons/AddAlert";

import CalculateSpacing from "./CalculateSpacing";
import FeatureCard from "./FeatureCard";

import * as userService from "services/userService";
import * as storageService from "services/storageService";

import styles from "../style/mainStyle";
import "../style/pagination.css";

const useStyles = makeStyles(styles);

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});

const iconSize = 30;

function FeatureSection(props) {
  const { width, isAuthenticated, user, search } = props;
  const [deleteUsertModal, setDeleteUserModal] = React.useState(false);
  const [features, setFeatures] = useState([]);

  const [show, setShow] = useState(false);
  const [place, setPlace] = useState("br");
  const [notifyColor, setNotifyColor] = React.useState("danger");
  const [message, setMessage] = useState("");

  const [userId, setUserId] = React.useState(0);

  const [page, setPage] = useState(1);
  const [count, setCount] = useState(0);
  const [data, setData] = useState([]);

  // please change for number per page
  const perPage = 12;

  const removeButtons = (id) =>
    [{ color: "rose" }].map((prop, key) => {
      return (
        <Button2
          color={prop.color}
          simple
          key={key}
          style={{ padding: "none" }}
          onClick={() => clickOpenDeleteModal(id)}
        >
          削除
        </Button2>
      );
    });

  const clickOpenDeleteModal = (id) => {
    setUserId(id);

    setDeleteUserModal(true);
  };

  const clickSubmitDelete = () => {
    // userService.deleteUser({ id: userId }).then(res => {
    //   if (res.data.message == 'success') {
    //     console.log('Success to remove');
    //     fetchUsers();
    //   }
    // }).catch((err)=>{
    //   console.log(err);
    // });

    setDeleteUserModal(false);
  };

  const fetchProfiles = () => {
    let skips = storageService.getStorage("skip");

    userService
      .getAllProfiles()
      .then((res) => {
        if (res.data.message == "success" && res.data.profile) {
          if (res.data.profile.length === 0) {
            showNotification("br", "表示するプロファイルはありません。", "danger");
          }
          const items = [];
          res.data.profile.map((item, index) => {
            if (!skips || !skips.includes(item.uid)) items.push(item);
          });
          setFeatures(items);
          setCount(Math.ceil(items.length / perPage));
          setData(items.slice(0, perPage))
        }
      })
      .catch((error) => {
        showNotification("br", "サーバー接続に失敗しました。", "danger");
      });
  };

  const searchProfiles = (search) => {
    let searchData = new FormData();
    searchData.append("search", JSON.stringify(search));

    let skips = storageService.getStorage("skip");

    userService
      .getSearchProfiles(searchData)
      .then((res) => {
        if (res.data.message == "success" && res.data.profile) {
          if (res.data.profile.length === 0) {
            showNotification("br", "検索結果はありません。", "danger");
          }
          const items = [];
          res.data.profile.map((item, index) => {
            if (!skips || !skips.includes(item.uid)) items.push(item);
          });
          setFeatures(items);
          setCount(Math.ceil(items.length / perPage));
          setData(items.slice(0, perPage))
        }
      })
      .catch((error) => {
        showNotification("br", "サーバー接続に失敗しました。", "danger");
      });
  };

  const handlePageChange = (event, value) => {
    setPage(value);
    let idx = value - 1;
    setData(features.slice(idx*perPage, idx*perPage+perPage))
  };

  const handleLikeChange = (uid, likeStatus) => {
    let newFeatures = [];
    for (let feature of features) {
      if (feature.uid == uid)
        feature.liked = likeStatus;
      newFeatures.push(feature);
    }

    setFeatures(newFeatures);
  }

  const showNotification = (place, message, notifyColor) => {
    setPlace(place);
    setNotifyColor(notifyColor);
    setMessage(message);
    setShow(true);
    setTimeout(() => {
      setShow(false);
    }, 3000);
  };

  useEffect(() => {
    if (Object.keys(search).length === 0) {
      fetchProfiles();  
    } else {
      if (search.field === "")
        showNotification("br", "プロファイルフィールドを選択。", "danger");
      else
        searchProfiles(search);  
    }
  }, [search]);

  const classes = useStyles();

  return (
    <div style={{ backgroundColor: "#FFFFFF" }}>
      <div className="container-fluid lg-p-top">
        <div className="container-fluid" style={{marginLeft: 20}}>
          <Grid container spacing={CalculateSpacing(width)}>
            {data.map((element) => (
              <Grid
                item
                xs={6}
                md={2}
                lg={2}
                style={{ padding: "10px" }}
                data-aos="zoom-in-up"
                data-aos-delay={
                  isWidthUp("md", width) ? element.mdDelay : element.smDelay
                }
                key={element.id}
              >
                <FeatureCard
                  id={element.id}
                  uid={element.uid}
                  avatar={element.avatar}
                  uname={element.name}
                  isSelf={user.id == element.uid}
                  // color={element.color}
                  // text={element.text}
                  isLiked={element.liked}
                  isAuthenticated={isAuthenticated}
                  handleLike={handleLikeChange}
                />
              </Grid>
            ))}
          </Grid>
        </div>
      </div>
      <Pagination
        className="my-3"
        count={count}
        page={page}
        siblingCount={0}
        boundaryCount={1}
        variant="outlined"
        shape="rounded"
        onChange={handlePageChange}
      />
      <Dialog
        classes={{
          root: classes.center + " " + classes.modalRoot,
          paper: classes.modal,
        }}
        open={deleteUsertModal}
        TransitionComponent={Transition}
        keepMounted
        onClose={() => setDeleteUserModal(false)}
        aria-labelledby="classic-modal-slide-title"
        aria-describedby="classic-modal-slide-description"
      >
        <DialogContent>
          <DialogTitle
            id="classic-modal-slide-title"
            disableTypography
            style={{ textAlign: "center" }}
          >
            <h4>
              <b>本当に削除しますか？</b>
            </h4>
          </DialogTitle>
          <DialogActions
            className={classes.modalFooter + " " + classes.modalFooterCenter}
          >
            <Button
              onClick={() => setDeleteUserModal(false)}
              style={{ backgroundColor: "lightgrey", color: "black" }}
            >
              キャンセル
            </Button>
            <Button
              onClick={() => clickSubmitDelete()}
              style={{ backgroundColor: "#e12e3e" }}
            >
              削除する
            </Button>
          </DialogActions>
        </DialogContent>
      </Dialog>
      <Snackbar
        place={place}
        color={notifyColor}
        icon={AddAlert}
        message={message}
        open={show}
        closeNotification={() => setShow(false)}
        close
      />
    </div>
  );
}

FeatureSection.propTypes = {
  width: PropTypes.string.isRequired,
  isAuthenticated: PropTypes.bool.isRequired,
  user: PropTypes.object,
};

export default withWidth()(FeatureSection);
