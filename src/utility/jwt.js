const jwt = require('jsonwebtoken')
require('dotenv').config();

const jwtSecret = process.env.JWT_SECRET 

const createToken = payload => {
  return jwt.sign(payload, jwtSecret)
}

const verifyToken = token => {
  return jwt.verify(token, jwtSecret)
}

module.exports = { createToken, verifyToken }