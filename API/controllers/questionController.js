const Question = require("../models/question");
const Round = require("../models/round");

//add question
exports.questionAdd = async (req, res) => {
  const question = new Question({
    quest: req.body.quest,
    answer: req.body.answer,
    possible_answers: req.body.possible_answers,
    points: req.body.points,
  });

  try {
    const savedQuestion = await question.save();
    res.json({
      message: "gestion is created",
      savedQuestion,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

//get all question
exports.getAllQuestions = async (req, res) => {
  try {
    questions = await Question.find();
    res.json(questions);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

async function test(req, res) {
  try {
    Question.countDocuments((err, count) => {
      var random = Math.floor(Math.random() * count);

      Question.findOne()
        .skip(random)
        .exec(async (err, result) => {
          const checkQuest = await Round.findOne({
            id_question: result._id,
            is_answered: true,
          });
          if (checkQuest) {
            test(req, res);
          } else {
            res.send(result);
          }
        });
    });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
}

//get random question
exports.getRandomQuestion = async (req, res) => {
  test(req, res);
};


exports.getQuestions = async (req, res) => {
  try {
    questions = await Question.find().limit(7);
    res.json(questions);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};
