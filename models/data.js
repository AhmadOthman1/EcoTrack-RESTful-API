const Sequelize = require('sequelize');
const sequelize = require('../util/database');
const DataCollection = require('./dataCollection');

const Data = sequelize.define('data', {
    dataId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    dataCollectionId: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    dateType: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    DataValue: {
        type: Sequelize.STRING,
        allowNull: true
    },
});

DataCollection.hasMany(Data, { foreignKey: 'dataCollectionId', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
Data.belongsTo(DataCollection, { foreignKey: 'dataCollectionId', onDelete: 'CASCADE', onUpdate: 'CASCADE' });

module.exports = Data;