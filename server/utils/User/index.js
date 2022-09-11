require('../../db_functions');
let User = require('../../modal/User');
let Level = require('../../modal/Levels')
let ObjectId = require('mongodb').ObjectId;
let md5 = require('md5')
var Messages = require("./message");
let helpers = require('../../services/helper')
const jwt = require('jsonwebtoken')
let moment = require('moment')
// let { Country, State, City } = require('country-state-city');
let nodemailer = require('nodemailer')

const userUtils = {
    checkEmailExistance: async (data) => {
        let { email } = data;
        if (!helpers.validateEmail(email)) {
            return helpers.showResponse(false, Messages.INVALID_EMAIL_FORMAT, null, null, 200);
        }
        let result = await getSingleData(User, {
            email,
            status: { $ne: 2 }
        }, '');
        if (result.status) {
            return helpers.showResponse(true, Messages.EMAIL_ALREADY, null, null, 200);
        }
        return helpers.showResponse(false, Messages.NEW_EMAIL, null, null, 200);
    },
    register: async (data) => {
        let { name, email, password, location, startingyear, progress } = data;
        let emailCheck = await getSingleData(User, { email, status: { $ne: 2 } }, '');
        if (emailCheck.status) {
            return helpers.showResponse(false, Messages.EMAIL_ALREADY, null, null, 200);
        } else {
            let newObj = {
                name,
                email,
                password: md5(password),
                location,
                startingyear,
                progress,
                created_at: moment().unix()
            };
            let userRef = new User(newObj)
            let result = await postData(userRef);
            if (result.status) {
                let queryObject = { email: { $eq: email } }
                let results = await getSingleData(User, queryObject, '');
                if (results.status) {
                    let otp = helpers.randomStr(4, "1234567890");
                    let UserData = {
                        otp,
                        updated_at: moment().unix()
                    }
                    let response = await updateData(User, UserData, ObjectId(result.data._id))
                    if (response.status) {
                        try {
                            let transporter = nodemailer.createTransport({
                                host: 'smtp.googlemail.com',
                                secure: false,
                                port: 587,
                                auth: {
                                    user: 'sanchaitabiswas4@gmail.com',
                                    pass: 'banchaita@1998',
                                },
                            });
                            await transporter.sendMail({
                                from: 'sanchaitabiswas4@gmail.com', // sender address
                                to: email, // list of receivers
                                subject: "Welcome to Clare View Quzi Game", // Subject line
                                html: "<b>Greetings, </b><br /><br />Here is your 4 Digits verification Code<br />" +
                                    "<h2>" + otp + "</h2><br /><br /><label><small>Please use this code to change your password." +
                                    "</small></label><br /><br /><label>Thanks & Regards</label><br /><label>Socrates " +
                                    "Community</label>", // html body
                            });
                            if (result.status) {
                                let token = jwt.sign({ user_id: result.data._id }, process.env.API_SECRET, {
                                    expiresIn: process.env.JWT_EXPIRY
                                });
                                let userdata = results.data;
                                let data = { token, time: process.env.JWT_EXPIRY, userdata };
                                return helpers.showResponse(true, Messages.FP_EMAIL_SENT, data, null, 200);
                            }
                        }
                        catch (err) {
                            return helpers.showResponse(false, Messages.EMAIL_ERROR, err, null, 200);
                        }
                    }
                }
            }
        }
    },

    login: async (data) => {
        let { email, password } = data;
        let where = {
            email: email,
            password: md5(password),
            status: { $ne: 2 }
        }
        let result = await getSingleData(User, where);
        if (result.status) {
            let token = jwt.sign({ user_id: result.data._id }, process.env.API_SECRET, {
                expiresIn: process.env.JWT_EXPIRY
            });
            let userdata = result.data;
            let data = { token, time: process.env.JWT_EXPIRY, userdata };
            return helpers.showResponse(true, Messages.USER_LOGIN_SUCCESS, data, null, 200);
        }
        return helpers.showResponse(false, Messages.USER_LOGIN_FAILED, null, null, 200);
    },

    getAllUsers: async () => {
        let queryObject = { status: { $ne: 2 } }
        let result = await getDataArray(User, queryObject, '');
        console.log(result)
        if (result.status) {
            return helpers.showResponse(true, 'All User Data', result.data, null, 200);
        }
        return helpers.showResponse(false, "No Data Found", null, null, 200);
    },

    getUser: async (user_id) => {
        let queryObject = { _id : ObjectId(user_id), status: { $ne: 2 } }
        let result = await getSingleData(User, queryObject, '');
        if (result.status) {
            return helpers.showResponse(true, 'All User Data', result.data, null, 200);
        }
        return helpers.showResponse(false, "No Data Found", null, null, 200);
    },

    updateUsers: async (data) => {
        console.log(data)
        data.updated_on = moment().unix()
        let result = await updateData(User, data, ObjectId(data._id))
        console.log(result)
        if (result.status) {
            return helpers.showResponse(true, 'User Details Updated', result.data, null, 200);
        }
        return helpers.showResponse(false, "Unable To Update Data", null, null, 200);
    },

    // user

    verifyOtp: async (data, user_id) => {
        let { otp } = data;
        let result = await getSingleData(User, { _id: ObjectId(user_id), otp, status: { $ne: 2 } }, '');
        if (!result.status) {
            return helpers.showResponse(false, Messages.INVALID_OTP, null, null, 200);
        }
        let editObj = {
            is_email_verified: 1,
            status: 1,
            updated_at: moment().unix()
        }
        let response = await updateData(User, editObj, ObjectId(user_id))
        let userdata = response.data;
        if (response.status) {
            return helpers.showResponse(true, Messages.VALID_OTP, userdata, null, 200);
        }
        return helpers.showResponse(false, Messages.INVALID_OTP, null, null, 200);
    },

    addlocation: async (data, user_id) => {
        let { location, startingyear } = data;
        let UserData = {
            location,
            startingyear,
            updated_at: moment().unix()
        }
        let response = await updateData(User, UserData, ObjectId(user_id));
        if (response.status) {
            return helpers.showResponse(true, Messages.USER_UPDATED, null, null, 200);
        }
        return helpers.showResponse(false, Messages.USER_UPDATE_FAILED, null, null, 200);
    },


    getAddress: async (data) => {
        let finalData = [];
        if( 'address' in data && data.address != '' && data.address == 'country' ){
            finalData = [...Country.getAllCountries()]
        }
        if( 'address' in data && data.address != '' && 'country' in data && data.country != '' && data.address == 'state' ){
            finalData = [...State.getStatesOfCountry(data.country)]
        }
        if( 'address' in data && data.address != '' && 'country' in data && data.country != '' && 'state' in data && data.state != '' && data.address == 'city' ){
            finalData = [...City.getCitiesOfState(data.country, data.state)]
        }
        if (finalData.length > 0) {
            return helpers.showResponse(true, `all ${data.address}`, finalData, null, 200);
        }
        return helpers.showResponse(false, `No Data Found`, null, null, 200);
    },

    ckeckPassgrade: async (data) => {
        let { _id,user_id,passing_grade,progress } = data;
        let query = {  _id: ObjectId(_id),passing_grade: { $eq: passing_grade } }
        console.log(query)
        let result = await getSingleData(Level, {
            passing_grade,
            status: { $ne: 2 }
        },);
        console.log('result----------',result)
        //  if (result.status) {
        //     let query = {  _id: ObjectId(_id),passing_grade: { $eq: progress} }
        //     let editObj ={
        //         progress,
        //     }
        //     console.log('editObj--------',editObj)
        //     let response = await updateData(User, editObj, ObjectId(user_id))
        //     if (response.status) {
        //         return helpers.showResponse(true,'you are passing this level', editObj, null, 200);
        //     }
        //     return helpers.showResponse(false,'you are not passing this level' , null, null, 200);
        // }
        // return helpers.showResponse(false, Messages.LEVEL_UPDATE_FAILED, null, null, 200);
       
    },


}
module.exports = { ...userUtils }