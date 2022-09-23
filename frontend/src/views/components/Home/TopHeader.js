import { connect } from "react-redux";
import {
  Router,
  Route,
  Switch,
  Redirect,
  withRouter,
  useHistory,
} from "react-router-dom";
import { Link, animateScroll as scroll } from "react-scroll";
import * as authAction from "redux/actions/auth";
import * as storageService from "../../../services/storageService";
import * as userService from "../../../services/userService";
import * as authService from "../../../services/authService";

// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import Button1 from "components/CustomButtons/Button1.js";
import logo from "assets/img/alpha_advisors_logo.jpg";
import Button from "components/CustomButtons/Button.js";

import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import Badge from "@material-ui/core/Badge";
import MailIcon from "@material-ui/icons/Mail";
import Slide from "@material-ui/core/Slide";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Drawer,
  MenuItem,
  ListItemText,
  ListItem,
  Divider,
} from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";
import React, { useState, useEffect } from "react";
import { Link as RouterLink } from "react-router-dom";
import styles from "../style/mainStyle.js";
import List from "@material-ui/core/List";
import MsgBadge from "./MsgBadge";

const useStyles = makeStyles(styles);
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});
const headersData = [
  {
    label: "Listings",
    href: "/listings",
  },
  {
    label: "Mentors",
    href: "/mentors",
  },
  {
    label: "My Account",
    href: "/account",
  },
  {
    label: "Log Out",
    href: "/logout",
  },
];

function ListItemLink(props) {
  return <ListItem button component="a" {...props} />;
}

