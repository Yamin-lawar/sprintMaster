const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const tokenSchema = new Schema({
    user:{
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    token:{
        type: String,
        required: true
    },
    expiredAt: {
        type: Date,
        required: true
    }
},{ timestamps: true })

module.exports = mongoose.model('Token',tokenSchema)
