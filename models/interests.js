const Sequelize = require("sequelize");

const sequelize = require("../util/database");
const Interests = sequelize.define("interests", {
  interestId: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  interestKeyWord: { type: Sequelize.STRING, allowNull: false },
  counter: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
});

module.exports = Interests;
