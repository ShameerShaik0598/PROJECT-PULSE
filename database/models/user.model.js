//import datatypes from sequelize
const { DataTypes } = require("sequelize");

//import bcrypt
const bcryptjs = require("bcryptjs");

//import sequelize from db
const { sequelize } = require("../db.config"); //{} is used because its a named export

//create user model
exports.User = sequelize.define(
  "user",
  {
    user_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    first_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    last_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      // set(p) {
      //   let hashedPassword = bcryptjs.hashSync(p, 5);
      //   this.setDataValue("password", hashedPassword);
      // },
    },
    role: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    status: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    freezeTableName: true,
  }
);
