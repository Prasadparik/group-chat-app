const Sequelize = require("sequelize");
require("dotenv").config();

const sequelize = new Sequelize("group-chat-app", "root", "Ppp99706", {
  dialect: "mysql",
  host: "localhost",
});
module.exports = sequelize;
