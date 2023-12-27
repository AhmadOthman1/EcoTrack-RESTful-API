const jwt = require('jsonwebtoken');
const User = require("../models/user");
require('dotenv').config();
//generate new access token with expire time = 10 m
function generateAccessToken(user) {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '30m' })
}
//middle auth for requests 
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization']
  const token = authHeader;//get token
  if (token == null) //invalid value
  return res.status(401).json({
    message: 'invalid value',
  });

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.status(403).json({
      message: 'token expired',
    });
    req.user = user
    next()
  })
}
//generate new accessToken
function getRefreshToken (req, res, next)  {
  const authHeader = req.headers['authorization']
  const refreshToken = authHeader ;
  if (refreshToken == null) return res.status(401).json({
    message: 'invalid value',
  });
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, async (err, user) => {
    if (err) return res.status(403).json({
      message: 'token invalid',
    });
    const existingEmail = await User.findOne({
      where: {
        email: user.email
      },
    });
    if (existingEmail) {
      if (existingEmail.token!= refreshToken) return res.status(403).json({
        message: 'token invalid',
      });
      const userInfo = { email: user.email , userId : user.userId };
      const accessToken = generateAccessToken(userInfo);
      res.status(200).json({ accessToken: accessToken })
    }else{
      return res.status(403).json({
        message: 'token invalid',
        body: req.body
      });
    }

  })
}
module.exports = { generateAccessToken, authenticateToken ,getRefreshToken };