const jwt = require("jsonwebtoken");
module.exports = function (req, res, next) {
  const token = req.header("auth-token");

  if (!token) {
    res.status(401).send("Access Denied");
  }

  try {
    const verfied = jwt.verify(token, process.env.TOKEN_ADMIN);
    req.admin = verfied;
    next();
  } catch (error) {
    res.status(400).send("Invalid token " + error.message);
  }
};
