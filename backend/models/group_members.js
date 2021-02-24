const mongoose = require("mongoose");

const goupMembersSchema = new mongoose.Schema({
  id_participant: {
    type: mongoose.Types.ObjectId,
    ref: "participants",
  },
  group_code: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model("GroupMemebers", goupMembersSchema);
