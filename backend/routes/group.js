// Imports -------------------------------------------
const express = require("express");
const route = express.Router();

const {
  createGroup,
  getGroup,
  getGroupUsers,
  removeUserFromGroup,
} = require("../controllers/group");
const { Authenticate } = require("../middleware/auth");

// User Routes -----------------------------------------

route.post("/creategroup", Authenticate, createGroup);
route.get("/getallgroups", Authenticate, getGroup);
route.get("/getgroupuserlist", Authenticate, getGroupUsers);
route.delete("/remove", Authenticate, removeUserFromGroup);

module.exports = route;
