const moment =require('moment');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
    name:{
        type:String,
        default: ''
    },
    email:{
        type:String,
        default:''
    },
    is_email_verified: {    
        type: Number,
        default: 0
    },
    password:{
        type:String,
        default:''
    },
    location:{
        type:String,
        default:''
    },
    startingyear:{
        type:Number,
        default:''
    },
    otp: {
        type:String,
        default: ''
    },
    progress:{
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
module.exports = mongoose.model('User',UserSchema,'user')