// Imports -------------------------------------------
const express = require("express");
const route = express.Router();

const { createGroup, getGroup } = require("../controllers/group");
const { Authenticate } = require("../middleware/auth");

// User Routes -----------------------------------------

route.post("/creategroup", Authenticate, createGroup);
route.get("/getallgroups", Authenticate, getGroup);

module.exports = route;
