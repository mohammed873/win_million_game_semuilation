require("dotenv").config();
const Participant = require("../models/participant");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const {
  participantValidations,
  participantLoginValidations,
} = require("./validation/validations");

const { sendMail } = require("./notificatiions/sendMail");
const { sendSms } = require("./notificatiions/sendSms");

//sign up
exports.participRegister = async (req, res, next) => {
  const { error } = participantValidations(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const phoneExist = await Participant.findOne({ phone: req.body.phone });
  if (phoneExist) return res.status(400).send("Phone already exist");

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);

  const participant = new Participant({
    full_name: req.body.full_name,
    age: req.body.age,
    email: req.body.email,
    isValid: true,
    online: false,
    phone: req.body.phone,
    password: hashedPassword,
    score: 0,
  });

  try {
    const savedParticipant = await participant.save();
    res.json({
      message: "particiapnt is successfully added",
      savedParticipant,
    });
  } catch (error) {
    res.status(400).send(error.message);
  }
};

// login
exports.participLogin = async (req, res, next) => {
  const { error } = participantLoginValidations(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const participant = await Participant.findOne({ phone: req.body.phone });
  if (!participant) return res.status(400).send("Phone is not found");

  const validPass = await bcrypt.compare(
    req.body.password,
    participant.password
  );
  if (!validPass) return res.status(400).send("Invalid password");

  const token = jwt.sign(
    { _id: participant._id },
    process.env.PARTICIPANT_TOKEN_SECRET
  );
  res.header("auth-token", token).send(token);
};

//validate acount
exports.participValidation = async (req, res) => {
  try {
    participant = await Participant.findById(req.params.id);
    if (participant == null) {
      return res.status(404).json({ error: "Cannot find participation" });
    }
    participant.isValid = req.body.isValid;
    const updatedParticipant = await participant.save();
    sendMail(updatedParticipant.email);
    sendSms(updatedParticipant.phone);
    res.json(updatedParticipant);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

//get a single participant
exports.getParticipants = async (req, res) => {
  try {
    const participants = await Participant.find();
    res.json(participants);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
