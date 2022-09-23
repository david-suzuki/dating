import React, { useEffect, useRef, useState } from "react";
import socketIOClient from "socket.io-client";
import config from "../../config/config";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import TextField from "@material-ui/core/TextField";
import NavPills from "components/NavPills/NavPills.js";
import Avatar from "@material-ui/core/Avatar";

import * as userService from "services/userService";

import "./style/ChatContent.css";
import { makeStyles } from "@material-ui/core/styles";
import styles from "./style/mainStyle.js";
import "emoji-mart/css/emoji-mart.css";
import { Picker } from "emoji-mart";
import { Button } from "@material-ui/core";

const useStyles = makeStyles(styles);

const NEW_CHAT_MESSAGE_EVENT = "newChatMessage";
const REQUEST_USER = "requestUser";
const REGISTER_USER = "registerUser";
const CHAT_HISTORY = "chatHistory";
const SOCKET_SERVER_URL = config.chatUrl;

const ChatContent = (props) => {
  console.log(props.uid);
  const classes = useStyles();

  const socketRef = useRef();

  const [newMessage, setNewMessage] = React.useState("");
  const [messages, setMessages] = useState([]);
  const [uid, setUId] = useState(props.uid);

  const [showEmojis, setShowEmojis] = useState(false);

  const addEmoji = (e) => {
    let sym = e.unified.split("-");
    let codesArray = [];
    sym.forEach((el) => codesArray.push("0x" + el));
    let emoji = String.fromCodePoint(...codesArray);
    setNewMessage(newMessage + emoji);
  };

  useEffect(() => {
    setUId(props.uid);
    socketRef.current = socketIOClient(SOCKET_SERVER_URL);
    socketRef.current.on(REQUEST_USER, () => {
      socketRef.current.emit(REGISTER_USER, {
        user: props.user.id,
        partner: props.uid,
      });
    });

    socketRef.current.on(CHAT_HISTORY, (data) => {
      let msgObjs = [];
      for (let i = 0; i < data.length; i++) {
        let msgObj = { message: data[i].body, ufrom: data[i].sender };
        msgObjs.push(msgObj);
      }
      setMessages([...msgObjs]);
    });

    socketRef.current.on(NEW_CHAT_MESSAGE_EVENT, (data) => {
      let msgObj = { message: data.body, ufrom: data.sender };
      setMessages((messages) => [...messages, msgObj]);
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, [props.uid]);

  const sendMessage = (msg, receiver) => {
    socketRef.current.emit(NEW_CHAT_MESSAGE_EVENT, {
      body: msg,
      sender: props.user.id,
      receiver: receiver,
    });
  };

  const handleNewMessageChange = (event) => {
    setNewMessage(event.target.value);
  };

  const handleSendMessage = () => {
    if (newMessage !== "") {
      let msgObj = { message: newMessage, ufrom: props.user.id };
      setMessages((messages) => [...messages, msgObj]);
      sendMessage(newMessage, props.uid);
      setNewMessage("");
    }
  };

  const handleKeypress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSendMessage();
    }
  };

  /*{only when receive message from user with selected profile or when send message, 
    show messages in chatting panel}*/

  return (
    <div style={{ width: "100%" }}>
      <div style={{ width: "100%" }}>
        <div className={classes.chatWindow}>
          <List component="nav">
            {messages.map(
              (message, i) =>
                (message.ufrom == props.uid ||
                  message.ufrom == props.user.id) && (
                  <ListItem
                    key={i}
                    className={`message-item ${
                      message.ufrom == props.user.id
                        ? "my-message"
                        : "received-message"
                    }`}
                  >
                    {/*<Avatar alt="Remy Sharp" src="" />*/}
                    <ListItemText primary={message.message} />
                  </ListItem>
                )
            )}
          </List>
        </div>
        <div style={{ marginTop: "10px", display: "flex" }}>
          <TextField
            id="inputText"
            label=""
            multiline
            style={{ width: "84%" }}
            variant="outlined"
            value={newMessage}
            onChange={handleNewMessageChange}
            placeholder="Write message..."
            className="new-message-input-field"
            onKeyPress={handleKeypress}
          />
          <Button
            className="button"
            color="inherit"
            style={{ width: "60px", height: "60px" }}
            onClick={() => setShowEmojis(!showEmojis)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="icon"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </Button>
          {showEmojis && (
            <div>
              <Picker onSelect={addEmoji}
                 showPreview={false}
                 showSkinTones={false} 
              // title='Pick your emoji…'
              />
            </div>
          )}
          <button
            variant="contained"
            onClick={handleSendMessage}
            className="send-message-button"
          >
            <i className="fas fa-paper-plane"></i>
          </button>
        </div>
      </div>
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
)(withRouter(ChatContent));
