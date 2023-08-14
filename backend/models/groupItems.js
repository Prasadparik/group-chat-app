// User Model==========================================

const Sequelize = require("sequelize");
const sequelize = require("../database");

const GroupItems = sequelize.define("groupItems", {
  _id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
});

module.exports = GroupItems;
