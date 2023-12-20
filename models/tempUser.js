const Sequelize=require('sequelize');

const sequelize=require('../util/database');
const TempUser=sequelize.define('tempUser',{
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
    verificationCode:{
        type:Sequelize.STRING(5),
        allowNull:true
    }
});



module.exports=TempUser;