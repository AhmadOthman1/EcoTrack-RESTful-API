const Sequelize=require('sequelize');

const sequelize=require('../util/database');
const Location=sequelize.define('location',{
    location: {type:Sequelize.STRING,primaryKey: true,allowNull:false},
    counter:{
        type: Sequelize.INTEGER,
        allowNull:false,
    }
});



module.exports=Location;