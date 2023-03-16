//import express
const express = require("express");

//create route
const superAdminApp = express.Router();

//import controllers
const {
  notAssignedRoles,
  assignRole,
  deleteUser,
  getUsers,
} = require("../controllers/superAdmin.controller");

//ROUTES

//Get all users
superAdminApp.get("/role/users",  getUsers);

//Get users who are not assigned any roles
superAdminApp.get("/role/not-assigned-users", notAssignedRoles);

//Assign Roles
superAdminApp.put("/assign-role/user/:email", assignRole);

//Delete User
superAdminApp.delete("/delete/user/:email", deleteUser);

module.exports = superAdminApp;
