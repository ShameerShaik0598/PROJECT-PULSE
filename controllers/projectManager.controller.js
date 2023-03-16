//import express-async-handler
const expressAsyncHandler = require("express-async-handler");

//import jwt
const jwt = require("jsonwebtoken");

//  SMTP setup

//import nodemailer
const nodemailer = require("nodemailer");

//create connection to smtp
const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE_PROVIDER,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD, // app password
  },
});

//import models
const { Concerns } = require("../database//models/concern.model");
const { Updates } = require("../database/models/updates.model");
const { Project } = require("../database/models/project.model");
const { User } = require("../database/models/user.model");

//Associations
Project.Updates = Project.hasMany(Updates, { foreignKey: "project_id" });
Project.Concerns = Project.hasMany(Concerns, { foreignKey: "project_id" });

//CONTROLLERS

//Get all projects
exports.getAllProjects = expressAsyncHandler(async (req, res) => {
  try {
    let [bearer, token] = req.headers.authorization.split(" ");
    let user = jwt.verify(token, process.env.SECRET_KEY);
    let result = await Project.findAll({
      where: { project_manager: user.email },
      attributes: [
        "project_name",
        "client",
        "client_account_manager",
        "status",
        "start_date",
        "end_date",
        "fitness_indicator",
      ],
    });
    res.send({ messages: "Projects are: ", payload: result });
  } catch (err) {
    res.send({ error: err.message });
  }
});

//Get project information
exports.getProjectDetails = expressAsyncHandler(async (req, res) => {
  try {
    let [bearer, token] = req.headers.authorization.split(" ");
    let user = jwt.verify(token, process.env.SECRET_KEY);

    //Today's date
    let endOfDateRange = new Date();

    //Date before two weeks
    let startOfDateRange = new Date();
    startOfDateRange.setDate(endOfDateRange.getDate() - 14);
    console.log(startOfDateRange, endOfDateRange);

    //fetching project details from db
    let result = await Project.findOne({
      where: { project_id: req.params.project_id, project_manager: user.email },
      include: [
        {
          association: Project.Updates,
          attributes: { exclude: ["project_id", "update_id"] },
        },
        {
          association: Project.Concerns,
          attributes: { exclude: ["project_id", "concern_id"] },
        },
        {
          association: Project.Employees,
          attributes: { exclude: ["project_id"] },
        },
      ],
      attributes: [
        "project_name",
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
    let team_members = result.employees.length + 3;
    result.dataValues.team_members = team_members;
    //sending response
    res.send({ messages: "Projects ", payload: result });
  } catch (err) {}
});

//project updates
exports.projectUpdates = expressAsyncHandler(async (req, res) => {
  req.body.project_id = req.params.project_id;
  //posting data into database
  await Updates.create(req.body);
  //sending response
  res.send({ message: "Update Creation Succesfull" });
});

//project concerns
exports.projectConcern = expressAsyncHandler(async (req, res) => {
  let date = new Date();
  //add today's date to body
  req.body.raised_date = date;
  //raised by 
  req.body.project_id = req.params.project_id;
  req.body.raised_by = "suri";
  //setting initializing status to raised
  req.body.status = "raised";

  //fetching emails of admins
  let result = await User.findAll({
    where: {
      role: "admin",
    },
    attributes: ["email"],
  });
  //fetching email of gdo
  let gdo = await Project.findOne({
    where: {
      project_id: req.params.project_id,
    },
    attributes: ["gdo"],
  });
  //converting array of object to array of emails
  let emails = result.map((user) => user.email);
  //creating comma seperated emails string
  emails = emails.reduce((email, bulkEmails) => bulkEmails + "," + email);
  //adding gdo Email to Emails
  emails = emails + "," + gdo.gdo;
  let mailOptions = {
    from: process.env.EMAIL,
    to: emails,
    subject: "New Concern raised",
    text: ` Concern :
      Raised_by : ${req.body.raised_by}
      Description : ${req.body.description}.
      Severity    : ${req.body.severity}.
      Raised by client : ${req.body.raised_by_client}.`,
  };
  //send email
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
  //posting data into db
  await Concerns.create(req.body);

  //sending res
  res.send({ message: "Concern created sucessfully" });
});
