import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import AddAlert from "@material-ui/icons/AddAlert";
import { makeStyles } from "@material-ui/core/styles";

import * as userService from "services/userService";
import * as mainAction from "redux/actions/main";

import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import FormLabel from "@material-ui/core/FormLabel";
import Button from "components/CustomButtons/Button.js";
import CustomInput from "components/CustomInput/CustomInput.js";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import Snackbar from "components/Snackbar/Snackbar.js";
import Slide from "@material-ui/core/Slide";
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";

import styles from "../Components/style/mainStyle";

const useStyles = makeStyles(styles);

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});

const errorText = () => {
  return (
    // <div style={{ backgroundColor: "#FBF2F3", marginTop: "25px", paddingLeft: "20px", color: "#e12e3e", borderRadius: "5px" }}>
    <div
      style={{
        backgroundColor: "#FBF2F3",
        marginTop: "5px",
        paddingLeft: "3px",
        color: "#e12e3e",
        borderRadius: "5px",
      }}
    >
      <span>入力された情報が正しくありません。</span>
    </div>
  );
};

const errorConfirmPasswd = () => {
  return (
    // <div style={{ backgroundColor: "#FBF2F3", marginTop: "25px", paddingLeft: "20px", color: "#e12e3e", borderRadius: "5px" }}>
    <div
      style={{
        backgroundColor: "#FBF2F3",
        marginTop: "5px",
        paddingLeft: "3px",
        color: "#e12e3e",
        borderRadius: "5px",
      }}
    >
      <span>入力されたパスワードが一致しません。</span>
    </div>
  );
};

