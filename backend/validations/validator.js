const Joi = require('@hapi/joi');

const createTeamValidation = Joi.object({
    name: Joi.string().required(),
    skills: Joi.string().required()
})


module.exports = { createTeamValidation }