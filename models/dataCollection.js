const Sequelize = require('sequelize');
const User = require('./user');
const sequelize = require('../util/database');
const DataCollection = sequelize.define('dataCollection', {
    dataCollectionId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    userId: { type: Sequelize.STRING, allowNull: false },
    location: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    interests: {
        type: Sequelize.STRING,
        allowNull: true
    },
    description: {
        type: Sequelize.STRING,
        allowNull: true
    },
    date: {
        type: Sequelize.STRING,
        allowNull: true
    },
});

User.hasMany(DataCollection, { foreignKey: 'userId', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
DataCollection.belongsTo(User, { foreignKey: 'userId', onDelete: 'CASCADE', onUpdate: 'CASCADE' });

module.exports = DataCollection;