const TopHeader = (props) => {
  const { isAuthenticated } = props;
  const history = useHistory();

  const [state, setState] = useState({
    mobileView: false,
    drawerOpen: false,
  });

  const { mobileView, drawerOpen } = state;

  useEffect(() => {
    const setResponsiveness = () => {
      return window.innerWidth < 900
        ? setState((prevState) => ({ ...prevState, mobileView: true }))
        : setState((prevState) => ({ ...prevState, mobileView: false }));
    };

    setResponsiveness();

    window.addEventListener("resize", () => setResponsiveness());

    return () => {
      window.removeEventListener("resize", () => setResponsiveness());
    };
  }, []);

  const [logoutModal, setLogoutModal] = React.useState(false);

  const scrollToTop = () => {
    scroll.scrollToTop();
    history.push("/");
  };
  const classes = useStyles();

  const handleLogOut = () => {
    authService.logOut().then((result) => {});

    setLogoutModal(false);
    storageService.removeStorage("token");
    storageService.removeStorage("user");
    storageService.removeStorage("skip");
    history.push("/");
    props.logout();
  };

  const user = storageService.getStorage("user");
  let user_id = 0;
  if (user !== null) {
    user_id = user.id;
  }

  const displayDesktop = () => {
    return (
      <Toolbar className={classes.toolbar}>
        <div className={classes.alignLeft}>
          <a href="/">
            <img
              src={logo}
              alt="..."
              width="100%"
              style={{ cursor: "pointer" }}
              onClick={scrollToTop}
            />
          </a>
        </div>

        <div className={classes.alignRight}>
          {isAuthenticated && (
            <Link style={{ color: "white" }} rel={"noindex nofollow"} to="#">
              <Button1
                style={{
                  backgroundColor: "#e12e3e",
                  border: "1px solid #e12e3e",
                }}
                onClick={() => history.push("/profile/" + user_id)}
              >
                プロフィール
              </Button1>
            </Link>
          )}
          {isAuthenticated ? (
            <Link style={{ color: "#e12e3e" }} rel={"noindex nofollow"} to="#">
              <Button1
                style={{
                  backgroundColor: "white",
                  color: "#e12e3e",
                  border: "1px solid #e12e3e",
                  marginLeft: "20px",
                }}
                onClick={() => setLogoutModal(true)}
              >
                ログアウト
              </Button1>
            </Link>
          ) : (
            <a
              href="/auth/login"
              style={{ color: "#e12e3e" }}
              rel={"noindex nofollow"}
            >
              <Button1
                style={{
                  backgroundColor: "white",
                  color: "#e12e3e",
                  border: "1px solid #e12e3e",
                  marginLeft: "20px",
                }}
              >
                ログイン
              </Button1>
            </a>
          )}
          {isAuthenticated && <MsgBadge />}
          {!isAuthenticated && (
            <a
              href="/auth/register"
              style={{ color: "white" }}
              rel={"noindex nofollow"}
            >
              <Button1
                style={{
                  backgroundColor: "#e12e3e",
                  border: "1px solid #e12e3e",
                }}
              >
                会員登録
              </Button1>
            </a>
          )}
          {isAuthenticated && (
            <Typography
              style={{
                padding: "14px",
                fontSize: "18px",
                fontWeight: "bold",
                color: "black",
              }}
            >
              {props.user.name}
            </Typography>
          )}
          <Typography
            style={{
              padding: "14px",
              fontWeight: "bold",
              fontSize: "16px",
              color: "black",
            }}
          >
            <i className="fas fa-phone"></i> 03-1111-2222
          </Typography>
          <ul>
            <li className={classes.navitem}>
              <Link
                activeClass="active"
                to="feature"
                spy={true}
                smooth={true}
                offset={-70}
                duration={500}
              >
                <span style={{ color: "black", fontSize: "12px" }}>特徴</span>
              </Link>
            </li>
            <li className={classes.navitem}>
              <Link
                activeClass="active"
                to="faq"
                spy={true}
                smooth={true}
                offset={-70}
                duration={500}
              >
                <span style={{ color: "black", fontSize: "12px" }}>Q＆A</span>
              </Link>
            </li>
            <li className={classes.navitem}>
              <Link
                activeClass="active"
                to="contact"
                spy={true}
                smooth={true}
                offset={-70}
                duration={500}
              >
                <span style={{ color: "black", fontSize: "12px" }}>
                  お問い合わせ
                </span>
              </Link>
            </li>
          </ul>
        </div>

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
      </Toolbar>
    );
  };

  const displayMobile = () => {
    const handleDrawerOpen = () =>
      setState((prevState) => ({ ...prevState, drawerOpen: true }));
    const handleDrawerClose = () =>
      setState((prevState) => ({ ...prevState, drawerOpen: false }));

    return (
      <Toolbar>
        <IconButton
          {...{
            edge: "start",
            color: "red",
            "aria-label": "menu",
            "aria-haspopup": "true",
            onClick: handleDrawerOpen,
          }}
        >
          <MenuIcon />
        </IconButton>

        <Drawer
          {...{
            anchor: "left",
            open: drawerOpen,
            onClose: handleDrawerClose,
          }}
        >
          <div className={classes.drawerContainer}>
            <div className={classes.sidebar}>
              <List component="nav" aria-label="secondary mailbox folders">
                {isAuthenticated && (
                  <Typography
                    style={{
                      padding: "14px",
                      fontSize: "18px",
                      fontWeight: "bold",
                      color: "black",
                    }}
                  >
                    {props.user.name}
                  </Typography>
                )}
                {isAuthenticated && (
                  <>
                    <ListItem
                      button
                      onClick={() => history.push("/profile/" + user_id)}
                    >
                      <ListItemText primary="プロフィール" />
                    </ListItem>
                    <Divider />
                  </>
                )}
                {isAuthenticated && (
                  <>
                    <ListItem
                      button
                      onClick={() => history.push("/adminProfile")}
                    >
                      <ListItemText primary="プロフィール" />
                    </ListItem>
                    <Divider />
                  </>
                )}
                <ListItemLink href="#simple-list">
                  <ListItemText primary="Spam" />
                </ListItemLink>
              </List>
              {isAuthenticated ? (
                <a
                  href="#"
                  style={{ color: "#e12e3e" }}
                  rel={"noindex nofollow"}
                >
                  <Button1
                    style={{
                      backgroundColor: "white",
                      color: "#e12e3e",
                      border: "1px solid #e12e3e",
                      marginLeft: "20px",
                    }}
                    onClick={() => setLogoutModal(true)}
                  >
                    ログアウト
                  </Button1>
                </a>
              ) : (
                <a
                  href="/auth/login"
                  style={{ color: "#e12e3e" }}
                  rel={"noindex nofollow"}
                >
                  <Button1
                    style={{
                      backgroundColor: "white",
                      color: "#e12e3e",
                      border: "1px solid #e12e3e",
                      marginLeft: "20px",
                    }}
                  >
                    ログイン
                  </Button1>
                </a>
              )}

              <Typography
                style={{
                  padding: "14px",
                  fontWeight: "bold",
                  fontSize: "16px",
                  color: "black",
                }}
              >
                <i className="fas fa-phone"></i> 03-1111-2222
              </Typography>
              <ul>
                <li className={classes.navitem}>
                  <Link
                    activeClass="active"
                    to="feature"
                    spy={true}
                    smooth={true}
                    offset={-70}
                    duration={500}
                  >
                    <span style={{ color: "black", fontSize: "12px" }}>
                      特徴
                    </span>
                  </Link>
                </li>
                <li className={classes.navitem}>
                  <Link
                    activeClass="active"
                    to="faq"
                    spy={true}
                    smooth={true}
                    offset={-70}
                    duration={500}
                  >
                    <span style={{ color: "black", fontSize: "12px" }}>
                      Q＆A
                    </span>
                  </Link>
                </li>
                <li className={classes.navitem}>
                  <Link
                    activeClass="active"
                    to="contact"
                    spy={true}
                    smooth={true}
                    offset={-70}
                    duration={500}
                  >
                    <span style={{ color: "black", fontSize: "12px" }}>
                      お問い合わせ
                    </span>
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </Drawer>
        <div>{femmecubatorLogo}</div>
      </Toolbar>
    );
  };

  const femmecubatorLogo = (
    <img
      src={logo}
      alt="..."
      width="15%"
      height="15%"
      style={{ cursor: "pointer" }}
      onClick={scrollToTop}
    />
  );

  return (
    <div className={classes.topbar}>
      <AppBar className={classes.topbar}>
        {mobileView ? displayMobile() : displayDesktop()}
      </AppBar>
    </div>
  );
};

const mapStateToProps = (state, ownProps) => ({
  isAuthenticated: state.auth.isAuthenticated,
  user: state.auth.user,
});

const mapDispatchToProps = {
  logout: authAction.Logout,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(TopHeader));
