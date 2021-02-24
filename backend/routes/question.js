const router = require("express").Router();
const {
  questionAdd,
  getAllQuestions,
  getRandomQuestion,
} = require("../controllers/questionController");
const verify = require("../controllers/validation/tokenVerification");
router.get("/", verify, getAllQuestions);
router.get("/random", getRandomQuestion);
router.post("/", verify, questionAdd);
module.exports = router;
