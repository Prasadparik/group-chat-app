//  User  controllers =======================================
const { where } = require("sequelize");
const Chat = require("../models/chat");

// ==========================================================

const sendChat = async (req, res) => {
  try {
    const result = await Chat.create({
      userName: req.token.userName,
      userChat: req.body.chatMessage,
      userId: req.token.userId,
    });
    res.json({ message: "chat send success", data: result });
  } catch (error) {
    res.json(error);
  }
};

// ==================================================================

const getAllChats = async (req, res) => {
  try {
    const data = await Chat.findAll();
    res.status(200).json(data);
  } catch (error) {
    res.json(error);
  }
};

module.exports = {
  sendChat,
  getAllChats,
};
