const router = require("express").Router();

const { addQuestionToken } = require("../controllers/questionTokenController");
const verifyParticipToken = require("../controllers/validation/tokenParticpation");

router.post("/add", verifyParticipToken,addQuestionToken);

module.exports = router;
