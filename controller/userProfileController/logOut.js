const User = require("../../models/user");
require('dotenv').config();
const jwt = require('jsonwebtoken');


exports.postLogOut = async (req, res, next) => {
    try{
    // get info from access Token
    const authHeader = req.headers['authorization']
    const decoded = jwt.verify(authHeader, process.env.ACCESS_TOKEN_SECRET);
    var userUserId = decoded.userId;
    const existinguserId= await User.findOne({
        where: {
            userId: userUserId
        },
    });
    //if user found via access token
    if (existinguserId) {
        await User.update({ token: null }, {
            where: {
                userId: userUserId
            }
          })        
          return res.status(200).json({
            message: 'logged out',
        });
    } else {
        return res.status(409).json({
            message: 'Email not exists',
        });
    }
}catch(err){
    console.log(err);
    return res.status(500).json({
        message: 'server Error',
    });
}
 }