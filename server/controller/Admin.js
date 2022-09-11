var Admin = require('../utils/Admin')
var helpers = require('../services/helper')
var ControllerMessages = require("./controllerMessages");

const adminController= {
    register: async (req, res) => {
        let requiredFields = ['name','email', 'phone','password'];
        let validator = helpers.validateParams(req,requiredFields);
        if(!validator.status){
            return helpers.showOutput(res, helpers.showResponse(false, validator.message), 203);
        }
        let result = await Admin.register(req.body);
        return helpers.showOutput(res, result, result.code);
    },
    
    login: async (req, res) => {
        let requiredFields = ['email', 'password'];
        let validator = helpers.validateParams(req, requiredFields);
        if (!validator.status) {
            return helpers.showOutput(res, helpers.showResponse(false, validator.message), 203);
        }
        let result = await Admin.login(req.body);
        return helpers.showOutput(res, result, result.code);
    },

    updateAdmin: async (req, res) => {
        let admin_id = req.decoded.admin_id;
        if (!admin_id) {
            return helpers.showOutput(res, helpers.showResponse(false, ControllerMessages.INVALID_USER), 403);
        }
        let result = await Admin.updateAdmin(req.body, admin_id);
        return helpers.showOutput(res, result, result.code);
    },

    updatePasswordAdmin: async (req, res) => {
        let admin_id = req.decoded.admin_id;
        if (!admin_id) {
            return helpers.showOutput(res, helpers.showResponse(false, ControllerMessages.INVALID_USER), 403);
        }
        let result = await Admin.updatePasswordAdmin(req.body, admin_id);
        return helpers.showOutput(res, result, result.code);
    },

    getAdmin: async (req, res) => {
        let admin_id = req.decoded.admin_id;
        if (!admin_id) {
            return helpers.showOutput(res, helpers.showResponse(false, ControllerMessages.INVALID_USER), 403);
        }
        let result = await Admin.getAdmin(admin_id);
        return helpers.showOutput(res, result, result.code);
    },
   






    //Add level using admin token
    addLevel: async (req, res) => {
        let requiredFields = ['name','number_of_question','question_timing','mutiple_answer_option'];
        let validator = helpers.validateParams(req,requiredFields);
        if(!validator.status){
            return helpers.showOutput(res, helpers.showResponse(false, validator.message), 203);
        }
        let result = await Admin.addLevel(req.body);
        return helpers.showOutput(res, result, result.code);
    },

    getAllLevel: async (req, res) => {
        let user_id = req.decoded.user_id;
        if (!user_id) {
            return helpers.showOutput(res, helpers.showResponse(false, ControllerMessages.INVALID_ADMIN), 403);
        }
        let result = await Admin.getAllLevel(user_id);
        return helpers.showOutput(res, result, result.code);
    },
    geLevelById: async (req, res) => {
        let requiredFields = ['_id'];
        let validator = helpers.validateParams(req, requiredFields);
        if (!validator.status) {
            return helpers.showOutput(res, helpers.showResponse(false, validator.message), 203);
        }
        let result = await Admin.geLevelById(req.body);
        return helpers.showOutput(res, result, result.code);
    },
    updateLevel: async (req, res) => {
        let requiredFields = ['level_id', 'name'];
        let validator = helpers.validateParams(req,requiredFields);
        if(!validator.status){
            return helpers.showOutput(res, helpers.showResponse(false, validator.message), 203);
        }
        let admin_id = req.decoded.admin_id;
        if(!admin_id){
            return helpers.showOutput(res, helpers.showResponse(false, ControllerMessages.INVALID_ADMIN), 403);
        }
        let result = await Admin.updateLevel(req.body);
        return helpers.showOutput(res, result, result.code);
    },
    addPassingGrade: async (req, res) => {
        let requiredFields = ['_id', 'passing_grade'];
        let validator = helpers.validateParams(req,requiredFields);
        if(!validator.status){
            return helpers.showOutput(res, helpers.showResponse(false, validator.message), 203);
        }
        let admin_id = req.decoded.admin_id;
        if(!admin_id){
            return helpers.showOutput(res, helpers.showResponse(false, ControllerMessages.INVALID_ADMIN), 403);
        }
        let result = await Admin.addPassingGrade(req.body);
        return helpers.showOutput(res, result, result.code);
    },


    


}
module.exports = { ...adminController }