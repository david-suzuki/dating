import React, {
  useState,
  useCallback,
  useRef,
  Fragment,
  useEffect,
} from "react";
import { useHistory } from "react-router-dom";
import PropTypes from "prop-types";
import Divider from "@material-ui/core/Divider";
import AvatarImage from "../../assets/img/faces/noname.jpg";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Checkbox from "@material-ui/core/Checkbox";
import Avatar from "@material-ui/core/Avatar";
import DeleteIcon from "@material-ui/icons/Delete";
import IconButton from "@material-ui/core/IconButton";
import Switch from "@material-ui/core/Switch";
import {
  FormHelperText,
  TextField,
  Button,
  Typography,
  FormControlLabel,
  withStyles,
  Grid,
} from "@material-ui/core";
import TopHeader from "views/components/Home/TopHeader.js";
import Footer from "views/components/Home/Footer";
import config from "config/config";

import * as userService from "services/userService";
// import request from "../../../api/request";

const styles = (theme) => ({
  link: {
    transition: theme.transitions.create(["background-color"], {
      duration: theme.transitions.duration.complex,
      easing: theme.transitions.easing.easeInOut,
    }),
    cursor: "pointer",
    color: theme.palette.primary.main,
    "&:enabled:hover": {
      color: theme.palette.primary.dark,
    },
    "&:enabled:focus": {
      color: theme.palette.primary.dark,
    },
  },
  right: {
    float: "right",
  },
  root: {
    width: "100%",
    maxWidth: "100%",
    height: "100%",
    backgroundColor: theme.palette.background.paper,
  },
});

function Admin(props) {
  const { setStatus, theme, onClose, openTermsDialog, status, classes } = props;
  const [checked, setChecked] = React.useState("active");
  const [users, setUsers] = React.useState([]);

  useEffect(() => {
    userService.getUsers().then((res) => {
      console.log("Admin profile list", res.data.users);
      if (res.data.message == "success" && res.data.users) {
        setUsers(res.data.users);
      } else {
        console.log("error");
      }
    });
  }, []);

  const handleToggle = (value) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };
  // const [checked, setChecked] = React.useState(['wifi']);

  // const handleToggle = (value) => () => {
  //     const currentIndex = checked.indexOf(value);
  //     const newChecked = [...checked];

  //     if (currentIndex === -1) {
  //     newChecked.push(value);
  //     } else {
  //     newChecked.splice(currentIndex, 1);
  //     }

  //     setChecked(newChecked);
  // };

  return (
    <Fragment>
      <TopHeader />
      <Grid container>
        <Grid item xs={12} sm={6} lg={2} data-aos="zoom-in-up"></Grid>
        <Grid
          item
          xs={12}
          sm={6}
          lg={10}
          style={{ marginTop: "150px" }}
          data-aos="zoom-in-up"
        >
          <List dense className={classes.root}>
            {users.map((user) => {
              const labelId = `checkbox-list-secondary-label-${user}`;
              return (
                <ListItem key={user.id} button>
                  <ListItemAvatar>
                    <Avatar
                      alt={`Avatar n°${user + 1}`}
                      src={config.baseUrl + `avatars/${user.avatar}`}
                    />
                  </ListItemAvatar>
                  <ListItemText id={labelId} primary={user.name} />
                  <ListItemText id={labelId} primary={user.phone} />
                  <ListItemText id={labelId} primary={user.email} />
                  <ListItemSecondaryAction style={{ marginRight: "100px" }}>
                    <Switch
                      edge="end"
                      onChange={handleToggle(user.status)}
                      checked={checked.indexOf(user.status) !== -1}
                      inputProps={{
                        "aria-labelledby": "switch-list-label-bluetooth",
                      }}
                    />
                  </ListItemSecondaryAction>
                  <ListItemSecondaryAction>
                    <IconButton edge="end" aria-label="delete">
                      <DeleteIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              );
            })}
          </List>
        </Grid>
      </Grid>
      <Footer />
    </Fragment>
  );
}

Admin.propTypes = {
  theme: PropTypes.object,
  onClose: PropTypes.func,
  openTermsDialog: PropTypes.func,
  status: PropTypes.string,
  setStatus: PropTypes.func,
  classes: PropTypes.object,
};

export default withStyles(styles, { withTheme: true })(Admin);
