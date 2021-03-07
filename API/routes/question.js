const router = require("express").Router();
const {
  questionAdd,
  getAllQuestions,
  getQuestions,
} = require("../controllers/questionController");
const verify = require("../controllers/validation/tokenVerification");
router.get("/", verify, getAllQuestions);
router.get("/getQuestion", getQuestions);
router.post("/", verify, questionAdd);
module.exports = router;
