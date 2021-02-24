const Question = require("../models/question");
const Round = require("../models/round");

//add question
exports.questionAdd = async (req, res) => {
  const question = new Question({
    quest: req.body.quest,
    answer: req.body.answer,
    false_choices: req.body.false_choices,
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

//get alla question
exports.getAllQuestions = async (req, res) => {
  try {
    questions = await Question.find();
    res.json(questions);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

//get random question
exports.getRandomQuestion = async (req, res) => {
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
            res.send(
              " pick up another one !,Question has been already answered."
            );
          } else {
            res.json([
              result,
              { message: "/question/add to submit your answer" },
            ]);
          }
        });
    });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};
