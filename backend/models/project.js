const mongoose = require('mongoose');
const mongoose_delete = require('mongoose-delete');

const Schema = mongoose.Schema;

const projectSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    code: {
        type: String,
        required: true
    },
    smj:{
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    dsmj:{
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: false
    },
    po:{
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
    spo: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: false
    },
    status:{
        type: String,
        required: true
    }
    
},{ timestamps: true })

projectSchema.plugin(mongoose_delete,{ overrideMethods: 'all' });
module.exports = mongoose.model('Project',projectSchema)
