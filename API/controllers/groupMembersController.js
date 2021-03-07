const Group = require("../models/group_members");
const Participant = require("../models/participant");
const log = require("../controllers/logs/log");
const logs = require("../models/logs");
const jwt = require("jsonwebtoken");

//get all groups
exports.getAllGroups = async (req, res) => {
  try {
    const groups = await Group.find();
    res.json(groups);
    log(
      {
        file: "groupMembersControler.js",
        line: "11",
        info: "get all group members",
        type: "INFO",
      },
      logs
    );
  } catch (error) {
    res.status(500).send({ message: error.message });
    log(
      {
        file: "groupMembersControler.js",
        line: "21",
        info: error.message,
        type: "Warning",
      },
      logs
    );
  }
};

//adding new group
exports.addGroup = async (req, res) => {
  const token = req.header("auth-token");
  const id_participant = jwt.verify(token, process.env.PARTICIPANT_TOKEN_SECRET)
    ._id;

  const participant = await Participant.findOne({ _id: id_participant });

  if (participant.isValid) {
    const group = new Group({
      id_participant: id_participant,
      group_code: Math.floor(1000 + Math.random() * 9000),
    });

    try {
      const newGroup = await group.save();
      participant.score = 0;
      participant.save();
      res.status(201).json({
        message: "groub created successfully",
        newGroup,
      });

      log(
        {
          file: "groupMembersControler.js",
          line: "48",
          info: "add new group",
          type: "INFO",
        },
        logs
      );
    } catch (error) {
      res.status(500).send({ error: error.message });

      log(
        {
          file: "groupMembersControler.js",
          line: "58",
          info: error.message,
          type: "Critical",
        },
        logs
      );
    }
  } else {
    res.send({ error: "Your Acount is not valid , yet" });
  }
};

//join group
exports.joinGroup = async (req, res) => {
  const token = req.header("auth-token");
  const id_participant = jwt.verify(token, process.env.PARTICIPANT_TOKEN_SECRET)
    ._id;

  const { group_code } = req.body;
  const participant = await Participant.findOne({ _id: id_participant });

  if (participant.isValid == false) {
    return res.status(400).send("Your Acount is not valid , yet");
  }

  const groupExist = await Group.findOne({ group_code: group_code });

  if (!groupExist)
    return res
      .status(400)
      .send("Group dosen't exist, please create group first");

  Group.countDocuments({ group_code: group_code }, async (err, counter) => {
    if (
      await Group.findOne({
        id_participant: id_participant,
        group_code: group_code,
      })
    )
      return res.status(400).send("You are already in the game");
    if (counter < 4) {
      const group = new Group({
        id_participant: id_participant,
        group_code: groupExist.group_code,
      });

      try {
        const newGroup = await group.save();

        Group.countDocuments(
          { group_code: group_code },
          async (err, counter) => {
            if (counter == 4) {
              res.send("Game started get your question /quest/random");
            } else {
              participant.score = 0;
              participant.save();
              res.send("waiting for other players");
            }
          }
        );
      } catch (error) {
        res.status(500).send({ error: error.message });
      }
    } else {
      res.send({ error: "Group is Full" });
    }
  });
};

//get groub code
exports.getGroupByCode = async (req, res) => {
  var group_participants = [];

  try {
    const groups = await Group.aggregate([
      {
        $match: { group_code: req.body.group_code },
      },
      {
        $lookup: {
          from: "participants",
          localField: "id_participant",
          foreignField: "_id",
          as: "participant",
        },
      },
    ]);

    groups.map((object) => {
      group_participants.push(object.participant[0]);
    });

    var bestScore = Math.max.apply(
      Math,
      group_participants.map(function (participant) {
        return participant.score;
      })
    );
    var finalWinner = group_participants.find(function (o) {
      return o.score == bestScore;
    });
    res.send([finalWinner, { message: "you are the winner" }]);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

//Getting availaible question
exports.getAvailaibleGroups = async (req, res) => {
  try {
    await Group.find((err, data) => {
      var code = data.map((inf) => {
        return inf.group_code;
      });

      var allcodes = code.filter((a, b) => code.indexOf(a) === b);
      res.json(allcodes);
    });
  } catch (error) {
    res.send(error.message);
  }
};

//getting all group members of one group
exports.getAllMembers = async (req, res) => {
  try {
    const groups = await Group.aggregate([
      {
        $match: { group_code: req.body.group_code },
      },
      {
        $lookup: {
          from: "participants",
          localField: "id_participant",
          foreignField: "_id",
          as: "participant",
        },
      },
    ]);
    res.send(groups);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};
