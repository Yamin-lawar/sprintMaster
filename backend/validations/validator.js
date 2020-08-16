const Joi = require('@hapi/joi');
const passwordPattern = /^(?=.*[0-9])(?=.*[A-Z])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,16}$/;
const createTeamValidation = Joi.object({
    name: Joi.string().required().messages({"string.empty": `Please enter name of team`})
}).unknown();

const updateTeamValidation = Joi.object({
    _id: Joi.string().required().messages({"string.empty": `Please select team to update`}),
    name: Joi.string().required().messages({"string.empty": `Please enter name of team`})
}).unknown(); 


const createUserValidation = Joi.object({
    firstName: Joi.string().required().messages({"string.empty": `Please enter first name`}),
    lastName: Joi.string().required().messages({"string.empty": `Please enter last name`}),
    email: Joi.string().required().email().messages({"string.empty": `Please enter email`,"string.email": `Please enter proper email`}),
    team: Joi.string().required().messages({"string.empty":`Please select team for user`})
}).unknown();

const updateUserValidation = Joi.object({
    _id: Joi.string().required().messages({"string.empty": `Please select user to update`}),
    firstName: Joi.string().required().messages({"string.empty": `Please enter first name`}),
    lastName: Joi.string().required().messages({"string.empty": `Please enter last name`}),
    team: Joi.string().required().messages({"string.empty":`Please select team for user`})
}).unknown();

const removeUserValidation = Joi.object({
    _id: Joi.string().required().messages({"string.empty": `Please select user to remove`})
})

const removeTeamValidation = Joi.object({
    _id: Joi.string().required().messages({"string.empty": `Please select team to remove`})
})

const changePasswordValidation = Joi.object({
    _id: Joi.string().required().messages({"string.empty": `Please select team to remove`}),
    oldPassword: Joi.string().required().messages({"string.empty": `Please enter old password`}),   
    newPassword: Joi.string().regex(RegExp(passwordPattern)).required().messages({"string.empty": `Please enter new password`,"string.pattern.base":`Password should be minimum 8 character, one upper case, one lower case, one number and one special character is mandatory`}),
    confirmPassword: Joi.string().required().valid(Joi.ref('newPassword'))
}).with('confirmPassword', 'newPassword')

const forgotPasswordValidation = Joi.object({
    email: Joi.string().required().email().messages({"string.empty": `Please enter email`,"string.email": `Please enter proper email`})
})

module.exports = {
    createUserValidation,
    createTeamValidation,
    updateTeamValidation,
    removeTeamValidation,
    updateUserValidation,
    removeUserValidation,
    changePasswordValidation,
    forgotPasswordValidation
}


