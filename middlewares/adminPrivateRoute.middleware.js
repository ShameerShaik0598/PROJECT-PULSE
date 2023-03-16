//import dotenv
require("dotenv").config();

//import jwt
const jwt = require("jsonwebtoken");

exports.adminPrivateRoute = (req, res, next) => {
  console.log(req.headers.authorization);
  if (req.headers.authorization != undefined) {
    let [bearer, token] = req.headers.authorization.split(" ");
    try {
      //verify jwt token
      let verifyToken = jwt.verify(token, process.env.SECRET_KEY);
      //if the token is valid now check for role (next middleware)
      if (verifyToken.role == "admin") next();
      else res.status(401).send({ message: "Unauthorized Access" });
    } catch (err){
      //if error is occured >> token is expired
  
      res.status(401).send({ message: "Token Expired >> Relogin",err });
    }
  } else {
    res.status(401).send({ message: "Unauthorized Access" });
  }
};
