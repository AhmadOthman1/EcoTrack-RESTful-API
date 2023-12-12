const Sequelize = require('sequelize');
const sequelize = require('../util/database');
const DataCollection = require('./dataCollection');
const User = require('./user');

const Alert = sequelize.define('alert', {
    alertId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    dataCollectionId: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    userId: {
        type: Sequelize.STRING,
        allowNull: false,
    },
});

DataCollection.hasMany(Alert, { foreignKey: 'dataCollectionId', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
Alert.belongsTo(DataCollection, { foreignKey: 'dataCollectionId', onDelete: 'CASCADE', onUpdate: 'CASCADE' });

User.hasMany(Alert, { foreignKey: 'userId', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
Alert.belongsTo(User, { foreignKey: 'userId', onDelete: 'CASCADE', onUpdate: 'CASCADE' });

module.exports = Alert;