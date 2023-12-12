const Sequelize=require('sequelize');

const sequelize=require('../util/database');
const User=sequelize.define('user',{
    userId:{
        type:Sequelize.STRING,
        allowNull:false,
        primaryKey:true

    },
    name: {type:Sequelize.STRING,allowNull:false},
    email: {
        type: Sequelize.STRING,
        allowNull:false,
    },
    password: {
        type:Sequelize.STRING(1000),
        allowNull:false
    },
    intrests: {
        type:Sequelize.STRING(1000),
        allowNull:true
    },
    location:{
        type:Sequelize.STRING(1000),
        allowNull:false
    },
    score:{
        type:Sequelize.INTEGER,
        allowNull:false
    },
});



module.exports=User;