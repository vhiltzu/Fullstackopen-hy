const jwt = require("jsonwebtoken");
const User = require("../models/user");

const getTokenFrom = (request) => {
  const authorization = request.get("authorization");
  if (authorization && authorization.startsWith("Bearer ")) {
    return authorization.replace("Bearer ", "");
  }
  return null;
};

const decryptToken = (token) => {
  return jwt.verify(token, process.env.SECRET);
};

const findUserFromDecodedToken = async (decodedToken) => {
  if (!decodedToken.id) {
    return null;
  }

  return await User.findById(decodedToken.id);
};

module.exports = { getTokenFrom, decryptToken, findUserFromDecodedToken };
