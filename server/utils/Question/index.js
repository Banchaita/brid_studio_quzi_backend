require('../../db_functions');
let Question = require('../../modal/Question');
let Level = require('../../modal/Levels')
var Messages = require("./message");
let helpers = require('../../services/helper')
let ObjectId = require('mongodb').ObjectID;
let moment = require('moment')


const qusestionUtils = {
    addQuestion: async (data) => {
        let { file, level_id, } = data;
        let newObj = {
            question_file_audio: file,
            level_id,
        };
        let qestionnRef = new Question(newObj)
        let result = await postData(qestionnRef);
        if (result.status) {
            return helpers.showResponse(true, Messages.GAMING_QUESTION_ADDING_SUCCESS, result.data._id, null, 200);
        }
        return helpers.showResponse(false, Messages.GAMING_QUESTION_ADDING_FAILED, null, null, 200);
    },
    updateQuestion: async (data) => {
        let { _id, question_file_audio} = data;
        let queryObject = { _id: { $ne: ObjectId(_id) },status: { $ne: 2 } }
        let result = await getSingleData(Question, queryObject, '');
        if (result.status) {
            return helpers.showResponse(false, Messages.ADMIN_EXIST, result.data, null, 200);
        }
        let adminData = {
            question_file_audio,
            updated_at: moment().unix()
        }
        let response = await updateData(Question, adminData, ObjectId(_id));
        if (response.status) {
            return helpers.showResponse(true, Messages. GAMING_QUESTION_UPDATE_SUCCESS, null, null, 200);
        }
        return helpers.showResponse(false, Messages.ADMIN_UPDATE_FAILED, null, null, 200);
    },


    AddAnswer: async (data) => {
        let { _id, answer} = data;
        let queryObject = { _id: { $ne: ObjectId(_id) },status: { $ne: 2 } }
        let result = await getSingleData(Question, queryObject, '');
        let answerData = {
            answer: JSON.parse(answer),
            updated_at: moment().unix()
        }
        let response = await updateData(Question, answerData, ObjectId(_id));
        if (response.status) {
            return helpers.showResponse(true, Messages.GAMING_ANSWER_UPDATE_SUCCESS, null, null, 200);
        }
        return helpers.showResponse(false, Messages.GAMING_ANSWER_UPDATE_FAIED, null, null, 200);
    },
    AddcorrectAnswer: async (data) => {
        let { _id, is_corret_answer} = data;
        let queryObject = { _id: { $ne: ObjectId(_id) },status: { $ne: 2 } }
        let result = await getSingleData(Question, queryObject, '');
        let answerData = {
            is_corret_answer,
            updated_at: moment().unix()
        }
        let response = await updateData(Question, answerData, ObjectId(_id));
        if (response.status) {
            return helpers.showResponse(true, Messages.GAMING_ANSWER_UPDATE_SUCCESS, null, null, 200);
        }
        return helpers.showResponse(false, Messages.GAMING_ANSWER_UPDATE_FAIED, null, null, 200);
    },


    








    //Using User token

    getAllQuestion: async (admin_id) => {
        let result = await getDataArray(Question, { status: { $ne: 2 }, }, '-is_corret_answer');
        if (result.status) {
            return helpers.showResponse(true, Messages.LEVEL_DATA, result.data, null, 200);
        }
        return helpers.showResponse(false, Messages.INVALID_LEVEL, null, null, 200);
    },
    getQuestionByLevel: async (data) => {
        let { level_id } = data;
        let queryObject = { _id: ObjectId(level_id), status: { $ne: 2 } }
        console.log(queryObject)

        let populate = [{
            path: 'level_id',
            select: 'name number_of_question question_timing mutiple_answer_option'
        },]
        let result = getSingleData(Level, queryObject,'passing_grade', populate);
        console.log(result)
        if (result.status) {
            return helpers.showResponse(true, Messages.QUESTIONS_LIST, result.data, null, 200);
        }
        return helpers.showResponse(false, Messages. INVALID_LEVEL, null, null, 200);
    },
    checkCrrectAnswer: async (data) => {
        let { _id,is_corret_answer } = data;
        let query = {  _id: ObjectId(_id),is_corret_answer: { $eq: is_corret_answer } }
        let result = await getSingleData(Question, {
            is_corret_answer,
            status: { $ne: 2 }
        }, '');
        if (result.status) {
            return helpers.showResponse(true, Messages.ANSWER_ARE_SOME, null, null, 200);
        }
        return helpers.showResponse(false, Messages.ANSWER_ARE_NOT_SOME, null, null, 200);
    },



}
module.exports = { ...qusestionUtils }