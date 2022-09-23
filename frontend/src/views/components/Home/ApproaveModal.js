import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { withRouter, useHistory } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";

import AttachFileOutlinedIcon from "@material-ui/icons/AttachFileOutlined";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";

import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Table from "components/Table/Table.js";
import Button from "@material-ui/core/Button";
import Button1 from "components/CustomButtons/Button1.js";
import Button2 from "components/CustomButtons/Button2.js";
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import Slide from "@material-ui/core/Slide";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import Switch from "@material-ui/core/Switch";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Avatar from "@material-ui/core/Avatar";
import Typography from "@material-ui/core/Typography";
import * as userService from "services/userService";
import styles from "../../components/style/mainStyle";
import config from "config/config";
import AvatarImage from "assets/img/faces/noname.jpg";

const useStyles = makeStyles(styles);

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});

const ApproaveModal = (props) => {
  // const [businessData, setBusinessData] = React.useState([]);
  const history = useHistory();

  const [likeMeList, setLikeMeList] = useState([]);

  const handleApproaveItem = (id) => {
    let listCopy = [...likeMeList];
    for (let item of listCopy) {
      if (item.id === id) {
        if (item.status == "pending") item.status = "approve";
        else item.status = "pending";
      }
    }

    setLikeMeList(listCopy);
  };

  const handleCancelModal = () => {
    props.handleModal();
  };

  const handleConfirmModal = () => {
    let approaveData = new FormData();
    approaveData.append("approaves", JSON.stringify(likeMeList));

    userService.setUsersApproave(approaveData).then((result) => {
      console.log(result);
    });
    props.handleModal();
  };

  useEffect(() => {
    userService.getUsersApproave(props.userid).then((result) => {
      if (result.data.list !== null) {
        setLikeMeList(result.data.list);
      }
    });
  }, []);

  const classes = useStyles();

  return (
    <div>
      <Dialog
        classes={{
          root: classes.center + " " + classes.modalRoot,
          paper: classes.modal,
        }}
        open={true}
        fullWidth
        maxWidth="xs"
        TransitionComponent={Transition}
        keepMounted
        aria-labelledby="classic-modal-slide-title"
        aria-describedby="classic-modal-slide-description"
      >
        <DialogTitle
          id="classic-modal-slide-title"
          disableTypography
          className={classes.modalHeader}
          style={{ borderBottom: "1px solid lightgrey" }}
        >
          <h4>
            <b>好きなもののリスト</b>
          </h4>
        </DialogTitle>
        <DialogContent
          id="classic-modal-slide-description"
          className={classes.modalBody}
          style={{ padding: "0 24px 15px 24px" }}
        >
          {/* {businessData} */}
          {likeMeList &&
            likeMeList.map((item) => {
              const profileImg = item.avatar
                ? config.baseUrl + "avatars/" + item.avatar
                : AvatarImage;

              return (
                <GridContainer
                  key={item.id}
                  style={{ borderBottom: "1px solid lightgrey", height: 60 }}
                >
                  <GridItem
                    xs={12}
                    sm={2}
                    md={1}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      marginLeft: 5,
                    }}
                  >
                    <Avatar alt={`Avatar n°${item.id + 1}`} src={profileImg} />
                  </GridItem>
                  <GridItem
                    xs={12}
                    sm={5}
                    md={5}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      marginLeft: 10,
                    }}
                  >
                    <Typography variant="h6">{item.name}</Typography>;
                  </GridItem>
                  <GridItem
                    xs={12}
                    sm={4}
                    md={5}
                    style={{ display: "flex", alignItems: "center" }}
                  >
                    <FormControlLabel
                      control={
                        <Switch
                          checked={item.status === "pending" ? false : true}
                          onChange={() => handleApproaveItem(item.id)}
                        />
                      }
                      label={
                        item.status === "pending" ? "ペンディング" : "承認"
                      }
                    />
                  </GridItem>
                </GridContainer>
              );
            })}
          <DialogActions
            className={classes.modalFooter + " " + classes.modalFooterCenter}
            style={{ marginTop: 10 }}
          >
            <Button
              onClick={handleCancelModal}
              size="small"
              style={{ backgroundColor: "lightgrey", color: "black" }}
            >
              キャンセル
            </Button>
            <Button
              onClick={handleConfirmModal}
              size="small"
              style={{ backgroundColor: "#e91e63", color: "white" }}
            >
              承認する
            </Button>
          </DialogActions>
        </DialogContent>
      </Dialog>
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
)(withRouter(ApproaveModal));
