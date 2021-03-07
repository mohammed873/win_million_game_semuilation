const express = require("express");
const router = express.Router();

const {
  getAllGroups,
  addGroup,
  joinGroup,
  getGroupByCode,
  getAvailaibleGroups,
  getAllMembers,
} = require("../controllers/groupMembersController");
const verifyParticipToken = require("../controllers/validation/tokenParticpation");
router.get("/", verifyParticipToken, getAllGroups);
router.post("/", verifyParticipToken, addGroup);
router.post("/join", verifyParticipToken, joinGroup);
router.post("/final", getGroupByCode);
router.get("/availaible", getAvailaibleGroups);
router.post("/groupMembers", getAllMembers);

module.exports = router;
