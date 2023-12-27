const User = require("../../models/user");
const tempUser = require("../../models/tempUser");
const Location = require("../../models/location");
const jwt = require('jsonwebtoken');
const validator = require('../validator');
const Interests = require("../../models/interests");
const Alert = require("../../models/Alert");

const UserInterests = require("../../models/userInterests");
const auth = require('../authController')
const bcrypt = require('bcrypt');
const { Sequelize } = require("sequelize");


exports.getUserAlerts = async (req, res) => {
    try {
        const authHeader = req.headers['authorization'];
        const decoded = jwt.verify(authHeader, process.env.ACCESS_TOKEN_SECRET);
        var userUserId = decoded.userId;
        const existinguserId = await User.findOne({
            where: {
                userId: userUserId
            },
        });
        

            var dbAlert = await Alert.findAll({
                attributes: [ 'dataCollectionId','alertId'],
                where: {
                    userId: existinguserId.userId,
                },
                order: [['dataCollectionId', 'DESC']],
            });
        

            return res.status(200).json({
                message: 'Your Alert',
               
                Alerts: dbAlert,

            });

        }
     catch (err) {
        console.log(err);
        return res.status(500).json({
            message: 'server Error',
            body: req.body
        });
    }
}