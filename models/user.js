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
    location:{
        type:Sequelize.STRING(1000),
        allowNull:false
    },
    score:{
        type:Sequelize.INTEGER,
        allowNull:false
    },
    token:{
        type:Sequelize.STRING(2000),
        allowNull:true
    }
});



module.exports=User;