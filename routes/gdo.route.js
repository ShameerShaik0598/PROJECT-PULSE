//import express
const express = require("express");

//create router
const gdoApp = express.Router();

//import controllers
const {
  addProject,
  getAllProjects,
  getProjectDetails,
  resolveConcern,
  allocateTeam,
  resourcingRequest,
} = require("../controllers/gdo.controller");

//ROUTES

//get all projects
gdoApp.get("/get-projects", getAllProjects);

//get project full details
gdoApp.get("/project/:project_id", getProjectDetails);

//add project
gdoApp.post("/add-project", addProject);

//allocate team
gdoApp.post("/team/project/:project_id", allocateTeam);

//resolve a concern
gdoApp.put("/resolve-concern/:concern_id", resolveConcern);

//Resource request
gdoApp.post("/resource-request/project/:project_id", resourcingRequest);

//export admin API
module.exports = gdoApp;
