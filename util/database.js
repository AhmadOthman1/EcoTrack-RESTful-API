const Sequelize = require('sequelize');
/*
const sequelize = new Sequelize('ecotrack', 'root', '123456', {
  dialect: 'mysql',
  host: 'localhost',
});*/
const sequelize = new Sequelize('ecotrack', 'root', '123456', {
  dialect: 'mysql',
  host: 'localhost',
});



module.exports = sequelize;