const mongoose = require('mongoose');
const mongoose_delete = require('mongoose-delete');

const Schema = mongoose.Schema;

const commentSchema = new Schema({
    _id:{
        type: Schema.Types.ObjectId,
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
    comment: {
        type: String,
    },
    createdAt:{
        type: Date,
    }
})

const taskSchame = new Schema({
    _id:{
        type: Schema.Types.ObjectId,
    },
    name:{
        type: String,
    },
    user:{
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
    hours:{
        type: Number,
    },
    createdBy:{
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
    createdAt:{
        type: Date,
    },
    completion: {
        type: Number,
        required: false,
        default: 0
    },
    status: {
        type: String,
    },
    comments:[commentSchema]
})

const projectSchema = new Schema({
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
        required: false,
    },
    gurujiRanking: {
        type: Number,
        required: false,
    },
    completion: {
        type: Number,
        required: false,
        default: 0
    },
    task:[taskSchame]
})

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
    projects: [projectSchema],
    status: {
        type: String,
        required: true
    },
    completion: {
        type: Number,
        required: false,
        default: 0
    }
    
},{ timestamps: true })

sprintSchema.plugin(mongoose_delete,{ overrideMethods: 'all' });
module.exports = mongoose.model('Sprint',sprintSchema)
