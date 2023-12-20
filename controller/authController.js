const jwt = require('jsonwebtoken');
const User = require("../models/user");
require('dotenv').config();

function generateAccessToken(user) {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '10m' })
}
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]
  if (token == null) return res.status(401).json({
    message: 'server Error',
    body: req.body
  });

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.status(403).json({
      message: 'server Error',
      body: req.body
    });
    req.user = user
    next()
  })
}
function socketAuthenticateToken(msg) {
  const authHeader = msg
  const token = authHeader 
  if (token == null) return 401

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return 403
    
  })
  return 200
}
function getRefreshToken (req, res, next)  {
  const authHeader = req.headers['authorization']
  const refreshToken = authHeader && authHeader.split(' ')[1]
  if (refreshToken == null) return res.status(401).json({
    message: 'server Error',
    body: req.body
  });
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, async (err, user) => {
    if (err) return res.status(403).json({
      message: 'server Error',
      body: req.body
    });
    const existingEmail = await User.findOne({
      where: {
        email: user.email
      },
    });
    if (existingEmail) {
      if (existingEmail.token!= refreshToken) return res.status(403).json({
        message: 'server Error',
        body: req.body
      });
      const userInfo = { email: user.email , username : user.username };
      const accessToken = generateAccessToken(userInfo);
      res.json({ accessToken: accessToken })
    }else{
      return res.status(403).json({
        message: 'server Error',
        body: req.body
      });
    }

  })
}
module.exports = { generateAccessToken,socketAuthenticateToken, authenticateToken ,getRefreshToken };