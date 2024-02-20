const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const cookieParser = require("cookie-parser");
const { Server } = require("socket.io");
const cors = require("cors");
// const cache = require('node:cac')

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

let messages = [];

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST"],
    credentials: true,
  })
);

io.on("connection", (socket) => {
  console.log(`user connected`);
  console.log(socket.id);


});

app.use(cookieParser());
const UserRouter = require("./router/UserRouter");
const { Socket } = require("dgram");
const { log } = require("console");
const { date } = require("joi");

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use("/", UserRouter);

const port = 8000;

server.listen(port, () => {
  console.log(`Server Is Started at ${port}`);
});
