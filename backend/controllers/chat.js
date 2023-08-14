//  User  controllers =======================================
const { Op } = require("sequelize");
const Chat = require("../models/chat");

// ==========================================================

const sendChat = async (req, res) => {
  console.log("groupId SNED  >>>> ", req.query.group);
  try {
    const result = await Chat.create({
      userName: req.token.userName,
      userChat: req.body.chatMessage,
      userId: req.token.userId,
      groupId: req.query.group,
    });
    res.json({ message: "chat send success", data: result });
  } catch (error) {
    res.json(error);
  }
};

// ==================================================================

const getAllChats = async (req, res) => {
  console.log("lastChatId >>>>> ", req.query.lastChatId);
  console.log("groupId q >>>>> ", req.query.group);
  const lastChatId = req.query.lastChatId;

  try {
    const data = await Chat.findAll({
      where: {
        _id: {
          [Op.gt]: lastChatId,
        },
        groupId: req.query.group,
      },
    });
    // console.log(" DATA >>>>> ", data);

    res.status(200).json(data);
  } catch (error) {
    res.json(error);
  }
};

module.exports = {
  sendChat,
  getAllChats,
};
