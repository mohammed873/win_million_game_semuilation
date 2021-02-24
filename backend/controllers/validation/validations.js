const Joi = require("joi");

//phone regex
const exp = /^(?:(?:(?:\+|00)212[\s]?(?:[\s]?\(0\)[\s]?)?)|0){1}(?:5[\s.-]?[2-3]|6[\s.-]?[13-9]){1}[0-9]{1}(?:[\s.-]?\d{2}){3}$/;

//validating admin fields
const adminValidations = (data) => {
  const AdminValidation = Joi.object({
    full_name: Joi.string().min(4).required(),
    phone: Joi.string().pattern(new RegExp(exp)).min(10).required(),
    password: Joi.string().min(6).required(),
  });
  return AdminValidation.validate(data);
};

//validating the login
const LoginValidations = (data) => {
  const adminLoginValidation = Joi.object({
    phone: Joi.string().pattern(new RegExp(exp)).min(10).required(),
    password: Joi.string().min(6).required(),
  });
  return adminLoginValidation.validate(data);
};

//validating the participant fields
const participantValidations = (data) => {
  const participantValidation = Joi.object({
    full_name: Joi.string().min(6).required(),
    age: Joi.required(),
    email: Joi.string().email().required(),
    phone: Joi.string().pattern(new RegExp(exp)).min(10).max(14).required(),
    password: Joi.string().min(6).required(),
  });
  return participantValidation.validate(data);
};

//validating particiapnt login
const participantLoginValidations = (data) => {
  const participantLoginValidation = Joi.object({
    phone: Joi.string().pattern(new RegExp(exp)).min(10).required(),
    password: Joi.string().min(6).required(),
  });
  return participantLoginValidation.validate(data);
};

exports.adminValidations = adminValidations;
exports.LoginValidations = LoginValidations;
exports.participantValidations = participantValidations;
exports.participantLoginValidations = participantLoginValidations;
