const mongoose = require('mongoose');
const mongoose_delete = require('mongoose-delete');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName:{
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true
    },
    email: {
        type: String, 
        required: true
    },
    skills:{
        type: String,
        required: false
    },
    mobileNo:{
        type: String,
        required: false
    },
    avtaar: {
        type: String,
        required: false
    },
    team:{
        type: Schema.Types.ObjectId,
        ref: 'Team'
    },
    passwordtoken:{
        type: String,
        required: false
    },
    passwordTokenExpiresIn:{
        type: Date,
        required: false
    }
},{ timestamps: true })

userSchema.plugin(mongoose_delete,{ overrideMethods: 'all' });
module.exports = mongoose.model('User',userSchema)
