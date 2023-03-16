//import dotenv
require("dotenv").config();

//import jwt
const jwt = require("jsonwebtoken");

exports.gdoPrivateRoute = (req, res, next) => {
  console.log(req.headers.authorization);
  if (req.headers.authorization != undefined) {
    let [bearer, token] = req.headers.authorization.split(" ");
    try {
      //verify jwt token
      let verifyToken = jwt.verify(token, process.env.SECRET_KEY);
      //if the token is valid now check for role (next middleware)
      if (verifyToken.role == "gdo") next();
      else res.send({ message: "Unauthorized Access" });
    } catch {
      //if error is occured >> token is expired
      res.send({ message: "Token Expired >> Relogin" });
    }
  } else {
    res.send({ message: "Unauthorized Access" });
  }
};
