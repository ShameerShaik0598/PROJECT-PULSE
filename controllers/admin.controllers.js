//import expressAsyncHandler
const expressAsyncHandler = require("express-async-handler");

// //importing operator from sequelize
// const { Op } = require("sequelize");


///////////////////////////////////////   Import Models   /////////////////////////////////////////////

const { Project } = require("..//database/models/project.model");
const { Concerns } = require("../database/models/concern.model");
const { Updates } = require("../database/models/updates.model");
const { Employees } = require("../database/models/employee.model");
const { ResourcingRequests} = require("../database/models/resourceRequest.model");


// Associations   

Project.Employees = Project.hasMany(Employees, { foreignKey: "project_id" });
Project.Updates = Project.hasMany(Updates, { foreignKey: "project_id" });
Project.Concerns = Project.hasMany(Concerns, { foreignKey: "project_id" });


/////////////////////////////////////////   CONTROLLERS   ////////////////////////////////////////////////////



// >>>>>>>>>>   Get all Projects   <<<<<<<<<<<<<

exports.getAllProjects = expressAsyncHandler(async (req, res) => {
  let result = await Project.findAll({
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
  res.status(200).send({ messages: "Projects ", payload: result });
});



//Get project information   

exports.getProjectDetails = expressAsyncHandler(async (req, res) => {
  //Today's date
  let endOfDateRange = new Date();

  //Date before two weeks
  let startOfDateRange = new Date();
  startOfDateRange.setDate(endOfDateRange.getDate() - 14);
  // console.log(startOfDateRange,endOfDateRange);
  //get project detailed information from database
  let result = await Project.findAll({
    where: { project_id: req.params.project_id },
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
  //sending response
  res.status(200).send({ messages: "Projects are : ", payload: result });
});



// Add project details  

exports.addProject = expressAsyncHandler(async (req, res) => {
  let result = await Project.create(req.body);
  res.status(200).send({ message: "Project Added Successfully", payload: result });
});



// Update project details 
exports.updateProject = expressAsyncHandler(async (req, res) => {
  await Project.update(req.body, {
    where: {
      project_id: req.params.project_id,
    },
  });
  res.status(200).send({ message: "Project Updated Successfully" });
});



// Resolve Concern 

exports.resolveConcern = expressAsyncHandler(async (req, res) => {
  let date = new Date();
  //add Today's date to request body
  req.body.mitigated_on_date = date;
  //updating concern
  await Concerns.update(req.body, {
    where: {
      concern_id: req.params.concern_id,
    },
  });
  //sending response
  res.status(200).send({ message: "Concern resolved" });
});


// Get Resource Request  

exports.getResourceRequest = expressAsyncHandler(async (req, res) => {
  let result = await ResourcingRequests.findAll();
  res.status(200).send({ message: "resource requests are:", payload: result });
});

// //delete project
// exports.deleteProject=expressAsyncHandler(async(req,res)=>{
//   await Project.update({active:false},{where:{
//       project_id:req.params.project_id
//   }})
//   res.send({message:"Project deleted sucessfully"})
// })
