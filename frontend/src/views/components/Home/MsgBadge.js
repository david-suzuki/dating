import React, { useState, useEffect } from "react";
import Badge from "@material-ui/core/Badge";
import MailIcon from "@material-ui/icons/Mail";
import { useHistory } from "react-router-dom";
import * as userService from "services/userService";
import { connect } from "react-redux";

const MsgBadge = (props) => {
  const user_id = props.user.id;
  const history = useHistory();
  const [num, setNum] = useState(0);

  useEffect(() => {
    let cleanup = false;

    userService
      .getNumUnreadMsg(user_id)
      .then((result) => {
        if (result.data.message == "success") {
          if (!cleanup) setNum(result.data.unread);
        }
      })
      .catch((error) => {
        console.log(error);
      });

    setInterval(() => {
      userService
        .getNumUnreadMsg(user_id)
        .then((result) => {
          if (result.data.message == "success") {
            if (!cleanup) setNum(result.data.unread);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }, 10000);

    return () => (cleanup = true);
  }, []);

  return (
    <Badge
      color="secondary"
      badgeContent={num}
      max={99}
      style={{ marginTop: 12, marginRight: 20, cursor: "pointer" }}
      onClick={() => history.push("/chat")}
    >
      <MailIcon color="action" />
    </Badge>
  );
};

const mapStateToProps = (state, ownProps) => ({
  user: state.auth.user,
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(MsgBadge);
