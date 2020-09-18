const mongoose = require('mongoose');
const mongoose_delete = require('mongoose-delete');

const Schema = mongoose.Schema;

const sprintSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    code: {
        type: String,
        required: true
    },
    startDate:{
        type: Date,
        required: true
    },
    endDate:{
        type: Date,
        required: true
    },
    createdBy:{
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
    projects:{
        _id:{
            type: Schema.Types.ObjectId,
            ref: 'Project',
        },
        name:{
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
        poRanking: {
            type: Number,
            required: false
        },
        gurujiRanking: {
            type: Number,
            required: false
        },
        completion: {
            type: Number,
            required: false
        },
    },
    task:{
        _id:{
            type: Schema.Types.ObjectId,
            required: false
        },
        name:{
            type: String,
            required: true
        },
        user:{
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        hours:{
            type: Number,
            required: true
        },
        createdBy:{
            type: Schema.Types.ObjectId,
            ref: 'User',
        },
        createdAt:{
            type: Date,
            required: true
        },
        createdAt:{
            type: Date,
            required: true
        },
        completion: {
            type: Number,
            required: false
        },
        status: {
            type: String,
            required: true
        },
        comments:{
            user: {
                type: Schema.Types.ObjectId,
                ref: 'User',
                required: true
            },
            comment: {
                type: String,
                required: true
            },
            createdAt:{
                type: Date,
                required: true
            },
        }
    }
},{ timestamps: true })

sprintSchema.plugin(mongoose_delete,{ overrideMethods: 'all' });
module.exports = mongoose.model('Sprint',sprintSchema)