const ProfileUpdate = ({ MiniActive, user }) => {
  const verifyEmail = (value) => {
    var emailRex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (emailRex.test(value)) {
      return true;
    }
    return false;
  };

  const verifyPhoneNumber = (value) => {
    var numberRex = new RegExp("^[0-9]+$");
    if (value.length <= 11 && numberRex.test(value)) {
      return true;
    }
    return false;
  };

  const verifyLengthMinMax = (value, min, max) => {
    if (value.length >= min && value.length <= max) {
      return true;
    }
    return false;
  };

  const verifyPasswd = (value) => {
    if (value.length >= 8 && value.length <= 16) {
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

  const [classicModalCompany, setClassicModalCompany] = React.useState(false);
  const [classicModalName, setClassicModalName] = React.useState(false);
  const [classicModalPhone, setClassicModalPhone] = React.useState(false);
  const [classicModalMail, setClassicModalMail] = React.useState(false);
  const [classicModalPasswd, setClassicModalPasswd] = React.useState(false);
  const [show, setShow] = useState(false);
  const [place, setPlace] = useState("br");
  const [message, setMessage] = useState("");

  const [companyInfo, setCompanyInfo] = React.useState(user.company);
  const [chargeManInfo, setChargeManInfo] = React.useState(user.name);
  const [phoneInfo, setPhoneInfo] = React.useState(user.phone);
  const [emailInfo, setEmailInfo] = React.useState(user.email);
  const [passwdInfo, setPasswdInfo] = React.useState("12345678");

  const [company, setCompany] = React.useState();
  const [companyState, setCompanyState] = React.useState("");
  const [chargeMan, setChargeMan] = React.useState("");
  const [chargeManState, setChargeManState] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [phoneState, setPhoneState] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [emailState, setEmailState] = React.useState("");
  const [passwd, setPasswd] = React.useState("");
  const [passwdState, setPasswdState] = React.useState("");
  const [confirmPasswd, setConfirmPasswd] = React.useState("");
  const [confirmPasswdState, setConfirmPasswdState] = React.useState("");

  const [errorContent, setErrorContent] = React.useState("");

  const initClickCompany = () => {
    setCompanyState("");
    setErrorContent("");
    setClassicModalCompany(true);
  };

  const changeClickCompany = () => {
    if (companyState !== "success") {
      setCompanyState("error");
      setErrorContent(errorText);
    } else {
      userService
        .updateUserCompany({
          id: user.id,
          company: company,
          name: chargeMan,
          phone: phone,
          email: email,
        })
        .then((res) => {
          if (res.data.message == "success") {
            console.log("Success to update");
            setCompanyInfo(company);
          }
        })
        .catch((err) => {
          console.log(err);
        });
      setClassicModalCompany(false);
    }
  };

  const initClickName = () => {
    setChargeManState("");
    setErrorContent("");
    setClassicModalName(true);
  };

  const changeClickName = () => {
    if (chargeManState !== "success") {
      setChargeManState("error");
      setErrorContent(errorText);
    } else {
      userService
        .updateUserName({
          id: user.id,
          company: company,
          name: chargeMan,
          phone: phone,
          email: email,
        })
        .then((res) => {
          if (res.data.message == "success") {
            console.log("Success to update");
            setChargeManInfo(chargeMan);
          }
        })
        .catch((err) => {
          console.log(err);
        });
      setClassicModalName(false);
    }
  };

  const initClickPhone = () => {
    setPhoneState("");
    setErrorContent("");
    setClassicModalPhone(true);
  };

  const changeClickPhone = () => {
    if (phoneState !== "success") {
      setPhoneState("error");
      setErrorContent(errorText);
    } else {
      userService
        .updateUserPhone({
          id: user.id,
          company: company,
          name: chargeMan,
          phone: phone,
          email: email,
        })
        .then((res) => {
          if (res.data.message == "success") {
            console.log("Success to update");
            setPhoneInfo(phone);
          }
        })
        .catch((err) => {
          console.log(err);
        });
      setClassicModalPhone(false);
    }
  };

  const initClickMail = () => {
    setEmailState("");
    setErrorContent("");
    setClassicModalMail(true);
  };

  const changeClickMail = () => {
    if (emailState !== "success") {
      setEmailState("error");
      setErrorContent(errorText);
    } else {
      userService
        .updateUserMail({
          id: user.id,
          company: company,
          name: chargeMan,
          phone: phone,
          email: email,
        })
        .then((res) => {
          if (res.data.message == "success") {
            console.log("Success to update");
            setEmailInfo(email);
          }
        })
        .catch((err) => {
          console.log(err);
        });
      setClassicModalMail(false);
    }
    // if(companyState !== "" && chargeManState !== "" && phoneState !== "" && emailState !== ""){
    //     showNotification('br', '会員登録が完了しました。登録したメールアドレスとパスワードでログインしてください。');
    // }
  };

  const initClickPasswd = () => {
    setPasswdState("");
    setErrorContent("");
    setClassicModalPasswd(true);
  };

  const changeClickPasswd = () => {
    if (passwdState !== "success") {
      setPasswdState("error");
      setErrorContent(errorText);
    } else if (confirmPasswdState !== "success") {
      setConfirmPasswdState("error");
      setErrorContent(errorConfirmPasswd);
    } else {
      userService
        .updateUserPasswd({ id: user.id, passwd: passwd })
        .then((res) => {
          if (res.data.message == "success") {
            console.log("Success to update");
            setPasswdInfo(passwd);
          }
        })
        .catch((err) => {
          console.log(err);
        });
      setClassicModalPasswd(false);
    }
  };

  const showNotification = (place, message) => {
    setPlace(place);
    setMessage(message);
    setShow(true);
    setTimeout(() => {
      setShow(false);
    }, 6000);
  };

  useEffect(() => {
    console.log("object");
    MiniActive(false);
  }, []);

  const classes = useStyles();

  return (
    <div>
      <Card>
        <CardBody>
          <div className={classes.changeProfile}>
            <GridContainer>
              {/* ------------------ Company */}
              <Dialog
                classes={{
                  root: classes.center + " " + classes.modalRoot,
                  paper: classes.modal,
                }}
                open={classicModalCompany}
                TransitionComponent={Transition}
                keepMounted
                onClose={() => setClassicModalCompany(false)}
                aria-labelledby="classic-modal-slide-title"
                aria-describedby="classic-modal-slide-description"
              >
                <DialogTitle
                  id="classic-modal-slide-title"
                  disableTypography
                  className={classes.modalHeader}
                >
                  <h4>
                    <b>登録情報</b>
                  </h4>
                </DialogTitle>
                <DialogContent
                  id="classic-modal-slide-description"
                  className={classes.modalBody}
                >
                  {errorContent}
                  <CustomInput
                    success={companyState === "success"}
                    error={companyState === "error"}
                    labelText="会社名 *"
                    id="company"
                    formControlProps={{
                      fullWidth: true,
                    }}
                    inputProps={{
                      onChange: (event) => {
                        if (verifyLengthMinMax(event.target.value, 1, 30)) {
                          setCompanyState("success");
                        } else {
                          setCompanyState("error");
                        }
                        setCompany(event.target.value);
                      },
                      type: "text",
                      autoComplete: "off",
                    }}
                  />
                </DialogContent>
                <DialogActions className={classes.modalFooter}>
                  <Button color="transparent" onClick={changeClickCompany}>
                    変更
                  </Button>
                  <Button
                    onClick={() => setClassicModalCompany(false)}
                    color="danger"
                    simple
                  >
                    キャンセル
                  </Button>
                </DialogActions>
              </Dialog>
              {/* ------------------ Name */}
              <Dialog
                classes={{
                  root: classes.center + " " + classes.modalRoot,
                  paper: classes.modal,
                }}
                open={classicModalName}
                TransitionComponent={Transition}
                keepMounted
                onClose={() => setClassicModalName(false)}
                aria-labelledby="classic-modal-slide-title"
                aria-describedby="classic-modal-slide-description"
              >
                <DialogTitle
                  id="classic-modal-slide-title"
                  disableTypography
                  className={classes.modalHeader}
                >
                  <h4>
                    <b>登録情報</b>
                  </h4>
                </DialogTitle>
                <DialogContent
                  id="classic-modal-slide-description"
                  className={classes.modalBody}
                >
                  {errorContent}
                  <CustomInput
                    success={chargeManState === "success"}
                    error={chargeManState === "error"}
                    labelText="担当者名 *"
                    id="chargeman"
                    formControlProps={{
                      fullWidth: true,
                    }}
                    inputProps={{
                      onChange: (event) => {
                        if (verifyLengthMinMax(event.target.value, 1, 10)) {
                          setChargeManState("success");
                        } else {
                          setChargeManState("error");
                        }
                        setChargeMan(event.target.value);
                      },
                      type: "text",
                    }}
                  />
                </DialogContent>
                <DialogActions className={classes.modalFooter}>
                  <Button color="transparent" onClick={changeClickName}>
                    変更
                  </Button>
                  <Button
                    onClick={() => setClassicModalName(false)}
                    color="danger"
                    simple
                  >
                    キャンセル
                  </Button>
                </DialogActions>
              </Dialog>
              {/* ------------------ Phone */}
              <Dialog
                classes={{
                  root: classes.center + " " + classes.modalRoot,
                  paper: classes.modal,
                }}
                open={classicModalPhone}
                TransitionComponent={Transition}
                keepMounted
                onClose={() => setClassicModalPhone(false)}
                aria-labelledby="classic-modal-slide-title"
                aria-describedby="classic-modal-slide-description"
              >
                <DialogTitle
                  id="classic-modal-slide-title"
                  disableTypography
                  className={classes.modalHeader}
                >
                  <h4>
                    <b>登録情報</b>
                  </h4>
                </DialogTitle>
                <DialogContent
                  id="classic-modal-slide-description"
                  className={classes.modalBody}
                >
                  {errorContent}
                  <CustomInput
                    success={phoneState === "success"}
                    error={phoneState === "error"}
                    labelText="電話番号 *"
                    id="phone"
                    formControlProps={{
                      fullWidth: true,
                    }}
                    inputProps={{
                      onChange: (event) => {
                        if (verifyPhoneNumber(event.target.value)) {
                          setPhoneState("success");
                        } else {
                          setPhoneState("error");
                        }
                        setPhone(event.target.value);
                      },
                      type: "text",
                    }}
                  />
                </DialogContent>
                <DialogActions className={classes.modalFooter}>
                  <Button color="transparent" onClick={changeClickPhone}>
                    変更
                  </Button>
                  <Button
                    onClick={() => setClassicModalPhone(false)}
                    color="danger"
                    simple
                  >
                    キャンセル
                  </Button>
                </DialogActions>
              </Dialog>
              {/* ------------------ Mail */}
              <Dialog
                classes={{
                  root: classes.center + " " + classes.modalRoot,
                  paper: classes.modal,
                }}
                open={classicModalMail}
                TransitionComponent={Transition}
                keepMounted
                onClose={() => setClassicModalMail(false)}
                aria-labelledby="classic-modal-slide-title"
                aria-describedby="classic-modal-slide-description"
              >
                <DialogTitle
                  id="classic-modal-slide-title"
                  disableTypography
                  className={classes.modalHeader}
                >
                  <h4>
                    <b>登録情報</b>
                  </h4>
                </DialogTitle>
                <DialogContent
                  id="classic-modal-slide-description"
                  className={classes.modalBody}
                >
                  {errorContent}
                  <CustomInput
                    success={emailState === "success"}
                    error={emailState === "error"}
                    labelText="メールアドレス *"
                    id="email"
                    formControlProps={{
                      fullWidth: true,
                    }}
                    inputProps={{
                      onChange: (event) => {
                        if (verifyEmail(event.target.value)) {
                          setEmailState("success");
                        } else {
                          setEmailState("error");
                        }
                        setEmail(event.target.value);
                      },
                      type: "email",
                    }}
                  />
                </DialogContent>
                <DialogActions className={classes.modalFooter}>
                  <Button color="transparent" onClick={changeClickMail}>
                    変更
                  </Button>
                  <Button
                    onClick={() => setClassicModalMail(false)}
                    color="danger"
                    simple
                  >
                    キャンセル
                  </Button>
                </DialogActions>
              </Dialog>
              {/* ------------------ Password */}
              <Dialog
                classes={{
                  root: classes.center + " " + classes.modalRoot,
                  paper: classes.modal,
                }}
                open={classicModalPasswd}
                TransitionComponent={Transition}
                keepMounted
                onClose={() => setClassicModalPasswd(false)}
                aria-labelledby="classic-modal-slide-title"
                aria-describedby="classic-modal-slide-description"
              >
                <DialogTitle
                  id="classic-modal-slide-title"
                  disableTypography
                  className={classes.modalHeader}
                >
                  <h4>
                    <b>登録情報</b>
                  </h4>
                </DialogTitle>
                <DialogContent
                  id="classic-modal-slide-description"
                  className={classes.modalBody}
                >
                  {errorContent}
                  <CustomInput
                    success={passwdState === "success"}
                    error={passwdState === "error"}
                    labelText="パスワード"
                    id="passwd"
                    formControlProps={{
                      fullWidth: true,
                    }}
                    inputProps={{
                      onChange: (event) => {
                        if (verifyPasswd(event.target.value)) {
                          setPasswdState("success");
                        } else {
                          setPasswdState("error");
                        }
                        setPasswd(event.target.value);
                      },
                      type: "password",
                    }}
                  />
                  <span style={{ fontSize: "10px" }}>
                    ※8〜16文字の半角英数字で入力してください.
                  </span>
                  <CustomInput
                    success={confirmPasswdState === "success"}
                    error={confirmPasswdState === "error"}
                    labelText="パスワード（確認用） *"
                    id="confirmPasswd"
                    formControlProps={{
                      fullWidth: true,
                    }}
                    inputProps={{
                      onChange: (event) => {
                        if (passwd === event.target.value) {
                          setConfirmPasswdState("success");
                        } else {
                          setConfirmPasswdState("error");
                        }
                        setConfirmPasswd(event.target.value);
                      },
                      type: "password",
                    }}
                  />
                </DialogContent>
                <DialogActions className={classes.modalFooter}>
                  <Button color="transparent" onClick={changeClickPasswd}>
                    変更
                  </Button>
                  <Button
                    onClick={() => setClassicModalPasswd(false)}
                    color="danger"
                    simple
                  >
                    キャンセル
                  </Button>
                </DialogActions>
              </Dialog>

              <GridItem xs={12} sm={2} md={2}></GridItem>
              <GridItem xs={12} sm={4} md={4}>
                <FormLabel className={classes.labelHorizontal}>
                  会社名
                </FormLabel>
              </GridItem>
              <GridItem xs={12} sm={4} md={4}>
                <CustomInput
                  id="disabled"
                  formControlProps={{
                    fullWidth: true,
                  }}
                  inputProps={{
                    value: companyInfo,
                    disabled: true,
                  }}
                />
              </GridItem>
              <GridItem xs={12} sm={1} md={1}>
                <Button
                  style={{ backgroundColor: "#e12e3e" }}
                  onClick={() => initClickCompany()}
                >
                  変更
                </Button>
              </GridItem>
              <GridItem xs={12} sm={1} md={1}></GridItem>
            </GridContainer>
            <GridContainer>
              <GridItem xs={12} sm={2} md={2}></GridItem>
              <GridItem xs={12} sm={4} md={4}>
                <FormLabel className={classes.labelHorizontal}>
                  担当者名
                </FormLabel>
              </GridItem>
              <GridItem xs={12} sm={4} md={4}>
                <CustomInput
                  id="disabled"
                  formControlProps={{
                    fullWidth: true,
                  }}
                  inputProps={{
                    value: chargeManInfo,
                    disabled: true,
                  }}
                />
              </GridItem>
              <GridItem xs={12} sm={1} md={1}>
                <Button
                  style={{ backgroundColor: "#e12e3e" }}
                  onClick={() => initClickName()}
                >
                  変更
                </Button>
              </GridItem>
              <GridItem xs={12} sm={1} md={1}></GridItem>
            </GridContainer>
            <GridContainer>
              <GridItem xs={12} sm={2} md={2}></GridItem>
              <GridItem xs={12} sm={4} md={4}>
                <FormLabel className={classes.labelHorizontal}>
                  電話番号
                </FormLabel>
              </GridItem>
              <GridItem xs={12} sm={4} md={4}>
                <CustomInput
                  id="disabled"
                  formControlProps={{
                    fullWidth: true,
                  }}
                  inputProps={{
                    value: phoneInfo,
                    disabled: true,
                  }}
                />
              </GridItem>
              <GridItem xs={12} sm={1} md={1}>
                <Button
                  style={{ backgroundColor: "#e12e3e" }}
                  onClick={() => initClickPhone()}
                >
                  変更
                </Button>
              </GridItem>
              <GridItem xs={12} sm={1} md={1}></GridItem>
            </GridContainer>
            <GridContainer>
              <GridItem xs={12} sm={2} md={2}></GridItem>
              <GridItem xs={12} sm={4} md={4}>
                <FormLabel className={classes.labelHorizontal}>
                  メールアドレス
                </FormLabel>
              </GridItem>
              <GridItem xs={12} sm={4} md={4}>
                <CustomInput
                  id="disabled"
                  formControlProps={{
                    fullWidth: true,
                  }}
                  inputProps={{
                    value: emailInfo,
                    disabled: true,
                  }}
                />
              </GridItem>
              <GridItem xs={12} sm={1} md={1}>
                <Button
                  style={{ backgroundColor: "#e12e3e" }}
                  onClick={() => initClickMail()}
                >
                  変更
                </Button>
              </GridItem>
              <GridItem xs={12} sm={1} md={1}></GridItem>
            </GridContainer>
            <GridContainer>
              <GridItem xs={12} sm={2} md={2}></GridItem>
              <GridItem xs={12} sm={4} md={4}>
                <FormLabel className={classes.labelHorizontal}>
                  パスワード
                </FormLabel>
              </GridItem>
              <GridItem xs={12} sm={4} md={4}>
                <CustomInput
                  id="disabled"
                  formControlProps={{
                    fullWidth: true,
                  }}
                  inputProps={{
                    value: passwdInfo,
                    type: "password",
                    disabled: true,
                  }}
                />
              </GridItem>
              <GridItem xs={12} sm={1} md={1}>
                <Button
                  style={{ backgroundColor: "#e12e3e" }}
                  onClick={() => initClickPasswd()}
                >
                  変更
                </Button>
              </GridItem>
              <GridItem xs={12} sm={1} md={1}></GridItem>
            </GridContainer>
          </div>

          <Snackbar
            place={place}
            color="danger"
            icon={AddAlert}
            message={message}
            open={show}
            closeNotification={() => setShow(false)}
            close
          />
        </CardBody>
      </Card>
    </div>
  );
};

const mapStateToProps = (state, ownProps) => ({
  user: state.auth.user,
});

const mapDispatchToProps = {
  MiniActive: mainAction.MiniActive,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(ProfileUpdate));
