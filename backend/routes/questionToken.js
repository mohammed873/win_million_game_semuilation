const router = require("express").Router();
const { addQuestionToken } = require("../controllers/questionTokenController");

router.post("/add", addQuestionToken);

module.exports = router;
