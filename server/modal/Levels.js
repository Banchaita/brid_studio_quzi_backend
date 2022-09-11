const moment =require('moment');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var levelSchema = new Schema({
    name:{
        type:String,
        default: ''
    },
    number_of_question:{
        type:Number,
        default:''
    },
    question_timing:{
        type:String,
        default:''
    },
    mutiple_answer_option:{
        type:String,
        default:''
    },
    passing_grade:{
        type:String,
        default:''
    },
    status:{
        type:Number,
        default: 0
    },
    created_at:{
        type:Number,
        default:moment().unix()
    }, 
    updated_at : {
        type : Number,
        default:0
    }

});
module.exports = mongoose.model('Level',levelSchema,'level')