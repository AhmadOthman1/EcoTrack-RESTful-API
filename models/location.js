const Sequelize=require('sequelize');

const sequelize=require('../util/database');
const Location=sequelize.define('location',{
    id:{
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,

    },
    location: {type:Sequelize.STRING(1000),allowNull:false},
    counter:{
        type: Sequelize.INTEGER,
        allowNull:false,
    }
});



module.exports=Location;