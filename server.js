const express = require("express");
const path = require("path");
const http = require("http");

const app = express();
const server = http.createServer(app);

const io = require("socket.io")(server);

app.use(express.static(path.join(__dirname + "/public")));

io.on("connection", (socket) => {
  socket.on("sender-join", (data) => {
    socket.join(data.uid);
  });
  socket.on("receiver-join", (data) => {
    socket.join(data.uid);
    socket.in(data.sender_uid).emit("init", data.uid);
  });
  socket.on("file-meta", (data) => {
    socket.in(data.uid).emit("fs-meta", data.metadata)
  });
  socket.on("fs-start", (data) => {
    socket.in(data.uid).emit("fs-share", {})
  });
  socket.on("file-raw", (data) => {
    socket.in(data.uid).emit("fs-share", data.buffer)
  });
});

server.listen(5000);
