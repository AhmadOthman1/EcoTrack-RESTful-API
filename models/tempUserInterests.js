const Sequelize=require('sequelize');
const tempUser = require("./tempUser");
const sequelize=require('../util/database');
const TempUserInterests=sequelize.define('tempUserInterests',{
    id:{
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,

    },
    interest: {type:Sequelize.STRING,allowNull:false},
    userId:{
        type: Sequelize.STRING,
        allowNull:false,
    }
});

tempUser.hasMany(TempUserInterests, { foreignKey: 'userId', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
TempUserInterests.belongsTo(tempUser, { foreignKey: 'userId', onDelete: 'CASCADE', onUpdate: 'CASCADE' });


module.exports=TempUserInterests;