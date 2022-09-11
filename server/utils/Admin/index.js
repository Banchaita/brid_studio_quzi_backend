require('../../db_functions');
let Admin = require('../../modal/Admin');
let Level = require('../../modal/Levels')
let md5 = require('md5')
var Messages = require("./message");
let helpers = require('../../services/helper')
const jwt = require('jsonwebtoken')
let ObjectId = require('mongodb').ObjectID;
let moment = require('moment')

const adminUtils= {
    register: async (data) => {
        let { name,phone, email, password} = data;
        let emailCheck = await getSingleData(Admin, {email, status: { $ne: 2 }}, '');
        if (emailCheck.status) {
            return helpers.showResponse(false, Messages.EMAIL_ALREADY, null, null, 200);
        } else {
            let newObj = {
                name,
                phone,
                email,
                password: md5(password),
                created_at: moment().unix()
            };
            let adminRef = new Admin(newObj)
            let result = await postData(adminRef);
            if (result.status) {
                return helpers.showResponse(true, Messages.ADMIN_REGISTER_SUCCESS, result.data._id, null, 200);
            }
            return helpers.showResponse(false, Messages.ADMIN_LOGIN_SUCCESS, null, null, 200);
        }
    },

    login: async (data) => {
        let { email, password } = data;
        let where = {
            email: email,
            password: md5(password),
            status: { $ne: 2 }
        }
        let result = await getSingleData(Admin, where);
        if (result.status) {
            let token = jwt.sign({ admin_id: result.data._id }, process.env.API_SECRET, {
                expiresIn: process.env.JWT_EXPIRY
            });
            let data = { token, time: process.env.JWT_EXPIRY, admin_data : result.data._id };
            return helpers.showResponse(true, Messages.ADMIN_LOGIN_SUCCESS, data, null, 200);
        }
        return helpers.showResponse(false, Messages.ADMIN_LOGIN_FAILED, null, null, 200);
    },

    getDetails: async (admin_id) => {
        let queryObject = { _id: ObjectId(admin_id), status: { $ne: 2 } }
        let result = await getSingleData(Admin, queryObject, '');
        if (result.status) {
            return helpers.showResponse(true, Messages.ADMIN_DATA, result.data, null, 200);
        }
        return helpers.showResponse(false, Messages.INVALID_ADMIN, null, null, 200);
    },

    updateAdmin: async (data, admin_id) => {
        data.updated_on = moment().unix()
        let result = await updateData(Admin, data, ObjectId(admin_id))
        if (result.status) {
            return helpers.showResponse(true, "Admin Details Updated Successfully", result.data, null, 200);
        }
        return helpers.showResponse(false, 'Unable to update Admin Details', null, null, 200);
    },

    updatePasswordAdmin: async (data, admin_id) => {
        let {old_password, new_password} = data;
        let queryObject = { _id: ObjectId(admin_id), status: { $ne: 2 } }
        let result = await getSingleData(Admin, queryObject, '');
        result = result.data
        if(md5(old_password) != result.password){
            return helpers.showResponse(false, 'Unable to change password! old password is incorrect', null, null, 200);
        }
        data.password=md5(new_password)
        data.updated_on = moment().unix()
        result = await updateData(Admin, data, ObjectId(admin_id))
        if (result.status) {
            return helpers.showResponse(true, "Admin Details Updated Successfully", result.data, null, 200);
        }
        return helpers.showResponse(false, 'Unable to update Admin Details', null, null, 200);
    },

    getAdmin: async (admin_id) => {
        let queryObject = { _id: ObjectId(admin_id), status: { $ne: 2 } }
        let result = await getSingleData(Admin, queryObject, '');
        if (result.status) {
            return helpers.showResponse(true, "Admin Details Updated Successfully", result.data, null, 200);
        }
        return helpers.showResponse(false, 'Unable to update Admin Details', null, null, 200);
    },

    //Add level


    addLevel: async (data) => {
        let {name,number_of_question,question_timing,mutiple_answer_option,passing_grade} = data;
        let nameCheck = await getSingleData(Level, {name, status: { $ne: 2 }}, '');
        if (nameCheck.status) {
            return helpers.showResponse(false, Messages.LEVEL_NAME_ALREDY, null, null, 200);
        }else{
            let newObj = {
                name,
                number_of_question,
                question_timing,
                mutiple_answer_option,
                passing_grade,
                created_at: moment().unix()
            };
            let levelRef = new Level(newObj)
            let result = await postData(levelRef);
            if (result.status) {
                return helpers.showResponse(true, Messages.LEVEL_ADD_SUCCESS, result.data._id, null, 200);
            }
            return helpers.showResponse(false, Messages.LEVEL_ADD_FAILED, null, null, 200);
        }
 
    },
    getAllLevel: async (user_id) => {
        let result = await getDataArray(Level, { status: { $ne: 2 },}, '');
        if (result.status) {
            return helpers.showResponse(true, Messages.LEVEL_DATA, result.data, null, 200);
        }
        return helpers.showResponse(false, Messages.INVALID_LEVEL, null, null, 200);
    },
    geLevelById: async (data) => {
        let { _id } = data
        let result = await getSingleData(Level, { _id: ObjectId(_id) }, '');
        if (result.status) {
            return helpers.showResponse(true, Messages.LEVEL_DATA, result.data, null, 200);
        }
        return helpers.showResponse(false, Messages.INVALID_LEVEL, null, null, 200);
    },
    updateLevel: async (data) => {
        let { level_id, name,} = data;
        let result = await getSingleData(Level, {_id: { $ne: ObjectId(level_id)}, name, status: { $ne: 2 }}, '')
        if(result.status){
            return helpers.showResponse(false, Messages.LEVEL_NAME_EXIST, null, null, 200);
        }
        let editObj = {
            name,
            updated_on: moment().unix()
        };
        let response = await updateData(Level, editObj, ObjectId(level_id));
        if (response.status) {
            return helpers.showResponse(true, Messages.LEVEL_DATA_UPDATED, null, null, 200);
        }
        return helpers.showResponse(false, Messages.LEVEL_UPDATE_FAILED, null, null, 200);
    },

    addPassingGrade: async (data) => {
        let {_id,passing_grade} = data;
        let queryObject = { _id: ObjectId(_id), status: { $ne: 2 } }
        let result = await getSingleData(Level, queryObject, '');
        let editObj = {
            passing_grade,
            updated_on: moment().unix()
        };
        console.log(editObj)
        let response = await updateData(Level, editObj, ObjectId(_id));
        if (response.status) {
            return helpers.showResponse(true, Messages.LEVEL_DATA_UPDATED, null, null, 200);
        }
        return helpers.showResponse(false, Messages.LEVEL_UPDATE_FAILED, null, null, 200);
    },

}
module.exports = { ...adminUtils }