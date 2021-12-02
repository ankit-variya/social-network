var jwt = require("jsonwebtoken");
const User = require('../models/user');

module.exports = async (req, res, next) => {
    try {
    //  console.log('--------...', req.headers.authorization.split(" ")[1])
      const token = req.headers.authorization.split(" ")[1];
      console.log(token);
      const decoded = jwt.verify(token, "abcdefgh");
     // console.log("----", decoded);
      // req.userData = decoded;
      const userEmail = await User.find({ email: decoded.email });  
    //  console.log('userEmail', userEmail)
      req.userData = userEmail[0];
      next();
    } catch (error) {
      return res.status(401).json({
        message: "Auth failed",
      });
    }
  };