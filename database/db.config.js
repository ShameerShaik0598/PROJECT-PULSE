//import sequelize
const { Sequelize } = require("sequelize");

//import environmental variables
require("dotenv").config();

//create a connection with database
exports.sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.HOST,
    dialect: "mysql",
  }
);
