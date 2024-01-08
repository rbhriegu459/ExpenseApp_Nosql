const Sequelize = require("sequelize");
require('dotenv').config();

const sequelize = new Sequelize(process.env.DB_SCHEMA, process.env.DB_USERNAME, process.env.DB_PASS, {
    host:"localhost",
    dialect:'mysql'
});

sequelize.authenticate().then(() => {
    console.log('Connection has been established successfully.');
 }).catch((error) => {
    console.error('Unable to connect to the database: ', error);
 })

module.exports = sequelize;