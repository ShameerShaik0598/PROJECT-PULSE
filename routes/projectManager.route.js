//import express
const express = require("express");

//create router
const projectManagerApp = express.Router();

//import controllers
const {
  getAllProjects,
  getProjectDetails,
  projectConcern,
  projectUpdates,
} = require("../controllers/projectManager.controller");

//ROUTES

//get all projects
projectManagerApp.get("/get-projects",getAllProjects);

//get project details by project_id
projectManagerApp.get("/project-ById/:project_id",getProjectDetails)

//project_update
projectManagerApp.post("/project-update/:project_id", projectUpdates);

//project concern
projectManagerApp.post("/project-concern/:project_id", projectConcern);

//export API
module.exports = projectManagerApp;
