const server = require("http").createServer();
const io = require("socket.io")(server, {
  cors: {
    origin: "*",
  },
});
var axios = require('axios');
var mysql = require('mysql');

const PORT = 4000;
const NEW_CHAT_MESSAGE_EVENT = "newChatMessage";
const REQUEST_USER = "requestUser";
const REGISTER_USER = "registerUser";
const CHAT_HISTORY = "chatHistory";
const INIT_CHAT = "initChat";
const JOIN_CHAT = "joinChat";

const CHAT_UNREAD_EXPIRY = 72;   // 12 hours
const CHAT_UNREAD_CHECK_INTERVAL = 600000;   // 10 min
// const CHAT_UNREAD_CHECK_INTERVAL = 10000;   // ms
const axios_url = 'http://localhost:8000/';

// const { MysqlConnect } = require('./mysql');
const db_config = require('./mysql');

var MysqlConnect;

function handleDisconnect() {
  
  MysqlConnect = mysql.createConnection(db_config); // Recreate the connection, since
                                                  // the old one cannot be reused.

  MysqlConnect.connect(function(err) {              // The server is either down
    if(err) {                                     // or restarting (takes a while sometimes).
      console.log('error when connecting to db:', err);
      setTimeout(handleDisconnect, 2000); // We introduce a delay before attempting to reconnect,
    }                                     // to avoid a hot loop, and to allow our node script to
    console.log("DB Connected!");
  });                                     // process asynchronous requests in the meantime.
                                          // If you're also serving http, display a 503 error.
  MysqlConnect.on('error', function(err) {
    console.log('db error', err);
    if(err.code === 'PROTOCOL_CONNECTION_LOST') { // Connection to the MySQL server is usually
      handleDisconnect();                         // lost due to either server restart, or a
    } else {                                      // connnection idle timeout (the wait_timeout
      throw err;                                  // server variable configures this)
    }
  });
}

handleDisconnect();

let sockets = [];

io.on("connection", (socket) => {
  console.log(`Client ${socket.id} connected`);
  socket.emit(REQUEST_USER, null);

  // Listen for registering new user
  socket.on(REGISTER_USER, (data) => {
    // Save the socket object with user
    socket.userId = data.user;
    sockets.push(socket);

    // Fetch the records of messages from db and emit them
    MysqlConnect.query('SELECT * FROM messages WHERE (ufrom=? AND uto=?) OR (ufrom=? AND uto=?)', 
      [data.user, data.partner, data.partner, data.user], (err, rows) => {
      if (err) {
        console.log(err)
      } else {
        let msgs = [];
        for(let i=0; i<rows.length; i++) {
          let msg = {
            'body': rows[i].message,
            'sender': rows[i].ufrom,
            'receiver': rows[i].uto,
          }
          msgs.push(msg);
        }
        socket.emit(CHAT_HISTORY, msgs);
        // Set message to read
        MysqlConnect.query('UPDATE messages SET is_read=? WHERE ufrom=? AND uto=? AND is_read=?', [1, data.partner, data.user, 0], (err, res) => {
          if (err) {
            console.log(err)
          }
        });
      }
    });
  });

  // Listen for new messages
  socket.on(NEW_CHAT_MESSAGE_EVENT, (data) => {  
    let receiverId = data.receiver;
    let senderId = data.sender;
    let message = data.body;
    MysqlConnect.query('INSERT INTO messages SET ufrom=?, uto=?, message=?', [senderId, receiverId, message], (err, res) => {
      if (err) {
        console.log(err)
      }
    });
    for (let s of sockets) {
      if (s.userId == receiverId) {
        s.emit(NEW_CHAT_MESSAGE_EVENT, data);
      }
    }
  });

  // Leave the room if the user closes the socket
  socket.on("disconnect", () => {
    console.log(`Client ${socket.id} diconnected`);
    var index = sockets.indexOf(socket);
    if (index !== -1) {
      sockets.splice(index, 1);
    }
  });
});

server.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
