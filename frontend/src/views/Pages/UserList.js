import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";

import FiberManualRecord from "@material-ui/icons/FiberManualRecord";
import AddAlert from "@material-ui/icons/AddAlert";

import * as userService from "services/userService";

import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Table from "components/Table/Table.js";
import Button from "components/CustomButtons/Button.js";
import Button1 from "components/CustomButtons/Button1.js";
import Button2 from "components/CustomButtons/Button2.js";
import CustomInput from "components/CustomInput/CustomInput.js";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import Snackbar from "components/Snackbar/Snackbar.js";
import Slide from "@material-ui/core/Slide";
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Radio from "@material-ui/core/Radio";

import styles from "../Components/style/mainStyle";

const useStyles = makeStyles(styles);

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});

const UserList = (props) => {
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

  const [deleteUsertModal, setDeleteUserModal] = React.useState(false);
  const [classicModal, setClassicModal] = React.useState(false);
  const [createUserModal, setCreateUserModal] = React.useState(false);
  const [usersTableData, setUsersTableData] = React.useState([]);
  const [alert, setAlert] = React.useState(null);
  const [selectedValue, setSelectedValue] = React.useState("business");

  const [show, setShow] = useState(false);
  const [place, setPlace] = useState("br");
  const [message, setMessage] = useState("");

  const [userId, setUserId] = React.useState(0);

  const [company, setCompany] = React.useState("");
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

  const errorText = () => {
    return (
      <div
        style={{
          backgroundColor: "#FBF2F3",
          textAlign: "center",
          marginTop: "-25px",
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
      <div
        style={{
          backgroundColor: "#FBF2F3",
          textAlign: "center",
          marginTop: "-25px",
          paddingLeft: "3px",
          color: "#e12e3e",
          borderRadius: "5px",
        }}
      >
        <span>入力されたパスワードが一致しません。</span>
      </div>
    );
  };

  const initClick = () => {
    setErrorContent("");
    setCreateUserModal(true);
  };

  const createUserClick = () => {
    if (companyState === "") {
      setCompanyState("error");
    }
    if (chargeManState === "") {
      setChargeManState("error");
    }
    if (phoneState === "") {
      setPhoneState("error");
    }
    if (emailState === "") {
      setEmailState("error");
    }
    if (passwdState === "") {
      setPasswdState("error");
    }
    if (confirmPasswdState === "") {
      setConfirmPasswdState("error");
    }

    if (
      companyState === "success" &&
      chargeManState === "success" &&
      phoneState === "success" &&
      emailState === "success" &&
      passwdState === "success"
    ) {
      if (confirmPasswdState !== "success") {
        setErrorContent(errorConfirmPasswd);
        return;
      }

      userService
        .createUser({
          company: company,
          name: chargeMan,
          phone: phone,
          email: email,
          password: passwd,
          role: selectedValue,
        })
        .then((result) => {
          if (result.status === 200) {
            showNotification("br", "Create Success!");

            fetchUsers();
            setCreateUserModal(false);
            // setTimeout(() => {
            //   // window.location.reload(false);
            //   Location.reload(false);
            // }, 2000);
          } else {
            showNotification("br", result.data);
          }
        })
        .catch((error) => {
          console.log(error);
        });
      showNotification(
        "br",
        "会員登録が完了しました。登録したメールアドレスとパスワードでログインしてください。"
      );
    } else {
      setErrorContent(errorText);
    }
  };

  const handleChange = (event) => {
    setSelectedValue(event.target.value);
  };

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
    userService
      .deleteUser({ id: userId })
      .then((res) => {
        if (res.data.message == "success") {
          console.log("Success to remove");
          fetchUsers();
        }
      })
      .catch((err) => {
        console.log(err);
      });

    setDeleteUserModal(false);
  };

  const fetchUsers = () => {
    userService
      .getUsers()
      .then((result) => {
        // console.log(result.data.users, 'users')
        if (result.data.message == "success" && result.data.users) {
          setUsersTableData(
            result.data.users.map((user, index) => {
              return [
                index + 1,
                user.company,
                user.name,
                user.phone,
                user.email,
                removeButtons(user.id),
              ];
            })
          );
        } else {
          console.log("error");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const showNotification = (place, message) => {
    setPlace(place);
    setMessage(message);
    setShow(true);
    setTimeout(() => {
      setShow(false);
    }, 6000);
  };

  const classes = useStyles();

  return (
    <div>
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
      <Dialog
        classes={{
          root: classes.center + " " + classes.modalRoot,
          paper: classes.modal,
        }}
        open={classicModal}
        TransitionComponent={Transition}
        keepMounted
        onClose={() => setClassicModal(false)}
        aria-labelledby="classic-modal-slide-title"
        aria-describedby="classic-modal-slide-description"
      >
        <DialogTitle
          id="classic-modal-slide-title"
          disableTypography
          className={classes.modalHeader}
        >
          <h4>
            <b>割当アカウントを選択してください</b>
          </h4>
        </DialogTitle>
        <DialogContent
          id="classic-modal-slide-description"
          className={classes.modalBody}
        ></DialogContent>
      </Dialog>
      <Dialog
        classes={{
          root: classes.center + " " + classes.modalRoot,
          paper: classes.modal,
        }}
        open={createUserModal}
        TransitionComponent={Transition}
        keepMounted
        onClose={() => setCreateUserModal(false)}
        aria-labelledby="classic-modal-slide-title"
        aria-describedby="classic-modal-slide-description"
      >
        <DialogTitle
          id="classic-modal-slide-title"
          disableTypography
          style={{ borderBottom: "1px solid lightgrey" }}
          className={classes.modalHeader}
        >
          <h4>
            <b>アカウント発行</b>
          </h4>
        </DialogTitle>
        <DialogContent
          id="classic-modal-slide-description"
          style={{ padding: "8px 30px" }}
        >
          <form style={{ textAlign: "left" }}>
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
              }}
            />
            <CustomInput
              success={chargeManState === "success"}
              error={chargeManState === "error"}
              labelText="担当者名 *"
              id="registerchargeman"
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
            <CustomInput
              success={phoneState === "success"}
              error={phoneState === "error"}
              labelText="電話番号 *"
              id="registerphone"
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
            <CustomInput
              success={emailState === "success"}
              error={emailState === "error"}
              labelText="メールアドレス *"
              id="registeremail"
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
            <CustomInput
              success={passwdState === "success"}
              error={passwdState === "error"}
              labelText="パスワード *"
              id="registerpassword"
              formControlProps={{
                fullWidth: true,
              }}
              inputProps={{
                onChange: (event) => {
                  if (verifyPasswd(event.target.value, 1)) {
                    setPasswdState("success");
                  } else {
                    setPasswdState("error");
                  }
                  setPasswd(event.target.value);
                },
                type: "password",
                autoComplete: "off",
              }}
            />
            <span style={{ fontSize: "12px" }}>
              ※8〜16文字の半角英数字で入力してください.
            </span>
            <CustomInput
              success={confirmPasswdState === "success"}
              error={confirmPasswdState === "error"}
              labelText="パスワード（確認用） *"
              id="registerconfirmpassword"
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
                autoComplete: "off",
              }}
            />
            <span>アカウント権限</span>
            <GridContainer justify="center" style={{ margin: "-10px -15px" }}>
              <GridItem xs={12} sm={4}>
                <div
                  className={
                    classes.checkboxAndRadio +
                    " " +
                    classes.checkboxAndRadioHorizontal
                  }
                >
                  <FormControlLabel
                    control={
                      <Radio
                        checked={selectedValue === "client"}
                        onChange={handleChange}
                        value="client"
                        name="client radio"
                        aria-label="2"
                        icon={
                          <FiberManualRecord
                            className={classes.radioUnchecked}
                          />
                        }
                        checkedIcon={
                          <FiberManualRecord className={classes.radioChecked} />
                        }
                        classes={{
                          checked: classes.radio,
                          root: classes.radioRoot,
                        }}
                      />
                    }
                    classes={{
                      label: classes.label,
                      root: classes.labelRoot,
                    }}
                    label="サービス利用者"
                  />
                </div>
              </GridItem>
              <GridItem xs={12} sm={4}>
                <div
                  className={
                    classes.checkboxAndRadio +
                    " " +
                    classes.checkboxAndRadioHorizontal
                  }
                >
                  <FormControlLabel
                    control={
                      <Radio
                        checked={selectedValue === "business"}
                        onChange={handleChange}
                        value="business"
                        name="business radio"
                        aria-label="3"
                        icon={
                          <FiberManualRecord
                            className={classes.radioUnchecked}
                          />
                        }
                        checkedIcon={
                          <FiberManualRecord className={classes.radioChecked} />
                        }
                        classes={{
                          checked: classes.radio,
                          root: classes.radioRoot,
                        }}
                      />
                    }
                    classes={{
                      label: classes.label,
                      root: classes.labelRoot,
                    }}
                    label="事業者"
                  />
                </div>
              </GridItem>
              <GridItem xs={12} sm={4}>
                <div
                  className={
                    classes.checkboxAndRadio +
                    " " +
                    classes.checkboxAndRadioHorizontal
                  }
                >
                  <FormControlLabel
                    control={
                      <Radio
                        checked={selectedValue === "admin"}
                        onChange={handleChange}
                        value="admin"
                        name="admin radio"
                        aria-label="1"
                        icon={
                          <FiberManualRecord
                            className={classes.radioUnchecked}
                          />
                        }
                        checkedIcon={
                          <FiberManualRecord className={classes.radioChecked} />
                        }
                        classes={{
                          checked: classes.radio,
                          root: classes.radioRoot,
                        }}
                      />
                    }
                    classes={{
                      label: classes.label,
                      root: classes.labelRoot,
                    }}
                    label="管理者"
                  />
                </div>
              </GridItem>
            </GridContainer>
            <div className={classes.greyline}></div>
            {errorContent}
            <div style={{ marginBottom: "20px" }}>
              <Button
                style={{ backgroundColor: "success", float: "left" }}
                onClick={() => setCreateUserModal(false)}
              >
                <b>キャンセル</b>
              </Button>
              <Button
                style={{ backgroundColor: "#e12e3e", float: "right" }}
                onClick={createUserClick}
              >
                <b>登録する</b>
              </Button>
            </div>
          </form>
        </DialogContent>
        <DialogActions></DialogActions>
      </Dialog>

      <GridContainer justify="center">
        <GridItem xs={12} sm={12} md={10}>
          <Card>
            <CardBody>
              <Table
                className={classes.fontSize}
                tableHeaderColor="primary"
                tableHead={[
                  "No",
                  "会社名",
                  "担当者名",
                  "電話番号",
                  "メールアドレス",
                  "操作",
                ]}
                tableData={usersTableData}
                coloredColls={[4]}
                colorsColls={["primary"]}
              />
            </CardBody>
          </Card>
        </GridItem>
        <GridItem
          xs={12}
          sm={12}
          md={2}
          style={{ marginTop: "30px", marginLeft: "-10px" }}
        >
          <Button1
            style={{ backgroundColor: "#e12e3e" }}
            onClick={() => initClick()}
          >
            アカウント発行
          </Button1>
        </GridItem>
        <Snackbar
          place={place}
          color="danger"
          icon={AddAlert}
          message={message}
          open={show}
          closeNotification={() => setShow(false)}
          close
        />
      </GridContainer>
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
)(withRouter(UserList));
