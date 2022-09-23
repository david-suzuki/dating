import React from "react";
// nodejs library to set properties for components
import PropTypes from "prop-types";
import cx from "classnames";

import { connect } from "react-redux";
import * as authAction from "redux/actions/auth";
import * as storageService from "../../services/storageService";
import * as authService from "../../services/authService";

import { Router, Route, Switch, Redirect, withRouter } from "react-router-dom";

// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import Button from "components/CustomButtons/Button.js";
import logo from "assets/img/auth_logo.png";
import Slide from "@material-ui/core/Slide";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";

import styles from "assets/jss/material-dashboard-pro-react/components/adminNavbarStyle.js";

const useStyles = makeStyles(styles);

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});

const AdminNavbar = (props) => {
  const [logoutModal, setLogoutModal] = React.useState(false);

  const classes = useStyles();
  const { color, rtlActive, brandText } = props;
  const appBarClasses = cx({
    [" " + classes[color]]: color,
  });
  const sidebarMinimize =
    classes.sidebarMinimize +
    " " +
    cx({
      [classes.sidebarMinimizeRTL]: rtlActive,
    });

  const handleLogOut = () => {
    authService.logOut().then((result) => {});

    props.logout();
    storageService.removeStorage("token");
    storageService.removeStorage("user");
    props.history.push("/");
  };
  return (
    <div className={classes.topbar}>
      <Dialog
        open={logoutModal}
        TransitionComponent={Transition}
        onClose={() => setLogoutModal(false)}
      >
        <DialogContent>
          <DialogTitle disableTypography style={{ textAlign: "center" }}>
            <h4>
              <b>ログアウトしますか？</b>
            </h4>
          </DialogTitle>
          <DialogActions
            className={classes.modalFooter + " " + classes.modalFooterCenter}
          >
            <Button
              onClick={() => setLogoutModal(false)}
              style={{ backgroundColor: "lightgrey", color: "black" }}
            >
              キャンセル
            </Button>
            <Button
              onClick={() => handleLogOut()}
              style={{ backgroundColor: "#e12e3e" }}
            >
              ログアウト
            </Button>
          </DialogActions>
        </DialogContent>
      </Dialog>
      <a href="/admin/dashboard">
        <img src={logo} alt="..." width="150px" />
      </a>
      <span
        style={{
          fontSize: "18px",
          fontWeight: "bold",
          position: "absolute",
          right: "22%",
          top: "20px",
        }}
      >
        {props.user.company}
      </span>
      <Button
        style={{
          backgroundColor: "#e12e3e",
          paddingTop: "5px",
          paddingBottom: "5px",
          paddingLeft: "15px",
          paddingRight: "15px",
          position: "absolute",
          right: "13.5%",
        }}
        onClick={() => setLogoutModal(true)}
      >
        ログアウト
      </Button>
    </div>
  );
};

const mapStateToProps = (state, ownProps) => ({
  user: state.auth.user,
});

const mapDispatchToProps = {
  logout: authAction.Logout,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(AdminNavbar));
