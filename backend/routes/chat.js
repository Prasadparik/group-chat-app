// Imports -------------------------------------------
const express = require("express");
const route = express.Router();

const { sendChat, getAllChats } = require("../controllers/chat");
const { Authenticate } = require("../middleware/auth");

// User Routes -----------------------------------------

route.post("/sendchat", Authenticate, sendChat);
route.get("/getchats", getAllChats);

module.exports = route;
