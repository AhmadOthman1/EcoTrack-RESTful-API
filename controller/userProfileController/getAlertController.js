const User = require("../../models/user");
const tempUser = require("../../models/tempUser");
const Location = require("../../models/location");
const jwt = require('jsonwebtoken');
const validator = require('../validator');
const Interests = require("../../models/interests");
const dataCollection = require("../../models/dataCollection");
const data = require("../../models/data");

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
        

            var dbAlerts = await Alert.findAll({
                attributes: [ 'alertId','dataCollectionId'],
                where: {
                    userId: existinguserId.userId,
                },
                order: [['dataCollectionId', 'DESC']],
                include: [{ 
                    model: dataCollection,
                    as: 'dataCollection',
                   // include: [{
                    //    model: data,  // Include the Data model here
                    //    as: 'data'
                  //  }]
                }]
            });
            return res.status(200).json({
                message: 'Your Alert',
               
                alerts: dbAlerts


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