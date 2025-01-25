const jwt = require("jsonwebtoken");

const isAuthenticated = (req, res, next) => {
  if (req.headers.authorization && req.headers.authorization.split(" ")[0] === "Bearer") {
    const theToken = req.headers.authorization.split(" ")[1];
    const data = jwt.verify(theToken, process.env.TOKEN_SECRET);
    req.payload = data;
    next();
  } else {
    res.status(403).json({ message: "Token not provided or not valid." });
  }
};

module.exports = isAuthenticated;
