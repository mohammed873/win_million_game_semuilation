const express = require("express");
require("dotenv").config();
const adminRouter = require("./routes/admin.js");
const participantRouter = require("./routes/participant");
const groupMember = require("./routes/groupMember");
const questionRouter = require("./routes/question");
const questionTokenRouter = require("./routes/questionToken");
const cors = require("cors");

//middelwares
const app = express();
app.use(express.json());
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");
  res.header(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT,PATCH, DELETE"
  );
  next();
});

//connecting to database
const db = require("./config/config");

db.on("error", (err) => console.log(err));
db.once("open", () => console.log("connected to database"));

//Routing
app.use("/admin", adminRouter);
app.use("/participant", participantRouter);
app.use("/group", groupMember);
app.use("/quest", questionRouter);
app.use("/qtoken", questionTokenRouter);

//listening to port
app.listen(process.env.PORT, () =>
  console.log("connected to server " + process.env.PORT)
);

module.exports = app;
