const moment =require('moment');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var AdminSchema = new Schema({
    name:{
        type:String,
        default: ''
    },
    email:{
        type:String,
        default:''
    },
    phone:{
        type:Number,
        default:''
    },
    password:{
        type:String,
        default:''
    },
    otp: {
        type:String,
        default: ''
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
module.exports = mongoose.model('Admin',AdminSchema,'admin')