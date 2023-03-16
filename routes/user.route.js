//import express
const express = require("express");

//create a router
const userApp = express.Router();

//import controllers
const {
  test,
  userRegistration,
  userLogin,
  forgetPassword,
  resetPassword,
} = require("../controllers/user.controller");

//ROUTES

//test route
userApp.get("/test", test);

//Route for user resgistration
userApp.post("/user-registration", userRegistration);

//Route for user login
userApp.post("/user-login", userLogin);

//Forget password
userApp.post("/forgot-password", forgetPassword);

//reset-password
userApp.post("/reset-password/email/:email", resetPassword);

module.exports = userApp;
