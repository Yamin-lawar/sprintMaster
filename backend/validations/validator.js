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
const resetPasswordValidation = Joi.object({
    resetToken: Joi.string().required().messages({"string.empty": `Problem in authorising your reset password`}),
    newPassword: Joi.string().regex(RegExp(passwordPattern)).required().messages({"string.empty": `Please enter new password`,"string.pattern.base":`Password should be minimum 8 character, one upper case, one lower case, one number and one special character is mandatory`}), 
    confirmPassword: Joi.string().required().valid(Joi.ref('newPassword'))
}).with('confirmPassword', 'newPassword')

const createProjectValidation = Joi.object({
    name: Joi.string().required().messages({"string.empty": `Please enter project name`}),
    code: Joi.string().required().messages({"string.empty": `Please enter project code`}),
    smj: Joi.string().required().messages({"string.empty": `Please select SMJ for project`}),
    po: Joi.string().required().messages({"string.empty": `Please select PO for project`}),
    status: Joi.string().required().messages({"string.empty": `Please select status for project`}),
}).unknown();

const updateProjectValidation = Joi.object({
    _id: Joi.string().required().messages({"string.empty": `Please select project to update`}),    
    name: Joi.string().required().messages({"string.empty": `Please enter project name`}),
    code: Joi.string().required().messages({"string.empty": `Please enter project code`}),
    smj: Joi.string().required().messages({"string.empty": `Please select SMJ for project`}),
    po: Joi.string().required().messages({"string.empty": `Please select PO for project`}),
    status: Joi.string().required().messages({"string.empty": `Please select status for project`}),
}).unknown();

const removeProjectValidation = Joi.object({
    _id: Joi.string().required().messages({"string.empty": `Please select project to remove`}),    
   
}).unknown();

const createSprintValidation = Joi.object({
    name: Joi.string().required().messages({"string.empty": `Please enter sprint name`}),
    startDate: Joi.string().required().messages({"string.empty": `Please select start date for sprint`}),
    endDate: Joi.string().required().messages({"string.empty": `Please select end date for sprint`}),
    createdBy: Joi.string().required().messages({"string.empty": `Sprint owner is not defined`}),
}).unknown()

const addUpdateTaskValidation = Joi.object({
    sprintId: Joi.string().required().messages({"string.empty": `Sprint is not available`}),
    projectId: Joi.string().required().messages({"string.empty": `Project is not available`}),

}).unknown()

const updateTaskStatusValidation = Joi.object({
    sprintId: Joi.string().required().messages({"string.empty": `Sprint is not available`}),
    projectId: Joi.string().required().messages({"string.empty": `Project is not available`}),
    taskId: Joi.string().required().messages({"string.empty": `Task is not available`}),
    status: Joi.string().required().messages({"string.empty": `Please select status`}),
    completion: Joi.required().messages({"string.empty": `Please enter complition rate`}),
}).unknown()

const updateSprintValidation = Joi.object({
    sprintId: Joi.string().required().messages({"string.empty": `Please select sprint`}),
    name: Joi.string().required().messages({"string.empty": `Please enter sprint name`}),
    startDate: Joi.string().required().messages({"string.empty": `Please select start date for sprint`}),
    endDate: Joi.string().required().messages({"string.empty": `Please select end date for sprint`}),
    sprintHours: Joi.required().messages({"string.empty": `Please enter sprint hours`}),
}).unknown()

const deleteSprintValidation = Joi.object({
    _id: Joi.string().required().messages({"string.empty": `Please select sprint to remove`}),    
}).unknown();

const updateProjectRankingValidation = Joi.object({
    sprintId: Joi.string().required().messages({"string.empty": `Sprint is not available`}),
    projectId: Joi.string().required().messages({"string.empty": `Project is not available`}),
}).unknown()

const addCommentValidation = Joi.object({
    sprintId: Joi.string().required().messages({"string.empty": `Sprint is not available`}),
    projectId: Joi.string().required().messages({"string.empty": `Project is not available`}),
    taskId: Joi.string().required().messages({"string.empty": `Task is not available`}),
    comment: Joi.string().required().messages({"string.empty": `Please enter comment`}),
})

const updateCommentValidation = Joi.object({
    sprintId: Joi.string().required().messages({"string.empty": `Sprint is not available`}),
    projectId: Joi.string().required().messages({"string.empty": `Project is not available`}),
    taskId: Joi.string().required().messages({"string.empty": `Task is not available`}),
    commentId: Joi.string().required().messages({"string.empty": `Comment is not available`}),
    comment: Joi.string().required().messages({"string.empty": `Please enter comment`}),
})

const deleteCommentValidation = Joi.object({
    sprintId: Joi.string().required().messages({"string.empty": `Sprint is not available`}),
    projectId: Joi.string().required().messages({"string.empty": `Project is not available`}),
    taskId: Joi.string().required().messages({"string.empty": `Task is not available`}),
    commentId: Joi.string().required().messages({"string.empty": `Please select comment to remove`}),    
})



module.exports = {
    createUserValidation,
    createTeamValidation,
    updateTeamValidation,
    removeTeamValidation,
    updateUserValidation,
    removeUserValidation,
    changePasswordValidation,
    forgotPasswordValidation,
    resetPasswordValidation,
    createProjectValidation,
    updateProjectValidation,
    removeProjectValidation,
    createSprintValidation,
    addUpdateTaskValidation,
    updateTaskStatusValidation,
    updateSprintValidation,
    deleteSprintValidation,
    updateProjectRankingValidation,
    addCommentValidation,
    updateCommentValidation,
    deleteCommentValidation
}


