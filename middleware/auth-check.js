const jwt = require('jsonwebtoken')
require('dotenv').config()
const config = process.env;

const verifyToken = (req, res, next) => {
    const token =
      req.body.token || req.query.token || req.headers["x-access-token"] || req.headers["authorization"];
    if (!token) {
      return res.status(403).send({
        status: false,
        message: "A token is required for authentication"
      });
    }
    try {
      const tokens = token.split(' ')[1];
      const decoded = jwt.verify(tokens, "hFB4rzSIjqoclVvIANXF5Fj8QWG6GOW6");
      req.user = decoded;
    } catch (err) {
      return res.status(401).send({
        status: false,
        message:"Invalid Token"
      });
    }
    return next();
  };
  
  module.exports = verifyToken;