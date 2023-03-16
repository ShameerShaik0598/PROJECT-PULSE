//import express-async-handler
const expressAsyncHandler = require("express-async-handler");

//import bcryptjs
const bcryptjs = require("bcryptjs");

//import json web tokens
const jwt = require("jsonwebtoken");

//import nodemailer
const nodemailer = require("nodemailer");

//import user model
const { User } = require("../database/models/user.model");
const { sign } = require("crypto");
const { env } = require("process");

//Controllers

//Test Controller
exports.test = (req, res) => {
  res.send({ message: "User Api is Working" });
};

//User Registration Controller
exports.userRegistration = expressAsyncHandler(async (req, res) => {
  try {
    let { password } = req.body;
    let hashedPassword = await bcryptjs.hash(password, 5);
    req.body.password = hashedPassword;
    //create user
    let user = await User.create(req.body);
    //sending response and new user details
    res.send({ message: "User Registered Succesfully", payload: user });
  } catch (err) {
    //incase if user already exists (userId)
    res.send({ message: "User already exists" });
  }
});

//User Login Controller
exports.userLogin = expressAsyncHandler(async (req, res) => {
  let user = await User.findOne({
    where: {
      email: req.body.email,
      status: true,
    },
  });
  //if user is not found
  if (user == null || user.role == null)
    res.send({
      message: "Email Id provided is not registered with our Organization",
    });
  //else if user is found
  else {
    //compare password with hashed password in db
    if (await bcryptjs.compare(req.body.password, user.password)) {
      user = user.toJSON();
      delete user.password;
      delete user.status;
      delete user.user_id;
      delete user.createdAt;
      delete user.updatedAt;
      //generate a token
      let signedToken = jwt.sign(user, process.env.SECRET_KEY, {
        expiresIn: "1h",
      });
      //when requested send token in response
      res.send({
        message: "Login Successfull",
        payload: user,
        token: signedToken,
      });
    } else {
      res.send({ message: "Invalid Credentials" });
    }
  }
});

//create connection to smtp
const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE_PROVIDER,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD, // password of app
  },
});

//Creating otps object
let otps = {};

//Forget password
exports.forgetPassword = expressAsyncHandler(async (req, res) => {
  //generating 6 digit random number as otp
  let otp = Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000;
  //add OTP to otps
  otps[req.body.email] = otp;
  //draft email
  let mailOptions = {
    from: process.env.EMAIL,
    to: req.body.email,
    subject: "OTP to reset password for project pulse",
    text:
      `Hi ,
         We received a request to reset yout project pulse password .Enter the following OTP to reset password :  
          ` + otp,
  };
  //send email
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
  //setting validity to OTP
  setTimeout(() => {
    //delete OTP from object
    delete otps[req.body.email];
  }, 600000);
  res.send({ message: "OTP to reset your password is sent to your email" });
});

//reset password

exports.resetPassword = expressAsyncHandler(async (req, res) => {
  //otp matches
  if (req.body.otp == otps[req.params.email]) {
    console.log("password verififed");
    await User.update(
      { password: req.body.password },
      {
        where: {
          email: req.params.email,
        },
      }
    );
    res.send({ message: "Password reset sucessfully" });
  } else {
    res.send({ message: "Invalid OTP" });
  }
});
