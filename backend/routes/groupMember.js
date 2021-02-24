const express = require("express");
const router = express.Router();

const {
  getAllGroups,
  addGroup,
  joinGroup,
  getGroupByCode,
} = require("../controllers/groupMembersController");
const verifyParticipToken = require("../controllers/validation/tokenParticpation");
router.get("/", verifyParticipToken, getAllGroups);
router.post("/", verifyParticipToken, addGroup);
router.post("/join", verifyParticipToken, joinGroup);
router.get("/final", getGroupByCode);

module.exports = router;
