import React, { Fragment, useState, useEffect, useRef } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Avatar from "@material-ui/core/Avatar";
import Divider from "@material-ui/core/Divider";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import IconButton from "@material-ui/core/IconButton";
import InputAdornment from "@material-ui/core/InputAdornment";
import SearchIcon from "@material-ui/icons/Search";

import config from "config/config";
import AvatarImage from "assets/img/faces/noname.jpg";
import * as userService from "services/userService";

const useStyles = makeStyles({
  selected: {
    backgroundColor: "#ced4d6",
  },
});

const ChatList = (props) => {
  const user_id = props.user.id;
  const [list, setList] = useState([]);
  const [searchText, setSearchText] = useState("");

  const classes = useStyles();

  let initialList = useRef();

  useEffect(() => {
    userService.getChatList(user_id).then((result) => {
      if (result && result.data && result.data.message === "success") {
        setList(result.data.list);
        initialList.current = result.data.list;
      } else {
        console.log("error");
      }
    });
  }, [user_id]);

  // const handleSearch = (e) => {
  //     if (e.key === 'Enter') {
  //         e.preventDefault();
  //         if (searchText !== "") {
  //             // let searchData = new FormData();
  //             // searchData.append("searchText",  searchText);

  //             // userService.searchChatUser(searchData)
  //             // .then(({status, data}) => {
  //             //     if (data.message === "success") {
  //             //         const validatedList = validateList(data.list);
  //             //         setList((list) => [...list, ...validatedList]);
  //             //     }
  //             // }).catch((err) => {
  //             //     console.log(err);
  //             // })
  //             setList(
  //                 list.filter(item=>{
  //                     return item.name.toLowerCase().includes(searchText.toLowerCase())
  //                 })
  //             )
  //         } else {
  //             setList(initialList.current)
  //         }
  //     }
  // }

  const handleSearch = (e) => {
    setSearchText(e.target.value);
    if (e.target.value !== "") {
      setList(
        initialList.current.filter((item) => {
          return item.name.toLowerCase().includes(e.target.value.toLowerCase());
        })
      );
    } else {
      setList(initialList.current);
    }
  };

  const validateList = (items) => {
    let currentChatIds = [];
    for (let user of list) currentChatIds.push(user.id);

    let validated = [];
    for (let item of items) {
      if (!currentChatIds.includes(item.id)) validated.push(item);
    }

    return validated;
  };

  const handleClick = (id) => {
    props.onSelect(id);
  };

  return (
    <Fragment>
      <Grid item xs={12} style={{ padding: "10px" }}>
        <TextField
          variant="outlined"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          fullWidth
          // onKeyPress={handleSearch}
          value={searchText}
          onChange={handleSearch}
        />
      </Grid>
      <Divider />
      <List>
        {list.map((item) => (
          <ListItem
            button
            key={item.id}
            onClick={() => handleClick(item.id)}
            className={item.id === props.uid && classes.selected}
          >
            <ListItemIcon>
              <Avatar
                alt="Remy Sharp"
                src={
                  item.avatar
                    ? config.baseUrl + "avatars/" + item.avatar
                    : AvatarImage
                }
              />
            </ListItemIcon>
            <ListItemText primary={item.name}>{item.name}</ListItemText>
            {/*<ListItemText secondary="online" align="right"></ListItemText>*/}
          </ListItem>
        ))}
      </List>
    </Fragment>
  );
};

const mapStateToProps = (state, ownProps) => ({
  user: state.auth.user,
});

const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(ChatList));
