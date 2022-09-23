import React, { useEffect, useState, useRef } from "react";
import { connect } from "react-redux";
import { withRouter, useHistory } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";

import ChatContent from "views/Components/ChatContent.js";
import * as projectService from "services/projectService";

import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Card from "components/Card/Card.js";
import Button from "components/CustomButtons/Button.js";
import AdornedButton from "components/CustomButtons/AdornedButton.js";

import Slide from "@material-ui/core/Slide";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";

import styles from "./style/mainStyle.js";

const useStyles = makeStyles(styles);

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});

const TimelineContent = (props) => {
  const { projectId, user } = props;
  const history = useHistory();

  // console.log('-------prj:', projectId, ',', user)
  const [projectTitle, setProjectTitle] = React.useState("");
  const [deliveryDate, setDeliveryDate] = React.useState("");
  const [chatting, setChatting] = React.useState(false);
  var status = "";
  const [completeProjectModal, setCompleteProjectModal] = React.useState(false);
  const [projStatus, setProjStatus] = React.useState("");

  const [requestDataLink, setRequestDataLink] = React.useState([]);
  const [deliveryDataLink, setDeliveryDataLink] = React.useState([]);
  const [projDetail, setProjDetail] = React.useState([]);

  const [inProgress, setInProgress] = React.useState(false);

  // const projectId = project.id;
  // let projectstitle = "";
  // let deliverydate = "";

  // let path = window.location.pathname;
  // let id = path.slice(21);
  // projectService.getProjects().then(res => {
  //   let obj = res.data.projects.find(o => o.id == id);
  //   setProjectTitle(obj.title);
  //   setDeliveryDate(obj.delivery_date);

  //   status = obj.status;
  //   setProjStatus(status);
  //   if (status == "作業前" || status == "作業中" || status == "納品中" || status == "検収中")
  //     setChatting(true);
  // });

  // setProjectTitle(project.title);
  // setDeliveryDate(project.delivery_date);

  const refreshRequestData = () => {
    projectService
      .getProjectRequestData(projectId)
      .then((res) => {
        if (res.data.message == "success") {
          const requestData = res.data.data;
          // setRequestDataCount(requestData.length);
          // setRequestDataLink(requestData.map(a => a.request_data_link));
          setRequestDataLink(requestData);
        }
      })
      .catch((err) => {
        console.log(err);
        history.push("/auth/login");
        return <div />;
      });
  };

  const refreshDeliveryData = () => {
    projectService
      .getProjectDeliveryData(projectId)
      .then((res) => {
        if (res.data.message == "success") {
          const deliveryData = res.data.data;
          // setDeliveryDataCount(DeliveryData.length);
          // setDeliveryDataLink(DeliveryData.map(a => a.Delivery_data_link));
          setDeliveryDataLink(deliveryData);
        }
      })
      .catch((err) => {
        console.log(err);
        history.push("/auth/login");
        return <div />;
      });
  };

  const fillDetail = (detail) => {
    let projWork = [];

    if (detail.ground_data != null) {
      projWork.push(
        "グラウンドデータ (" +
          detail.ground_data_output +
          ") " +
          detail.ground_data +
          "ha"
      );
    }
    if (detail.simplified_drawing != null) {
      projWork.push(
        "簡易図化 (" +
          detail.simplified_drawing_output +
          ") " +
          detail.simplified_drawing +
          "ha"
      );
    }
    if (detail.contour_data != null) {
      projWork.push(
        "等高線 (" +
          detail.contour_data_output +
          ") " +
          detail.contour_data +
          "ha"
      );
    }
    if (detail.longitudinal_data != null) {
      projWork.push(
        "縦横断図 (" +
          detail.longitudinal_data_output +
          ") " +
          detail.longitudinal_data +
          "本"
      );
    }

    if (detail.mesh_soil_volume_output != null) {
      projWork.push("土量計算 (" + detail.mesh_soil_volume_output + ")");
    }
    if (detail.simple_orthphoto_output != null) {
      projWork.push("オルソ画像 (" + detail.simple_orthphoto_output + ")");
    }
    if (detail.simple_accuracy_table_output != null) {
      projWork.push(
        "簡易精度管理表 (" + detail.simple_accuracy_table_output + ")"
      );
    }
    if (detail.public_accuracy_table_output != null) {
      projWork.push(
        "公共精度管理表 (" + detail.public_accuracy_table_output + ")"
      );
    }
    setProjDetail(projWork);
  };

  useEffect(() => {
    if (typeof user.roles === "undefined") {
      history.push("/auth/login");
      return;
    }
    projectService
      .getProject(projectId)
      .then((res) => {
        if (res.data.message == "success") {
          const prj = res.data.project;
          // console.log('======= prj :', prj)
          // setProjStatus(prj.status);
          // setProject(prj);
          // projectstitle = prj.title;
          // deliverydate = prj.delivery_date;
          setProjectTitle(prj.title);
          setDeliveryDate(prj.delivery_date);
          fillDetail(prj.detail);

          status = prj.status;
          setProjStatus(status);
          if (
            status == "作業前" ||
            status == "作業中" ||
            status == "納品中" ||
            status == "検収中"
          )
            setChatting(true);
        }
      })
      .catch((err) => {
        console.log(err);
        history.push("/auth/login");
        return <div />;
      });

    refreshRequestData();
    refreshDeliveryData();

    // status = project.status;
    // setProjStatus(status);
    // console.log('--------status:', status);
    // if (status == "作業前" || status == "作業中" || status == "納品中" || status == "検収中")
    //   setChatting(true);
  }, []);

  const setStatusStart = () => {
    let setStatus = "作業中";
    setProjStatus(setStatus);
    projectService
      .setProjectStatus({ project_id: projectId, status: setStatus })
      .then(({ status, data }) => {
        if (status === 200) {
          // window.location.reload();
        }
      });
  };

  const setStatusDelivery = () => {
    let setStatus = "納品中";
    setProjStatus(setStatus);
    projectService
      .setProjectStatus({ project_id: projectId, status: setStatus })
      .then(({ status, data }) => {
        if (status === 200) {
          // window.location.reload();
        }
      });
  };

  const setStatusRequest = () => {
    let setStatus = "検収中";
    setProjStatus(setStatus);
    projectService
      .setProjectStatus({ project_id: projectId, status: setStatus })
      .then(({ status, data }) => {
        if (status === 200) {
          // window.location.reload();
        }
      });
  };

  const setStatusComplete = () => {
    let setStatus = "完了";
    setProjStatus(setStatus);
    setInProgress(true);

    projectService
      .setProjectStatus({ project_id: projectId, status: setStatus })
      .then(({ status, data }) => {
        // console.log('--------', status, ',', data);
        if (status === 200) {
          // window.location.reload();
          history.push("/admin/dashboard");
        }
        setCompleteProjectModal(false);
        setInProgress(false);
      })
      .catch((err) => {
        console.log(err);
        setCompleteProjectModal(false);
        setInProgress(false);
      });
  };

  const downloadFile = (data) => {
    const url = window.URL.createObjectURL(new Blob([data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "file.pdf"); //or any other extension
    document.body.appendChild(link);
    link.click();
  };

  const downloadOrder = () => {
    projectService
      .downloadOrder(projectId)
      .then(({ status, data }) => {
        if (status === 200) {
          downloadFile(data);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const downloadInvoice = () => {
    projectService
      .downloadInvoice(projectId)
      .then(({ status, data }) => {
        if (status === 200) {
          downloadFile(data);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const downloadRequestData = (id) => {
    // console.log('download:', id);
    projectService
      .downloadRequestData(id)
      .then(({ status, data }) => {
        if (status === 200) {
          downloadFile(data);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const downloadDeliveryData = (id) => {
    // console.log('download:', id);
    projectService
      .downloadDeliveryData(id)
      .then(({ status, data }) => {
        if (status === 200) {
          downloadFile(data);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const fileInputRef = useRef();
  const fileInputDeliveryRef = useRef();
  const submitRequestData = (e) => {
    // setSelectedFile(e.target.files[0]);
    const formData = new FormData();

    formData.append("pdf", e.target.files[0]);
    projectService
      .uploadRequestData(projectId, formData)
      .then(({ status, data }) => {
        if (status === 200) {
          refreshRequestData();
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const submitDeliveryData = (e) => {
    // setSelectedFile(e.target.files[0]);
    const formData = new FormData();

    formData.append("pdf", e.target.files[0]);
    projectService
      .uploadDeliveryData(projectId, formData)
      .then(({ status, data }) => {
        if (status === 200) {
          refreshDeliveryData();
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const deleteRequestData = (id) => {
    // console.log('download:', id);
    projectService
      .deleteRequestData(id)
      .then(({ status, data }) => {
        if (status === 200) {
          refreshRequestData();
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const deleteDeliveryData = (id) => {
    // console.log('download:', id);
    projectService
      .deleteDeliveryData(id)
      .then(({ status, data }) => {
        if (status === 200) {
          refreshDeliveryData();
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const classes = useStyles();

  const UploadRequestButtons = (props) => {
    const { downloads } = props;
    let articles = [];

    for (var i = downloads; i < 3; i++) {
      articles.push(i);
    }
    return articles.map((article, index) => (
      // <Article key={index} article={article} />
      <div className={classes.flexContent} key={index}>
        <Button
          style={{
            backgroundColor: "lightgrey",
            color: "black",
            padding: "10px 25px",
          }}
          onClick={() => fileInputRef.current.click()}
        >
          アップロード
        </Button>
        <input
          onChange={submitRequestData}
          multiple={false}
          ref={fileInputRef}
          type="file"
          hidden
        />
      </div>
    ));
  };

  const UploadDeliveryButtons = (props) => {
    const { downloads } = props;
    let articles = [];

    for (var i = downloads; i < 3; i++) {
      articles.push(i);
    }
    return articles.map((article, index) => (
      // <Article key={index} article={article} />
      <div className={classes.flexContent} key={index}>
        <Button
          style={{
            backgroundColor: "lightgrey",
            color: "black",
            padding: "10px 25px",
          }}
          onClick={() => fileInputDeliveryRef.current.click()}
        >
          アップロード
        </Button>
        <input
          onChange={submitDeliveryData}
          multiple={false}
          ref={fileInputDeliveryRef}
          type="file"
          hidden
        />
      </div>
    ));
  };

  return user.roles == null ? (
    <div />
  ) : (
    <div>
      <Dialog
        open={completeProjectModal}
        TransitionComponent={Transition}
        onClose={() => setCompleteProjectModal(false)}
      >
        <DialogContent>
          <DialogTitle disableTypography style={{ textAlign: "center" }}>
            <h4>
              <b>検収を完了しますか ？</b>
            </h4>
          </DialogTitle>
          <DialogActions
            className={classes.modalFooter + " " + classes.modalFooterCenter}
          >
            <Button
              onClick={() => setCompleteProjectModal(false)}
              style={{ backgroundColor: "lightgrey", color: "black" }}
            >
              キャンセル
            </Button>
            <AdornedButton
              loading={inProgress}
              style={{ backgroundColor: "#e12e3e" }}
              onClick={setStatusComplete}
              disabled={inProgress}
            >
              完了する
            </AdornedButton>
            {/* <Button
            style={{ backgroundColor: "#e12e3e" }}
            onClick={setStatusComplete}
          >
            完了する
          </Button> */}
          </DialogActions>
        </DialogContent>
      </Dialog>
      <Card>
        <div className={classes.timelinecontent}>
          <GridContainer justify="center">
            <GridItem xs={12} sm={7}>
              <p>案件名</p>
              <h4>
                <b>{projectTitle}</b>
              </h4>
            </GridItem>
            <GridItem xs={12} sm={3}>
              <p>目安納品日</p>
              <h4>
                <b>{deliveryDate}</b>
              </h4>
            </GridItem>
            <GridItem xs={12} sm={2}>
              {user.roles[0].id == 2 && (
                <Button
                  style={{ backgroundColor: "#e12e3e" }}
                  onClick={() => setCompleteProjectModal(true)}
                  disabled={projStatus != "検収中"}
                >
                  検収完了
                </Button>
              )}
              {user.roles[0].id == 1 && (
                <Button
                  style={{ backgroundColor: "#e12e3e", padding: "12px 15px" }}
                  onClick={setStatusRequest}
                  disabled={projStatus != "納品中"}
                >
                  検収リクエスト
                </Button>
              )}
              {user.roles[0].id == 3 && (
                <Button
                  style={{ backgroundColor: "#e12e3e" }}
                  onClick={setStatusDelivery}
                  disabled={projStatus != "作業中"}
                >
                  納品申請
                </Button>
              )}
            </GridItem>
          </GridContainer>
          <div className={classes.underline}></div>
          <GridContainer justify="center">
            {user.roles[0].id !== 3 && (
              <GridItem xs={12} sm={3} md={3}>
                <b>発注請書</b>
                <div>
                  <Button
                    style={{ backgroundColor: "lightgrey", color: "black" }}
                    onClick={downloadOrder}
                  >
                    ダウンロード
                  </Button>
                </div>
                <p style={{ margin: "30px 0 0 0" }}>
                  <b>請求書</b>
                </p>
                <div>
                  <Button
                    style={{ backgroundColor: "lightgrey", color: "black" }}
                    onClick={downloadInvoice}
                    disabled={projStatus != "完了"}
                  >
                    ダウンロード
                  </Button>
                </div>
              </GridItem>
            )}
            <GridItem xs={12} sm={3}>
              <b>必要成果物</b>
              {projDetail.map((item, key) => {
                return (
                  <div key={key}>
                    <Button
                      style={{
                        backgroundColor: "lightgrey",
                        color: "black",
                        textTransform: "none",
                        padding: "12px 15px",
                      }}
                      key={key}
                    >
                      {item}
                    </Button>
                  </div>
                );
              })}
            </GridItem>
            <GridItem xs={12} sm={3}>
              <b>依頼データ</b>
              {requestDataLink.map((item, key) => {
                return (
                  /* <p className={classes.attachText}>{item.request_data_link}</p> */
                  <div className={classes.flexContent} key={key}>
                    <Button
                      style={{
                        backgroundColor: "lightgrey",
                        color: "blue",
                        padding: "10px 25px",
                        textTransform: "none",
                      }}
                      onClick={() => downloadRequestData(item.id)}
                    >
                      <u>{item.request_data_link}</u>
                    </Button>
                    {user.roles[0].id == 1 && (
                      <Button
                        className={classes.roundBtn}
                        onClick={() => deleteRequestData(item.id)}
                      >
                        <DeleteForeverIcon />
                        {/* <i className="fa fa-remove" aria-hidden="true"></i> */}
                      </Button>
                    )}
                  </div>
                );
              })}
              {user.roles[0].id <= 2 && (
                <UploadRequestButtons downloads={requestDataLink.length} />
              )}
            </GridItem>
            <GridItem xs={12} sm={3}>
              <b>成果物データ</b>
              {deliveryDataLink.map((item, key) => {
                return (
                  /* <p className={classes.attachText}>{item.deliverable_data_link}</p> */
                  <div className={classes.flexContent} key={key}>
                    <Button
                      style={{
                        backgroundColor: "lightgrey",
                        color: "blue",
                        padding: "10px 25px",
                        textTransform: "none",
                      }}
                      onClick={() => downloadDeliveryData(item.id)}
                    >
                      <u>{item.deliverable_data_link}</u>
                    </Button>
                    {user.roles[0].id == 1 && (
                      <Button
                        className={classes.roundBtn}
                        onClick={() => deleteDeliveryData(item.id)}
                      >
                        <DeleteForeverIcon />
                        {/* <i className="fa fa-remove" aria-hidden="true"></i> */}
                      </Button>
                    )}
                  </div>
                );
              })}
              {user.roles[0].id != 2 && (
                <UploadDeliveryButtons downloads={deliveryDataLink.length} />
              )}
            </GridItem>
            {user.roles[0].id == 3 && (
              <GridItem xs={12} sm={3}>
                <div style={{ textAlign: "center", paddingTop: "50px" }}>
                  <Button
                    style={{
                      backgroundColor: "white",
                      color: "#e12e3e",
                      border: "1px solid red",
                    }}
                    onClick={setStatusStart}
                    disabled={projStatus != "作業前"}
                  >
                    作業開始
                  </Button>
                </div>
              </GridItem>
            )}
          </GridContainer>
          <div className={classes.description}>
            <p>※ ファイルは .zip や .rar などに圧縮するようにお願いします</p>
          </div>
          <div className={classes.underline}></div>
          {chatting ? (
            <GridContainer justify="center">
              <ChatContent projectId={projectId} />
            </GridContainer>
          ) : (
            <div />
          )}
        </div>
      </Card>
    </div>
  );
};

const mapStateToProps = () => ({});

// const mapStateToProps = (state, ownProps) => ({
//   user: state.auth.user,
//   project: ownProps.project
// })

const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(TimelineContent));
