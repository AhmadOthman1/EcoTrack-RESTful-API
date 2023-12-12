const Sequelize = require('sequelize');
const sequelize = require('../util/database');
const DataCollection = require('./dataCollection');
const User = require('./user');

const CommunityReporting = sequelize.define('communityReporting', {
    reportId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    userId: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    date: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    interests: {
        type: Sequelize.STRING(1000),
        allowNull: false,
    },
    location: {
        type: Sequelize.STRING(1000),
        allowNull: false,
    },
    title: {
        type: Sequelize.STRING(1000),
        allowNull: false,
    },
    text: {
        type: Sequelize.STRING(2000),
        allowNull: false,
    },
    image: {
        type: Sequelize.STRING,
        allowNull: true,
    },
});


User.hasMany(CommunityReporting, { foreignKey: 'userId', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
CommunityReporting.belongsTo(User, { foreignKey: 'userId', onDelete: 'CASCADE', onUpdate: 'CASCADE' });

module.exports = CommunityReporting;