const jwt = require("jsonwebtoken");
const User = require("../models/user");

const Authenticate = async (req, res, next) => {
  try {
    const token = req.header("Authorization");
    const filter = req.header("filter");
    const userToken = jwt.verify(token, "secretkey");
    const findUserByPK = await User.findByPk(userToken.userId);
    req.user = findUserByPK;
    req.token = userToken;
    console.log(`AUTH FILTER >>>> ${filter}`);

    if (!findUserByPK) throw error;
    console.log(`<<<<      AUTH MIDDLEWARE         >>>>`);
  } catch (error) {
    console.log(error);
    res.sendStatus(401);
  }
  next();
};

module.exports = {
  Authenticate,
};
