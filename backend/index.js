// Imports -------------------------------------------
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

// DataBase -------------------------------------------
const sequelize = require("./database");

// middlewares----------------------------------------
const app = express();
app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// importing Models ----------------------------------
const User = require("./models/user");
const Chat = require("./models/chat");

// Routes ---------------------------------------------

// importing routers
const userRouter = require("./routes/user");
const chatRouter = require("./routes/chat");

// User Routes
app.use("/api/", userRouter);

// Chat Routes
app.use("/api/", chatRouter);

// DATABASE RELATIONS ------------------------------

// TODO:  add database relations here .....
User.hasMany(Chat);
Chat.belongsTo(User);

// server running on Port ------------------------------

const runServer = async () => {
  try {
    await sequelize.sync();
    app.listen(3000, console.log(`SERVER RUNNING ON PORT => 3000`));
  } catch (error) {
    console.log(error);
  }
};
runServer();
