const Sequelize=require('sequelize');
const User = require("./user");
const Interests =require("./interests");
const sequelize=require('../util/database');
const UserInterests=sequelize.define('userInterests',{
    id:{
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,

    },
    interestId: {type:Sequelize.INTEGER,allowNull:false},
    userId:{
        type: Sequelize.STRING,
        allowNull:false,
    }
});

User.hasMany(UserInterests, { foreignKey: 'userId', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
UserInterests.belongsTo(User, { foreignKey: 'userId', onDelete: 'CASCADE', onUpdate: 'CASCADE' });

Interests.hasMany(UserInterests, { foreignKey: 'interestId', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
UserInterests.belongsTo(Interests, { foreignKey: 'interestId', onDelete: 'CASCADE', onUpdate: 'CASCADE' });


module.exports=UserInterests;