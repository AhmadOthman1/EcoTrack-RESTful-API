const Sequelize = require('sequelize');
const sequelize = require('../util/database');
const User = require('./user');

const EducationalRes = sequelize.define('educationalRes', {
    resId: {
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

        validate: {
            isDate: true // Ensures the date field is in the date format
        }

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


User.hasMany(EducationalRes, { foreignKey: 'userId', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
EducationalRes.belongsTo(User, { foreignKey: 'userId', onDelete: 'CASCADE', onUpdate: 'CASCADE' });

module.exports = EducationalRes;