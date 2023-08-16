// Imports -------------------------------------------
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");

// DataBase -------------------------------------------
const sequelize = require("./database");

// middlewares----------------------------------------
const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Socket.io------------
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

// importing Models ----------------------------------
const User = require("./models/user");
const Chat = require("./models/chat");
const Group = require("./models/group");
const GroupItems = require("./models/groupItems");

// Routes ---------------------------------------------

// importing routers
const userRouter = require("./routes/user");
const chatRouter = require("./routes/chat");
const groupRouter = require("./routes/group");

// socket.io ----------------

io.on("connection", (socket) => {
  socket.on("message", (msg) => {
    io.emit("message", msg);
    console.log("new message :", msg);
  });
});

// ----------------------------------

// User Routes
app.use("/api/", userRouter);

// Chat Routes
app.use("/api/", chatRouter);

// Group Routes
app.use("/api/", groupRouter);

// Frontend Routes
app.use((req, res) => {
  res.sendFile(path.join(__dirname, `frontend/${req.url}`));
});

// DATABASE RELATIONS ------------------------------

// TODO:  add database relations here .....
User.hasMany(Chat);
Chat.belongsTo(User);

Group.hasMany(Chat);
Chat.belongsTo(Group);

// Example association definitions
Group.belongsToMany(User, { through: GroupItems });
User.belongsToMany(Group, { through: GroupItems });

// server running on Port ------------------------------

const runServer = async () => {
  try {
    await sequelize.sync({ force: false });
    server.listen(
      3000,
      console.log(`
    ===================================================================================
                         SERVER RUNNING ON PORT => 3000
    ===================================================================================
    
    `)
    );
  } catch (error) {
    console.log(error);
  }
};
runServer();
