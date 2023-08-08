// User Model==========================================

const Sequelize = require("sequelize");
const sequelize = require("../database");

const User = sequelize.define("user", {
  _id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },

  userName: { type: Sequelize.STRING, allowNull: false },

  userEmail: { type: Sequelize.STRING, allowNull: false, unique: true },

  userPhone: { type: Sequelize.STRING, allowNull: false, unique: true },

  userPassword: { type: Sequelize.STRING, allowNull: false },
});

module.exports = User;
