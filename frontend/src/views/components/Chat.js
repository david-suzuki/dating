import React, { Fragment, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import Divider from "@material-ui/core/Divider";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";

import Fab from "@material-ui/core/Fab";
import SendIcon from "@material-ui/icons/Send";
import styles from "./style/mainStyle.js";
import TopHeader from "views/components/Home/TopHeader.js";
import Footer from "views/components/Home/Footer";
import ChatContent from "./ChatContent";
import ChatList from "./ChatList";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
  chatSection: {
    width: "95%",
    height: "83vh",
    marginBottom: 50,
    marginLeft: 40,
  },
  headBG: {
    backgroundColor: "#e0e0e0",
  },
  borderRight500: {
    borderRight: "1px solid #e0e0e0",
  },
  messageArea: {
    height: "70vh",
    overflowY: "auto",
  },
});

const Chat = () => {
  const [opponent, setOpponent] = useState(0);

  const handleSelect = (id) => {
    setOpponent(id);
  };

  const classes = useStyles();

  return (
    <Fragment>
      <TopHeader id="top" />
      <Grid container style={{ marginTop: 100 }}>
        <Grid item xs={12}>
          <Typography variant="h5" className="header-message"></Typography>
        </Grid>
      </Grid>
      <Grid container component={Paper} className={classes.chatSection}>
        <Grid item xs={3} className={classes.borderRight500}>
          <ChatList onSelect={handleSelect} uid={opponent} />
        </Grid>
        <Grid item xs={9}>
          <ChatContent uid={opponent} />
        </Grid>
      </Grid>
      <Footer />
    </Fragment>
  );
};

const mapStateToProps = (state, ownProps) => ({
  user: state.auth.user,
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Chat));
