// Imports -------------------------------------------
const express = require("express");
const route = express.Router();

const { sendChat, getAllChats, sendMedia } = require("../controllers/chat");
const { Authenticate } = require("../middleware/auth");

// User Routes -----------------------------------------

route.post("/sendchat", Authenticate, sendChat);
route.get("/getchats", getAllChats);
route.post("/sendmedia", Authenticate, sendMedia);

module.exports = route;
