const User = require("../../models/user");
const tempUser = require("../../models/tempUser");
const Location = require("../../models/location");
const jwt = require('jsonwebtoken');
const validator = require('../validator');
const Interests = require("../../models/interests");
const UserInterests = require("../../models/userInterests");
const auth = require('../authController')
const bcrypt = require('bcrypt');

//this function is different from others profile search cuz it gets the user info from the token, when theres interface, user can have more functionality by calling this 
exports.getProfileInfo = async (req, res) => {
    try {
        const authHeader = req.headers['authorization'];
        const decoded = jwt.verify(authHeader, process.env.ACCESS_TOKEN_SECRET);
        var userUserId = decoded.userId;
        const existinguserId = await User.findOne({
            where: {
                userId: userUserId
            },
        });
        if (existinguserId) {
            const userInterests = await UserInterests.findAll({
                where: {
                    userId: existinguserId.userId,
                }
            })
            //save the user interest keyWord
            var userInterestsValues = []
            for (let interest of userInterests) {
                var intr = await Interests.findOne({ where: { interestId: interest.interestId } })
                userInterestsValues.push(intr.interestKeyWord);
            }
            return res.status(200).json({
                message: 'Your Profile',
                userId: existinguserId.userId,
                email: existinguserId.email,
                name: existinguserId.name,
                location: existinguserId.location,
                score: existinguserId.score,
                interest: userInterestsValues
            });

        }
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            message: 'server Error',
            body: req.body
        });
    }
}

exports.updateProfileInfo = async (req, res) => {
    try {
        const authHeader = req.headers['authorization'];
        const decoded = jwt.verify(authHeader, process.env.ACCESS_TOKEN_SECRET);
        var userUserId = decoded.userId;
        const existinguserId = await User.findOne({
            where: {
                userId: userUserId
            },
        });
        if (existinguserId) {
            var userId = req.body.userId;
            var name = req.body.name;
            var location = req.body.location ? req.body.location.toLowerCase().trim() : req.body.location;
            var message = "";
            var accessToken;
            var refreshToken;
            //if new user id is valid value
            if (userId && validator.isUsername(userId) && userId.length > 5 && userId.length < 255) {
                //if user id is unique in bot user and temp user tables
                var newUserIdExists = await User.findOne({
                    where: {
                        userId: userId,
                    }
                })
                var newUserIdTempExists = await tempUser.findOne({
                    where: {
                        userId: userId,
                    }
                })
                //if user id is not unique
                if (newUserIdExists || newUserIdTempExists) {
                    message += "userId not updated: userId is already exists;";
                } else {
                    const userLoginInfo = { email: existinguserId.email, userId:  userId};
                    accessToken = auth.generateAccessToken(userLoginInfo);//generate new AccessToken
                    refreshToken = jwt.sign(userLoginInfo, process.env.REFRESH_TOKEN_SECRET);// generate new refreshToken
                    await User.update({ userId: userId ,token: refreshToken},
                        { where: { userId: existinguserId.userId } })
                        .then(() => {
                            message += "userId updated;";
                        })
                }
            } else {
                message += "userId not updated: userId is not valid;";
            }
            //if new name is valid value
            if (name && validator.isUsername(name) && name.length > 1 && name.length < 255) {
                await User.update({ name: name },
                    { where: { userId: existinguserId } })
                    .then(() => {
                        message += "name updated;";
                    })
            } else {
                message += "name not updated: name is not valid;";
            }
            //if location is valid
            if (location  && location.length > 1 && location.length < 255) {
                var locations = await Location.findAll();
                var isLocationValid = false;
                for (let dpLocations of locations) {
                    if (dpLocations.location == location.toLowerCase().trim()) {
                        isLocationValid = true;
                    }
                }
                if (!isLocationValid) {
                    message+="location not updated: Not Valid location, call /locations to get all available locations;"
                }else{
                    await User.update({location:location},{where:{userId:existinguserId}});
                    message+="location is updated;"
                }
            } else {
                message += 'location not updated: Not Valid location (length must be: 1-255);'

            }
            return res.status(200).json({
                message: message,
                body:req.body,
                refreshToken: refreshToken,
                accessToken:accessToken,

            });
        }
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            message: 'server Error',
            body: req.body
        });
    }
}
exports.changePassword = async (req, res) => {
    try {
        const authHeader = req.headers['authorization'];
        const decoded = jwt.verify(authHeader, process.env.ACCESS_TOKEN_SECRET);
        var userUserId = decoded.userId;
        const existinguserId = await User.findOne({
            where: {
                userId: userUserId
            },
        });
        if (existinguserId) {
            var oldPassword = req.body.oldPassword;
            var newPassword = req.body.newPassword;
            var message = "";
            //if new password is valid value
            if (oldPassword && oldPassword.length>=8 && oldPassword.length<=255) {
                const isMatch = await bcrypt.compare(oldPassword, existinguserId.password);//compare encrypted password
                if(isMatch){
                    //is new password valid
                    if(newPassword&&newPassword.length>=8&&newPassword.length<=255){
                        //hash the new password
                        const hashedPassword = await bcrypt.hash(newPassword.trim(), 10);
                        await User.update({password: hashedPassword},{where:{userId : existinguserId.userId}}).then(()=>{
                            return res.status(200).json({
                                message: "password changed successfully;",
                            });
                        });
                    }else{
                        return res.status(409).json({
                            message: "Not Valid password (length must be: 8-255);",
                        });
                    }
                }else{
                    return res.status(409).json({
                        message: "oldPassword is wrong;",
                    });
                }
            } else {
                return res.status(409).json({
                    message: "oldPassword is not valid;",
                });
            }            
            
        }else{
            return res.status(409).json({
                message: "user not found",
            });
        }
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            message: 'server Error',
            body: req.body
        });
    }
}