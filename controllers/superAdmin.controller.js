//import expressAsyncHandler
const expressAsyncHandler = require("express-async-handler");

//import model
const { User } = require("../database/models/user.model");

//CONTROLLERS

//Role Assignment controller
exports.assignRole = expressAsyncHandler(async (req, res) => {
  await User.update(req.body, {
    where: { email: req.params.email },
  });

  res.send({ message: "Role Assigned Successfully" });
});

//Get all users who are not assigned any roles
exports.notAssignedRoles = expressAsyncHandler(async (req, res) => {
  let result = await User.findAll({
    where: {
      role: null,
    },
    attributes: {
      exclude: ["password", "role", "createdAt", "updatedAt"],
    },
  });
  res.send({
    message: "Users who are not assigned to any roles yet",
    payload: result,
  });
});

//Get all the users
exports.getUsers = expressAsyncHandler(async (req, res) => {
  let allUsers = await User.findAll({
    attributes: {
      exclude: ["password", "createdAt", "updatedAt", "role"],
    },
  });
  res.send({ message: "All users are:", payload: allUsers });
});

//Delete user
exports.deleteUser = expressAsyncHandler(async (req, res) => {
  await User.update(
    { status: false },
    {
      where: {
        email: req.params.email,
      },
    }
  );
  res.send({ message: "User Deleted Successfully" });
});
