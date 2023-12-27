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


exports.getDataCollection = async (req, res) => {
    try {
        const authHeader = req.headers['authorization'];
        const decoded = jwt.verify(authHeader, process.env.ACCESS_TOKEN_SECRET);
        var userUserId = decoded.userId;
      

        const  {dataCollectionId}  =req.body; 
        // Validate the provided dataCollectionId
   

        const dataEntries = await data.findAll({
            where: {
                dataCollectionId: dataCollectionId
            },
          
        });

        // Return the data entries
        return res.status(200).json({
            message: 'Data for the provided Data Collection ID',
            dataEntries: dataEntries
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