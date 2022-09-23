import React, { Fragment, useEffect, useState } from "react";
import { withRouter, useHistory } from "react-router-dom";
import Link from "@material-ui/core/Link";
import PropTypes from "prop-types";
import { Typography, withStyles } from "@material-ui/core";
import AvatarImage from "assets/img/faces/noname.jpg";
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import CardAvatar from "components/Card/CardAvatar.js";
import CardText from "components/Card/CardText.js";
import CardFooter from "components/Card/CardFooter.js";
import AddAlert from "@material-ui/icons/AddAlert";
import FavoriteIcon from "@material-ui/icons/Favorite";
import ThumbUpIcon from "@material-ui/icons/ThumbUp";

import Button from "components/CustomButtons/Button";
import Snackbar from "components/Snackbar/Snackbar.js";

import config from "config/config";
import * as userService from "services/userService";
import * as storageService from "services/storageService";

import { connect } from "react-redux";

const styles = (theme) => ({
  iconWrapper: {
    // borderRadius: theme.shape.borderRadius,
    textAlign: "center",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: theme.spacing(3),
    // padding: theme.spacing(1) * 1.5
  },
  color: {
    color: "#499BEF",
  },
  button: {
    backgroundColor: "#E5E5E5",
    color: "#1E1E1E !important",
    fontSize: "16px",
  },
  overrides: {
    MuiButton: {
      Button: {
        color: "black",
      },
    },
  },
  avatar: {
    width: "100%",
    height: "100%",
  },
});

function shadeColor(hex, percent) {
  const f = parseInt(hex.slice(1), 16);

  const t = percent < 0 ? 0 : 255;

  const p = percent < 0 ? percent * -1 : percent;

  const R = f >> 16;

  const G = (f >> 8) & 0x00ff;

  const B = f & 0x0000ff;
  return `#${(
    0x1000000 +
    (Math.round((t - R) * p) + R) * 0x10000 +
    (Math.round((t - G) * p) + G) * 0x100 +
    (Math.round((t - B) * p) + B)
  )
    .toString(16)
    .slice(1)}`;
}

function FeatureCard(props) {
  const {
    avatar,
    classes,
    color,
    uname,
    isSelf,
    text,
    id,
    isLiked,
    isAuthenticated,
    uid,
  } = props;

  const [show, setShow] = useState(false);
  const [place, setPlace] = useState("br");
  const [notifyColor, setNotifyColor] = useState("danger");
  const [message, setMessage] = useState("");
  const [liked, setLiked] = useState(isLiked);
  const [skipped, setSkipped] = useState(false);

  const handleLike = () => {
    if (!liked) {
      userService.sendLike(uid).then(({ status, data }) => {
        if (status === 200 && data.message === "success") {
          showNotification("br", "「気になる」を申請しました。", "success");
          setLiked(true);
          props.handleLike(uid, true);
        } else {
          showNotification("br", "プロフィールを入力してください。", "danger");
        }
      });  
    } else {
      userService.sendUnLike(uid).then(({ status, data }) => {
        if (status === 200 && data.message === "success") {
          showNotification("br", "「気になる」を解除しました。", "success");
          setLiked(false);
          props.handleLike(uid, false);
        } else {
          showNotification("br", "プロフィールを入力してください。", "danger");
        }
      });
    }
  };

  const handleSkip = () => {
    let skips = storageService.getStorage("skip");
    skips.push(uid);

    storageService.setStorage("skip", skips);
    setSkipped(true);
  };

  const showNotification = (place, message, notifyColor) => {
    setPlace(place);
    setNotifyColor(notifyColor);
    setMessage(message);
    setShow(true);
    setTimeout(() => {
      setShow(false);
    }, 3000);
  };

  const history = useHistory();
  const profileImg = avatar
    ? config.baseUrl + "avatars/" + avatar
    : AvatarImage;

  return (
    <Fragment>
      <Card>
        <CardAvatar>
          {isAuthenticated ? (
            <a href={"/personalProfile/" + uid} style={{ color: "#499BEF" }}>
              <img
                src={profileImg}
                className={classes.avatar}
                alt="avatar"
                style={{ height: 180 }}
              />
            </a>
          ) : (
            <img
              src={profileImg}
              className={classes.avatar}
              alt="avatar"
              style={{ height: 180 }}
            />
          )}
        </CardAvatar>
        <Typography variant="h6">{uname}</Typography>
        {!isSelf && (
          <Button
            variant="outlined"
            onClick={() => {
              isAuthenticated && handleLike();
            }}
            color="rose"
            startIcon={<FavoriteIcon />}
            style={{ margin: 5 }}
          >
            {liked ? "気になるを解除" : "気になる"}
          </Button>
        )}
        {!isSelf && !liked && (
          <Button
            onClick={() => {
              isAuthenticated && handleSkip();
            }}
            variant="outlined"
            color="facebook"
            startIcon={<ThumbUpIcon />}
            disabled={skipped}
            style={{ margin: 5 }}
          >
            スキップ
          </Button>
        )}
      </Card>
      <Snackbar
        place={place}
        color={notifyColor}
        icon={AddAlert}
        message={message}
        open={show}
        closeNotification={() => setShow(false)}
        close
      />
    </Fragment>
  );
}

FeatureCard.propTypes = {
  classes: PropTypes.object.isRequired,
  color: PropTypes.string,
  isAuthenticated: PropTypes.bool.isRequired,
};

export default withStyles(styles, { withTheme: true })(FeatureCard);
// export default connect(mapStateToProps)(withRouter(FeatureCard))
