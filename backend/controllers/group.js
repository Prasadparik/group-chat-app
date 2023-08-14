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
      where: { groupName: req.body.groupName },
      defaults: {
        groupName: req.body.groupName,
      },
    });

    // adding relation in junction table
    await data[0].addUser(req.user._id);
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
    });

    console.log(" ####################### FILTERED GRP LIST >>>> ");
    res.status(200).json(groups);
  } catch (error) {
    res.json(error);
  }
};

module.exports = {
  createGroup,
  getGroup,
};
