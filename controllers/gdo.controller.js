//import expressAsynchandler
const expressAsyncHandler = require("express-async-handler");

//import dotenv
require("dotenv").config();

//import jwt
const jwt = require("jsonwebtoken");

//importing operator from sequelize
const { Op, DATE } = require("sequelize");


//////////////////////   Import Models   ///////////////////////////////////

const { Project } = require("../database/models/project.model");
const { Employees } = require("../database/models/employee.model");
const { Concerns } = require("../database/models/concern.model");
const { ResourcingRequests } = require("../database/models/resourceRequest.model");
const { Updates } = require("../database/models/updates.model");

//Associations
Project.Employees = Project.hasMany(Employees, { foreignKey: "project_id" });
Project.Updates = Project.hasMany(Updates, { foreignKey: "project_id" });
Project.Concerns = Project.hasMany(Concerns, { foreignKey: "project_id" });


/////////////////////////////////////////   CONTROLLERS   ////////////////////////////////////////////////////


//Get all projects

exports.getAllProjects = expressAsyncHandler(async (req, res) => {
  try {
    let [bearer, token] = req.headers.authorization.split(" ");
    let user = jwt.verify(token, process.env.SECRET_KEY);
    let allProjects = await Project.findAll({
      where: { gdo: user.first_name },
      attributes: [
        "project_id",
        "project_name",
        "client",
        "client_account_manager",
        "status",
        "start_date",
        "end_date",
        "fitness_indicator",
      ],
    });
    res.status(200).send({ messages: "Projects ", payload: allProjects });
  } catch (err) {}
});


//Add project details

exports.addProject = expressAsyncHandler(async (req, res) => {
  try {
    let [bearer, token] = req.headers.authorization.split(" ");
    let result = jwt.verify(token, process.env.SECRET_KEY);
    req.body.gdo = result.email;
    await Project.create(req.body);
  } catch (err) {}

  res.status(200).send({ message: "Project added sucessfully" });
});


//Allocate team to project

exports.allocateTeam = expressAsyncHandler(async (req, res) => {
  req.body.team.map(async (obj) => {
    let date = new Date();
    obj.start_date = date;
    obj.status = true;
    obj.billing_status = "billed";
    obj.project_id = req.params.project_id;
    await Employees.create(obj);
  });
  res.status(200).send({ message: "Team allocated sucessfully" });
});


//Get project information

exports.getProjectDetails = expressAsyncHandler(async (req, res) => {
  try {
    let [bearer, token] = req.headers.authorization.split(" ");
    let user = jwt.verify(token, process.env.SECRET_KEY);

    //today date
    let endOfDateRange = new Date();

    //Date before two weeks
    let startOfDateRange = new Date();
    startOfDateRange.setDate(endOfDateRange.getDate() - 14);
    console.log(startOfDateRange, endOfDateRange);

    //fetching project detailed info from database
    let result = await Project.findOne({
      where: { project_id: req.params.project_id, gdo: user.first_name },
      include: [
        {
          association: Project.Updates,
          attributes: { exclude: ["project_id", "update_id"] },
        },
        {
          association: Project.Concerns,
          attributes: {  },
        },
        {
          association: Project.Employees,
          attributes: { exclude: ["project_id"] },
        },
      ],
      attributes: [
        "project_name",
        "gdo",
        "project_manager",
        "client",
        "client_account_manager",
        "status",
        "start_date",
        "end_date",
        "fitness_indicator",
        "domain",
        "project_type",
      ],
    });
    //sending response
    res.status(200).send({ messages: "Projects ", payload: result });
  } catch (err) {
    res.status(404).send({ err: err.message });
  }
});


//Resolve Concern

exports.resolveConcern = expressAsyncHandler(async (req, res) => {
  let date = new Date();
  //add today date to request body
  req.body.mitigated_on_date = date;
  //updating concern
  await Concerns.update(req.body, {
    where: {
      concern_id: req.params.concern_id,
    },
  });
  //sending response
  res.status(200).send({ message: "Concern Resolved" });
});


//Raise a resourcing request

exports.resourcingRequest = expressAsyncHandler(async (req, res) => {
  //Assigning todays date
  req.body.date = new Date();
  //setting status to false
  req.body.status = false;
  //add project

  try {
    let [bearer, token] = req.headers.authorization.split(" ");
    let result = jwt.verify(token, process.env.SECRET_KEY);
    req.body.project_id = req.params.project_id;
    req.body.raised_by = result.email;
    //posting data to database
    await ResourcingRequests.create(req.body);
    res.status(200).send({ message: "Resource Request Created" });
  } catch (err) {
    res.status(404).send({ err: err.message });
  }
});
