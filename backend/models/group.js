// User Model==========================================

const Sequelize = require("sequelize");
const sequelize = require("../database");

const Group = sequelize.define("group", {
  _id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  groupName: { type: Sequelize.STRING, allowNull: false },
  groupAdmin: { type: Sequelize.INTEGER, allowNull: false },
});

module.exports = Group;
