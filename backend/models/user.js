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
    }
},{ timestamps: true })

userSchema.plugin(mongoose_delete);
module.exports = mongoose.model('User',userSchema)
