//import express
const express = require("express");

//create router
const adminApp = express.Router();

//import controllers
const {
  addProject,
  getAllProjects,
  updateProject,
  resolveConcern,
  getProjectDetails,
  getResourceRequest,
  deleteProject,
} = require("../controllers/admin.controllers");


//ROUTES


//get all projects
adminApp.get("/get-projects", getAllProjects);

//get project details by project_id
adminApp.get("/get-projectDetails-Byid/:project_id", getProjectDetails);

//add a project
adminApp.post("/add-project", addProject);

//update a project
adminApp.put("/update-project/:project_id", updateProject);

//resolve a concern
adminApp.put("/resolve-concern/:concern_id", resolveConcern);

//get resource request
adminApp.get("/get-resource-request", getResourceRequest);

//delete project
// adminApp.put("/delete-project/:project_id", deleteProject);

//export admin API
module.exports = adminApp;
