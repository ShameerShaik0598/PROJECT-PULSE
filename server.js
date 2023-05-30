//import express
const express = require("express");

//calling express function
const app = express();

//import helmet
const helmet = require("helmet");
app.use(helmet());

//import dotenv
require("dotenv").config();

//listen to port
app.listen(process.env.PORT, () => console.log("Port is on 1000"));

const cors = require("cors");
app.use(cors());

//import database connection
const { sequelize } = require("./database/db.config");

//test database connection
sequelize
  .authenticate()
  .then(() => console.log("Connection Success"))
  .catch((err) => console.log("Error occured at :", err));

const path = require("path");
app.use(express.static(path.join(__dirname, "../build")));

//create tables for models
sequelize.sync(); // we can use {alter : true} or {force:true} acc to our requirement

//body parser
app.use(express.json());

////////////////////////////////////////////    Import API's   ////////////////////////////////////////////////////////

//import userApp API
const userApp = require("./routes/user.route");

//import superAdminApp API
const superAdminApp = require("./routes/superAdmin.route");

//import adminApp API
const adminApp = require("./routes/admin.route");

//import gdoApp API
const gdoApp = require("./routes/gdo.route");

//import projectManagerApp API
const projectManagerApp = require("./routes/projectManager.route");

/////////////////////////////////////   Import Authenticate Middlewares   ///////////////////////////////////////////

//import superAdminPrivateRoute Middleware
const {
  superAdminPrivateRoute,
} = require("./middlewares/superAdminPrivateRoute.middleware");

//import adminPrivateRoute Middleware
const {
  adminPrivateRoute,
} = require("./middlewares/adminPrivateRoute.middleware");

//import gdoPrivateRoute Middleware
const { gdoPrivateRoute } = require("./middlewares/gdoPrivateRoute.middleware");

//import projectManagerPrivateRoute Middleware
const {
  projectManagerPrivateRoute,
} = require("./middlewares/projectManagerPrivateRoute.middleware");

///////////////////////////////////////////////   Routing    ///////////////////////////////////////////////////

//Routing for User Api
app.use("/user", userApp);

//Routing for Super Admin Api
app.use("/super-admin", superAdminPrivateRoute, superAdminApp);

//Routing for Admin Api
app.use("/admin", adminPrivateRoute, adminApp);

//Routing for GDO Api
app.use("/gdo", gdoPrivateRoute, gdoApp);

//Routing for Project Manager Api
app.use("/project-manager", projectManagerPrivateRoute, projectManagerApp);

//page refresh
app.use((req, res) => {
  res.sendFile(path.join(__dirname, "../build/index.html"));
});

//Invalid Path

app.use("*", (req, res) => {
  res.send({ message: "Invalid Path" });
});

//Error Handling Middleware
app.use((err, req, res, next) => {
  res.send({ message: "Error Occured at: ", Error: err.message });
});
