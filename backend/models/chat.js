// User Model==========================================

const Sequelize = require("sequelize");
const sequelize = require("../database");

const Chat = sequelize.define("chat", {
  _id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  userName: { type: Sequelize.STRING, allowNull: false },

  userChat: { type: Sequelize.STRING, allowNull: false },
});

module.exports = Chat;
