const Joi = require('@hapi/joi');

const createTeamValidation = Joi.object({
    name: Joi.string().required().messages({"string.empty": `Please enter name of team`})
}).unknown()


const createUserValidation = Joi.object({
    firstName: Joi.string().required().messages({"string.empty": `Please enter first name`}),
    lastName: Joi.string().required().messages({"string.empty": `Please enter last name`}),
    email: Joi.string().required().email().messages({"string.empty": `Please enter email`,"string.email": `Please enter proper email`}),
    password: Joi.string().required().messages({"string.empty": `Please enter password`}),
    team: Joi.string().required().messages({"string.empty":`Please select team for user`})
}).unknown();

module.exports = {
    createUserValidation,
    createTeamValidation
}


