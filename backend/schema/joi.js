const joi = require("joi");

const registrationSchema = joi.object({
    site: joi.string().alphanum().min(3).max(30).required(),
    username : joi.string().alphanum().min(3).max(30).required(),
    password: joi.string().min(3).max(30).required().pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/),
    status: joi.string().required().valid("active","inactive")

});

module.exports = registrationSchema;