const router = require("express").Router();

const {
  participRegister,
  participLogin,
  participValidation,
  getParticipants,
} = require("../controllers/participantController");
const verify = require("../controllers/validation/tokenVerification");
const verifyParticipToken = require("../controllers/validation/tokenParticpation");

router.post("/", participRegister);

router.patch("/valid/:id", verify, participValidation);

router.post("/login", participLogin);

router.get("/", verify, getParticipants);

module.exports = router;
