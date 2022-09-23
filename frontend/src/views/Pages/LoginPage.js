import React, { useContext, useEffect, useState } from "react";

// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";
import {
  Router,
  Route,
  Switch,
  Redirect,
  withRouter,
  useLocation,
} from "react-router-dom";

import config from "config/config";
import AddAlert from "@material-ui/icons/AddAlert";
import SocialAuth from "views/components/SocialAuth";
// core components
import GridContainer from "components/Grid/GridContainer.js";
import Snackbar from "components/Snackbar/Snackbar.js";
import GridItem from "components/Grid/GridItem.js";
import CustomInput from "components/CustomInput/CustomInput.js";
import Button from "components/CustomButtons/Button.js";
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import CardHeader from "components/Card/CardHeader.js";
import logo from "assets/img/auth_logo.png";
import Success from "components/Typography/Success.js";

import * as authAction from "../../redux/actions/auth";
import * as authService from "../../services/authService";
import * as storageService from "../../services/storageService";

import styles from "assets/jss/material-dashboard-pro-react/views/loginPageStyle.js";

const useStyles = makeStyles(styles);

const LoginPage = (props) => {
  const [show, setShow] = useState(false);
  const [place, setPlace] = useState("br");
  const [message, setMessage] = useState("");

  const [cardAnimaton, setCardAnimation] = React.useState("cardHidden");
  const [loginEmail, setloginEmail] = React.useState("");
  const [loginEmailState, setloginEmailState] = React.useState("");
  const [loginPassword, setloginPassword] = React.useState("");
  const [loginPasswordState, setloginPasswordState] = React.useState("");
  const location = useLocation();
  const msg = location.msg;

  const verifyEmail = (value) => {
    var emailRex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (emailRex.test(value)) {
      return true;
    }
    return false;
  };

  const verifyLength = (value, length) => {
    if (value.length >= length) {
      return true;
    }
    return false;
  };

  const loginClick = () => {
    if (loginEmailState === "") {
      setloginEmailState("error");
    }
    if (loginPasswordState === "") {
      setloginPasswordState("error");
    }
    if (loginEmailState == "success" && loginPasswordState == "success") {
      authService
        .logIn({ email: loginEmail, password: loginPassword })
        .then((result) => {
          console.log("----------result:", result);

          if (result.statusText === "OK") {
            props.login(result.data.user);
            storageService.setStorage("token", result.data.access_token);
            storageService.setStorage("user", result.data.user);
            storageService.setStorage("skip", []);
            // console.log('--------result:', result.data.user.roles[0].id);
            props.history.push("/");
            // var roleid = result.data.user.roles[0].id;
            //   switch(roleid){
            //     case 1:
            //       return props.history.push("/admin/admin-dashboard");
            //     case 2:
            //       return props.history.push("/admin/client-dashboard");
            //     case 3:
            //       return props.history.push("/admin/business-dashboard");
            //     default:
            //       break;
            //   }
          } else {
            // showNotification('br', 'Login failed');
            showNotification("br", result.data.message);
            // setTimeout(() => {
            //   history.push("/admin/business-dashboard");
            // }, 2000);
          }
        })
        .catch((err) => {
          showNotification("br", "サーバーが応答しません。", "danger");
        });
    }
  };

  const socialAuthed = (data) => {
    if (data.isAuth) {
      props.login(data.user);
      storageService.setStorage('token', data.access_token);
      storageService.setStorage('user', data.user);
      storageService.setStorage('skip', []);
      props.history.push("/");
    } else {
      showNotification("br", "ユーザー登録をお願いしております。", "danger");
    }
  };

  React.useEffect(() => {
    let id = setTimeout(function () {
      setCardAnimation("");
    }, 700);
    // Specify how to clean up after this effect:
    return function cleanup() {
      window.clearTimeout(id);
    };
  });
  const classes = useStyles();
  const showNotification = (place, message) => {
    setPlace(place);
    setMessage(message);
    setShow(true);
    setTimeout(() => {
      setShow(false);
    }, 6000);
  };

  return (
    <div className={classes.container}>
      <div style={{ textAlign: "center" }}>
        <img src={logo} alt="..." width="23%" />
      </div>
      <GridContainer justifyContent="center">
        <GridItem xs={12} sm={6} md={5}>
          <Success>{msg}</Success>
          <Card login className={classes[cardAnimaton]}>
            <CardHeader className={classes.cardHeader}>
              <div className={classes.bottomeLine}>
                <span>
                  <b>ログイン</b>
                </span>
              </div>
            </CardHeader>
            <CardBody>
              <form>
                <CustomInput
                  success={loginEmailState === "success"}
                  error={loginEmailState === "error"}
                  labelText="メールアドレス *"
                  id="loginemail"
                  formControlProps={{
                    fullWidth: true,
                  }}
                  inputProps={{
                    onChange: (event) => {
                      if (verifyEmail(event.target.value)) {
                        setloginEmailState("success");
                      } else {
                        setloginEmailState("error");
                      }
                      setloginEmail(event.target.value);
                    },
                    type: "email",
                  }}
                />
                <CustomInput
                  success={loginPasswordState === "success"}
                  error={loginPasswordState === "error"}
                  labelText="パスワード *"
                  id="loginpassword"
                  formControlProps={{
                    fullWidth: true,
                  }}
                  inputProps={{
                    onChange: (event) => {
                      if (verifyLength(event.target.value, 1)) {
                        setloginPasswordState("success");
                      } else {
                        setloginPasswordState("error");
                      }
                      setloginPassword(event.target.value);
                    },
                    type: "password",
                    autoComplete: "off",
                  }}
                />
                <span style={{ fontSize: "10px" }}>
                  ※8〜16文字の半角英数字で入力してください.
                </span>
                <div className={classes.greyline}></div>
                <div className={classes.textCenter}>
                  <Button
                    style={{ backgroundColor: "#e12e3e" }}
                    onClick={loginClick}
                  >
                    ログイン
                  </Button>
                </div>
                <div style={{ textAlign: "center", margin: "10px 0" }}>
                  <span>
                    {" "}
                    パスワードを忘れた方は{" "}
                    <a
                      href="/auth/resetpass"
                      style={{ color: "#e12e3e", fontWeight: "bold" }}
                      rel={"noindex nofollow"}
                    >
                      こちら
                    </a>
                  </span>
                </div>
              </form>
            </CardBody>
          </Card>
          <Snackbar
            place={place}
            color="danger"
            icon={AddAlert}
            message={message}
            open={show}
            closeNotification={() => setShow(false)}
            close
          />
        </GridItem>
      </GridContainer>
      <div style={{ textAlign: "center" }}>
        <p>
          {" "}
          サービスのご利用には会員登録が必要です
          <br />
          会員登録は{" "}
          <a
            href="/auth/register"
            style={{ color: "#e12e3e", fontWeight: "bold" }}
            rel={"noindex nofollow"}
          >
            こちら
          </a>
        </p>
        <CardHeader className={classes.cardHeader}>
          <SocialAuth socialAuthed={socialAuthed} step="login"/>
        </CardHeader>
      </div>
    </div>
  );
};

const mapStateToProps = (state, ownProps) => ({
  user: state.auth.user,
});

const mapDispatchToProps = {
  login: authAction.Signin,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(LoginPage));
