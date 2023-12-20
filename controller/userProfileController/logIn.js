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



exports.postLogin = async (req, res, next) => {
    try{
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(409).json({
            message: 'One or more fields are empty',
            body: req.body
        });
    }
    if (!validator.isEmail(email) || email.length < 12 || email.length > 100) {
        return res.status(409).json({
            message: 'Not Valid email',
            body: req.body
        });
    }
    if (password.length < 8 || password.length > 30) {
        return res.status(409).json({
            message: 'Not Valid password',
            body: req.body
        });
    }
    const existingEmail = await User.findOne({
        where: {
            email: email
        },
    });
    if (existingEmail) {
        // mail  exists
        const isMatch = await bcrypt.compare(password, existingEmail.password);
        if (isMatch) {
            const userLoginInfo = { email: email, userId:  existingEmail.userId};
            const accessToken = auth.generateAccessToken(userLoginInfo);
            const refreshToken = jwt.sign(userLoginInfo, process.env.REFRESH_TOKEN_SECRET);
            const result = await User.update({ token: refreshToken }, { where: { email } });
            const userInterests = await UserInterests.findAll({
                where:{
                    userId: existingEmail.userId,
                }
            })
            var userInterestsValues = []
            for(let interest of userInterests){
                var intr = await Interests.findOne({where:{interestId : interest.interestId}})
                userInterestsValues.push(intr.interestKeyWord );
            }
            return res.status(200).json({
                message: 'logged',
                accessToken: accessToken,
                refreshToken: refreshToken,
                userId: existingEmail.userId,
                email: existingEmail.email,
                name: existingEmail.name,
                location: existingEmail.location,
                score: existingEmail.score,
                interest: userInterestsValues
            });

        } else {
            return res.status(409).json({
                message: 'Wrong Password',
                body: req.body
            });
        }

    } else {
        return res.status(409).json({
            message: 'Email not exists',
            body: req.body
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