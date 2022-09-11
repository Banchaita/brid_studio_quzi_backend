var Question = require('../utils/Question')
var helpers = require('../services/helper')
var ControllerMessages = require("./controllerMessages");
var upload = require('../services/image_upload')
var singleUpload = upload.single('question_file_audio')


const questionContraller = {

    //Using Admin 

    addQuestion: async (req, res) => {
        singleUpload(req, res, async (err) => {
            if (!req.file) {
                return helpers.showOutput(res, helpers.showResponse(false, ControllerMessages.NO_IMAGE), 203);
            }
            let { filename } = req.file;
            let requiredFields = ['level_id',];
            let validator = helpers.validateParams(req, requiredFields);
            if (!validator.status) {
                return helpers.showOutput(res, helpers.showResponse(false, validator.message), 203);
            }
            req.body.file = filename;
            let result = await Question.addQuestion(req.body);
            return helpers.showOutput(res, result, result.code);
        });
    },

    updateQuestion: async (req, res) => {
        singleUpload(req, res, async (err) => {
            if (!req.file) {
                return helpers.showOutput(res, helpers.showResponse(false, ControllerMessages.NO_IMAGE), 203);
            }
            let { filename } = req.file;
            let requiredFields = ['_id'];
            let validator = helpers.validateParams(req, requiredFields);
            if (!validator.status) {
                return helpers.showOutput(res, helpers.showResponse(false, validator.message), 203);
            }
            req.body.file = filename;
            let result = await Question.updateQuestion(req.body);
            return helpers.showOutput(res, result, result.code);
        });
    },

    AddAnswer: async (req, res) => {
        let requiredFields = ['_id'];
        let validator = helpers.validateParams(req, requiredFields);
        if (!validator.status) {
            return helpers.showOutput(res, helpers.showResponse(false, validator.message), 203);
        }
        let result = await Question.AddAnswer(req.body);
        return helpers.showOutput(res, result, result.code);
    },
    AddcorrectAnswer: async (req, res) => {
        let requiredFields = ['_id'];
        let validator = helpers.validateParams(req, requiredFields);
        if (!validator.status) {
            return helpers.showOutput(res, helpers.showResponse(false, validator.message), 203);
        }
        let result = await Question.AddcorrectAnswer(req.body);
        return helpers.showOutput(res, result, result.code);
    },

    //Using user token
    getAllQuestion: async (req, res) => {
        let user_id = req.decoded.user_id;
        if (!user_id) {
            return helpers.showOutput(res, helpers.showResponse(false, ControllerMessages.INVALID_ADMIN), 403);
        }
        let result = await Question.getAllQuestion(user_id);
        return helpers.showOutput(res, result, result.code);
    },
    getQuestionByLevel: async (req, res) => {
        let requiredFields = ['level_id'];
        let validator = helpers.validateParams(req, requiredFields);
        if (!validator.status) {
            return helpers.showOutput(res, helpers.showResponse(false, validator.message), 203);
        }
        let result = await Question.getQuestionByLevel(req.body);
        console.log(result)
        return helpers.showOutput(res, result, result.code);
    },
    checkCrrectAnswer: async (req, res) => {
        let requiredFields = ['is_corret_answer','_id'];
        let validator = helpers.validateParams(req,requiredFields);
        if(!validator.status){
            return helpers.showOutput(res, helpers.showResponse(false, validator.message), 203);
        }
        let result = await Question.checkCrrectAnswer(req.body);
        return helpers.showOutput(res, result, result.code);
    },

}
module.exports = { ...questionContraller }