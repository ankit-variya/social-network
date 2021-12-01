var jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
    try {
      console.log('--------...', req.headers.authorization.split(" ")[1])
      const token = req.headers.authorization.split(" ")[1];
      console.log(token);
      const decoded = jwt.verify(token, "abcdefgh");
      console.log("----", decoded);
      req.userData = decoded;
      next();
    } catch (error) {
      return res.status(401).json({
        message: "Auth failed",
      });
    }
  };