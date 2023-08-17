//  User  controllers =======================================
const { Op } = require("sequelize");
const Chat = require("../models/chat");
const path = require("path");
// const uploadTos3 = require("../services/s3");
require("dotenv").config();

const AWS = require("aws-sdk");

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

// sendMedia ============================================

function uploadTos3(data, filename) {
  const BUCKET_NAME = process.env.BUCKET_NAME;
  const IAM_USER_KEY = process.env.IAM_USER_KEY;
  const IAM_USER_SECRET = process.env.IAM_USER_SECRET;

  let s3bucket = new AWS.S3({
    accessKeyId: IAM_USER_KEY,
    secretAccessKey: IAM_USER_SECRET,
  });

  var params = {
    Bucket: BUCKET_NAME,
    Key: filename,
    Body: data,
    ACL: "public-read",
  };

  return new Promise((resolve, reject) => {
    s3bucket.upload(params, (err, s3response) => {
      if (err) {
        console.log("Something Went Wrong", err);
        reject(err);
      } else {
        console.log("Success", s3response);
        resolve(s3response.Location);
      }
    });
  });
}

const sendMedia = async (req, res) => {
  try {
    const mediaFile = req.files.media;
    console.log(
      `================= SEND IMG ${mediaFile.name} ==================================`
    );
    // File upload to AWS S3
    const result = await uploadTos3(mediaFile.data, mediaFile.name);

    //  Storing Media Url in Database
    const MediaLocation = result;
    console.log(`################  ${MediaLocation}`);
    const chatMedia = await Chat.create({
      userName: req.token.userName,
      userChat: MediaLocation,
      userId: req.token.userId,
      groupId: req.query.group,
    });

    res.json({ mediaUrl: `${result}` });
  } catch (error) {
    res.json(error);
  }
};

module.exports = {
  sendChat,
  getAllChats,
  sendMedia,
};
