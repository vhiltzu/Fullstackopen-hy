const jwt = require('jsonwebtoken')
const User = require('../models/user')

const decryptToken = (request) => {
  return jwt.verify(request.token, process.env.SECRET)
}

const findUserFromDecodedToken = async (decodedToken) => {
  if (!decodedToken.id) {
    return null
  }

  return await User.findById(decodedToken.id)
}

module.exports = { decryptToken, findUserFromDecodedToken }
