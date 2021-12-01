const Joi = require("joi");

exports.postsValidationSchema = Joi.object().keys({
  firstName: Joi.string().error(new Error("add your firstName")).required(),
  lastName: Joi.string().error(new Error("add your lastName")).required(),
  email: Joi.string().regex(/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/).error(new Error("add your email")).required(),
  password: Joi.string().error(new Error("add your password")).required(),
  mobileNo: Joi.string().error(new Error("add your mobile")).required(),
  gender: Joi.string().error(new Error("add your gender")).required()
});
