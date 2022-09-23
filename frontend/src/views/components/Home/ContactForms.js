/*eslint-disable*/
import React from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import FormLabel from "@material-ui/core/FormLabel";

// core components
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import CustomInput from "components/CustomInput/CustomInput.js";
import Button from "components/CustomButtons/Button.js";
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import Snackbar from "components/Snackbar/Snackbar.js";
import AddAlert from "@material-ui/icons/AddAlert";
import Success from "components/Typography/Success.js";
import Danger from "components/Typography/Danger.js";

import { httpService } from "services/httpService.js";

// style for this view
import styles from "views/Components/style/mainStyle";

const useStyles = makeStyles(styles);

export default function ContactForms({ id }) {
  // register form
  const [contactCompany, setContactCompany] = React.useState("");
  const [contactCompanyState, setContactCompanyState] = React.useState("error");
  const [contactName, setContactName] = React.useState("");
  const [contactNameState, setContactNameState] = React.useState("error");
  const [contactPhone, setContactPhone] = React.useState("");
  const [contactPhoneState, setContactPhoneState] = React.useState("error");
  const [contactEmail, setContactEmail] = React.useState("");
  const [contactEmailState, setContactEmailState] = React.useState("error");
  const [contactContent, setContactContent] = React.useState("");
  const [contactContentState, setContactContentState] = React.useState("error");

  const [show, setShow] = React.useState(false);
  const [place, setPlace] = React.useState("br");
  const [notifyColor, setNotifyColor] = React.useState("danger");
  const [message, setMessage] = React.useState("");

  const [messageSuccess, setMessageSuccess] = React.useState("");
  const [messageError, setMessageError] = React.useState("");

  // function that returns true if value is email, false otherwise
  const verifyEmail = (value) => {
    var emailRex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (emailRex.test(value)) {
      return true;
    }
    return false;
  };
  // function that verifies if a string has a given length or not
  const verifyLength = (value, length) => {
    if (value.length >= length) {
      return true;
    }
    return false;
  };
  // function that verifies if value contains only numbers
  const verifyNumber = (value) => {
    var numberRex = new RegExp("^[0-9]+$");
    if (numberRex.test(value)) {
      return true;
    }
    return false;
  };

  const contactClick = () => {
    if (
      contactCompanyState === "success" &&
      contactNameState === "success" &&
      contactPhoneState === "success" &&
      contactEmailState === "success" &&
      contactContentState === "success"
    ) {
      httpService
        .post("api/contact", {
          company: contactCompany,
          name: contactName,
          phone: contactPhone,
          email: contactEmail,
          content: contactContent,
        })
        .then((res) => {
          if (res.data.message == "success") {
            console.log(res.data);
            setMessageSuccess(
              "お問い合わせが完了しました。弊社担当者からの返信をお待ちください。"
            );
            setMessageError("");
            // showNotification('br', 'お問い合わせが完了しました。弊社担当者からの返信をお待ちください。', 'success');
          } else {
            // showNotification('br', res.data);
            setMessageSuccess("");
            setMessageError("入力された値が正しくありません。");
          }
        })
        .catch((err) => {
          console.log(err);
          setMessageSuccess("");
          setMessageError("サーバーが応答しません。");
          // showNotification('br', 'サーバーが応答しません。', 'danger');
        });
    } else {
      setMessageSuccess("");
      setMessageError("入力された値が正しくありません。");
    }
  };

  const classes = useStyles();
  const showNotification = (place, message, notifyColor) => {
    setPlace(place);
    setNotifyColor(notifyColor);
    setMessage(message);
    setShow(true);
    setTimeout(() => {
      setShow(false);
    }, 3000);
  };

  return (
    <div style={{ padding: "60px 5%", backgroundColor: "white" }} id={id}>
      <div style={{ textAlign: "center" }}>
        <p style={{ fontSize: "16px", color: "#e12e3e" }}>
          <b>お問い合わせ</b>
        </p>
        <p style={{ fontSize: "28px", margin: "20px 0 40px 0" }}>
          <b>お気軽にご相談ください</b>
        </p>
      </div>
      <GridContainer justify="center">
        <GridItem xs={12} sm={12} md={8}>
          <Card>
            <CardBody>
              <form style={{ padding: "30px 90px" }}>
                <GridContainer>
                  <GridItem xs={4} sm={4}>
                    <FormLabel className={classes.labelHorizontal}>
                      <span className={classes.contactSpan}>必須</span> 会社名
                    </FormLabel>
                  </GridItem>
                  <GridItem xs={8} sm={8}>
                    <CustomInput
                      success={contactCompanyState === "success"}
                      warning={contactCompanyState === "error"}
                      labelText="例）〇〇株式会社"
                      id="contactcompany"
                      formControlProps={{
                        fullWidth: true,
                      }}
                      inputProps={{
                        onChange: (event) => {
                          if (verifyLength(event.target.value, 1)) {
                            setContactCompanyState("success");
                          } else {
                            setContactCompanyState("error");
                          }
                          setContactCompany(event.target.value);
                        },
                        type: "text",
                      }}
                    />
                  </GridItem>
                </GridContainer>
                <GridContainer>
                  <GridItem xs={4} sm={4}>
                    <FormLabel className={classes.labelHorizontal}>
                      <span className={classes.contactSpan}>必須</span> お名前
                    </FormLabel>
                  </GridItem>
                  <GridItem xs={8} sm={8}>
                    <CustomInput
                      success={contactNameState === "success"}
                      warning={contactNameState === "error"}
                      labelText="例）シンプル太郎"
                      id="contactname"
                      formControlProps={{
                        fullWidth: true,
                      }}
                      inputProps={{
                        onChange: (event) => {
                          if (verifyLength(event.target.value, 1)) {
                            setContactNameState("success");
                          } else {
                            setContactNameState("error");
                          }
                          setContactName(event.target.value);
                        },
                        type: "text",
                      }}
                    />
                  </GridItem>
                </GridContainer>
                <GridContainer>
                  <GridItem xs={4} sm={4}>
                    <FormLabel className={classes.labelHorizontal}>
                      <span className={classes.contactSpan}>必須</span> 電話番号
                    </FormLabel>
                  </GridItem>
                  <GridItem xs={8} sm={8}>
                    <CustomInput
                      success={contactPhoneState === "success"}
                      warning={contactPhoneState === "error"}
                      labelText="例）01234567890"
                      id="contactphone"
                      formControlProps={{
                        fullWidth: true,
                      }}
                      inputProps={{
                        onChange: (event) => {
                          if (verifyNumber(event.target.value)) {
                            setContactPhoneState("success");
                          } else {
                            setContactPhoneState("error");
                          }
                          setContactPhone(event.target.value);
                        },
                        type: "text",
                      }}
                    />
                  </GridItem>
                </GridContainer>
                <GridContainer>
                  <GridItem xs={4} sm={4}>
                    <FormLabel className={classes.labelHorizontal}>
                      <span className={classes.contactSpan}>必須</span>{" "}
                      メールアドレス
                    </FormLabel>
                  </GridItem>
                  <GridItem xs={8} sm={8}>
                    <CustomInput
                      success={contactEmailState === "success"}
                      warning={contactEmailState === "error"}
                      labelText="例）simple@gmail.com
                    "
                      id="contactemail"
                      formControlProps={{
                        fullWidth: true,
                      }}
                      inputProps={{
                        onChange: (event) => {
                          if (verifyEmail(event.target.value)) {
                            setContactEmailState("success");
                          } else {
                            setContactEmailState("error");
                          }
                          setContactEmail(event.target.value);
                        },
                        type: "email",
                      }}
                    />
                  </GridItem>
                </GridContainer>
                <GridContainer>
                  <GridItem xs={4} sm={4}>
                    <FormLabel className={classes.labelHorizontal}>
                      <span className={classes.contactSpan}>必須</span>{" "}
                      お問い合わせ内容
                    </FormLabel>
                  </GridItem>
                  <GridItem xs={8} sm={8}>
                    <CustomInput
                      success={contactContentState === "success"}
                      warning={contactContentState === "error"}
                      id="contactcontent"
                      formControlProps={{
                        fullWidth: true,
                      }}
                      inputProps={{
                        multiline: true,
                        rows: 15,
                        onChange: (event) => {
                          if (verifyLength(event.target.value, 1)) {
                            setContactContentState("success");
                          } else {
                            setContactContentState("error");
                          }
                          setContactContent(event.target.value);
                        },
                        type: "text",
                      }}
                    />
                  </GridItem>
                </GridContainer>
                <div style={{ textAlign: "center" }}>
                  {messageSuccess !== "" && <Success>{messageSuccess}</Success>}
                  {messageError !== "" && <Danger>{messageError}</Danger>}
                </div>
                <div className={classes.center}>
                  <Button
                    style={{
                      padding: "15px 50px",
                      fontSize: "15px",
                      backgroundColor: "#e12e3e",
                    }}
                    onClick={contactClick}
                  >
                    送信する
                  </Button>
                </div>
              </form>
            </CardBody>
          </Card>
          <Snackbar
            place={place}
            // color="danger"
            color={notifyColor}
            icon={AddAlert}
            message={message}
            open={show}
            closeNotification={() => setShow(false)}
            close
          />
        </GridItem>
      </GridContainer>
    </div>
  );
}
