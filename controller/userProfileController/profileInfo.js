const User = require("../../models/user");
const jwt = require('jsonwebtoken');
const auth = require('../authController')
const { Op } = require('sequelize');
const validator = require('../validator');
const bcrypt = require('bcrypt');
const moment = require('moment');
const nodemailer = require('nodemailer');
const Interests = require("../../models/interests");
const UserInterests=require("../../models/userInterests");

//this function is different from others profile search cuz it gets the user info from the token, when theres interface, user can have more functionality by calling this 
exports.getProfileInfo = async (req,res) =>{
    try{
    const authHeader = req.headers['authorization'];
    const decoded = jwt.verify(authHeader, process.env.ACCESS_TOKEN_SECRET);
    var userUserId = decoded.userId;
    const existinguserId= await User.findOne({
        where: {
            userId: userUserId
        },
    });
    if(existinguserId){
        const userInterests = await UserInterests.findAll({
            where:{
                userId: existinguserId.userId,
            }
        })
        //save the user interest keyWord
        var userInterestsValues = []
        for(let interest of userInterests){
            var intr = await Interests.findOne({where:{interestId : interest.interestId}})
            userInterestsValues.push(intr.interestKeyWord );
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
}catch(err){
    console.log(err);
    return res.status(500).json({
        message: 'server Error',
        body: req.body
    });
}
}