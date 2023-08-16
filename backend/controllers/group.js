//  User  controllers =======================================
const { Op } = require("sequelize");
const Chat = require("../models/chat");
const Group = require("../models/group");
const GroupItems = require("../models/groupItems");
const User = require("../models/user");

// ==========================================================

const createGroup = async (req, res) => {
  console.log("req.body.groupName >>>>", req.body.groupName, req.user._id);
  try {
    let data = await Group.findOrCreate({
      where: { groupName: req.query.groupName || req.body.groupName },
      defaults: {
        groupName: req.body.groupName,
        groupAdmin: req.user._id,
      },
    });

    // adding relation in junction table
    await data[0].addUser(req.query.userId || req.user._id);
    res.json({ message: "Group Created!!", data: data });
  } catch (error) {
    res.json(error);
  }
};

// ==================================================================

const getGroup = async (req, res) => {
  try {
    const userId = req.user._id;

    const groups = await Group.findAll({
      include: [
        {
          model: User,
          where: {
            _id: userId,
          },
          through: {
            model: GroupItems,
            attributes: [], // Exclude join table attributes from result
          },
        },
      ],
      // where: {
      //   groupAdmin: userId,
      // },
    });

    res.status(200).json(groups);
  } catch (error) {
    res.json(error);
  }
};
// ==================================================================

const getAdminGroup = async (req, res) => {
  try {
    const userId = req.user._id;

    const groups = await Group.findAll({
      include: [
        {
          model: User,
          where: {
            _id: userId,
          },
          through: {
            model: GroupItems,
            attributes: [], // Exclude join table attributes from result
          },
        },
      ],
      where: {
        groupAdmin: userId,
      },
    });

    res.status(200).json(groups);
  } catch (error) {
    res.json(error);
  }
};

// getGroupUsers=================================

const getGroupUsers = async (req, res) => {
  try {
    const groupId = req.query.groupId;

    const groups = await User.findAll({
      include: [
        {
          model: Group,
          where: {
            _id: groupId,
          },
          through: {
            model: GroupItems,
            attributes: [], // Exclude join table attributes from result
          },
        },
      ],
    });

    res.json({ message: "SUCCESS !! ", result: groups });
  } catch (error) {}
};

// removeUserFromGroup =================================================

const removeUserFromGroup = async (req, res) => {
  try {
    const result = await GroupItems.destroy({
      where: {
        userId: req.query.userId,
        groupId: req.query.groupId,
      },
    });

    res.json(result);
  } catch (error) {
    res.json(error);
  }
};

module.exports = {
  createGroup,
  getGroup,
  getGroupUsers,
  removeUserFromGroup,
  getAdminGroup,
};
