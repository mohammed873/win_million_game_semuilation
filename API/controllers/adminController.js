const Admin = require("../models/admin");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { sendSms } = require("./notificatiions/sendSms");
const log = require("../controllers/logs/log");
const logs = require("../models/logs");
const {
  adminValidations,
  LoginValidations,
} = require("./validation/validations");

//Getting all admins
exports.getAllAdmins = async (req, res) => {
  try {
    const admins = await Admin.find();
    //inserting success log
    log(
      {
        file: "adminControler.js",
        line: "11",
        info: "get all admins",
        type: "INFO",
      },
      logs
    );
    res.status(200).json(admins);
  } catch (error) {
    res.status(500).json({ error: error.message });

    //inserting error log
    log(
      {
        file: "adminController.js",
        line: "23",
        info: err.message,
        type: "Warning",
      },
      logs
    );
  }
};

//adding a new admin
exports.addAdmin = async (req, res) => {
  const { error } = adminValidations(req.body);
  if (error) return res.status(500).json({
    message:error.details[0].message
  });

  const phoneExist = await Admin.findOne({ phone: req.body.phone });
  if (phoneExist) return res.status(400).json({
    message:"Phone already exists"
  });

  const salt = await bcrypt.genSalt(10);
  const hashpassword = await bcrypt.hash(req.body.password, salt);

  const admin = new Admin({
    full_name: req.body.full_name,
    phone: req.body.phone,
    password: hashpassword,
  });

  try {
    const newAdmin = await admin.save();
    res.status(200).json({
      message: "admin successfully created",
      newAdmin,
    });

    log(
      {
        file: "adminController.js",
        line: "54",
        info: "add new admin",
        type: "Info",
      },
      logs
    );
  } catch (error) {
    res.status(500).json({ error: error.message });

    log(
      {
        file: "adminController.js",
        line: "56",
        info: err.message,
        type: "Warning",
      },
      logs
    );
  }
};

//get one admin
exports.getOneAdmin = async (req, res) => {
  try {
    admin = await Admin.findById(req.params.id);
    admin === null
      ? res.status(404).json({ error: "admin is not found" })
      : res.status(200).send(admin);

    log(
      {
        file: "adminController.js",
        line: "80",
        info: "get one admin",
        type: "Info",
      },
      logs
    );
  } catch (error) {
    res.status(500).json({ error: error.message });

    log(
      {
        file: "adminController.js",
        line: "73",
        info: err.message,
        type: "Warning",
      },
      logs
    );
  }
};

//login admin 
exports.loginAdmin = async (req, res) => {
  const { phone, password } = req.body;

  const { error } = LoginValidations(req.body);
  if (error) return res.status(500).send(error.details[0].message);

  const admin = await Admin.findOne({ phone: phone });
  if (!admin) return res.status(404).send("Phone is not Found");

  const validPass = await bcrypt.compare(password, admin.password);
  if (!validPass) return res.status(400).send("Phone or password is incorrect");

  const token = jwt.sign({ _id: admin._id }, process.env.TOKEN_ADMIN);
  res.header("auth-token", token).json({
    message:'you are loged in',
    token
  });
};