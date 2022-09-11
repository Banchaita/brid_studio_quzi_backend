const moment = require('moment');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var QuestionSchema = new Schema({
    question_file_audio: {
        type: String,
        default: ''
    },
    level_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Levels'
    },
    answer: {
        type: Array,
        default: []
    },
    is_corret_answer: {
        type: String,
        default: ''
    },
    status: {
        type: Number,
        default: 0
    },
    created_at: {
        type: Number,
        default: moment().unix()
    },
    updated_at: {
        type: Number,
        default: 0
    }

});
module.exports = mongoose.model('Question', QuestionSchema, 'question')