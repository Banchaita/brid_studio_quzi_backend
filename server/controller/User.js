var User = require('../utils/User')
var helpers = require('../services/helper')
var ControllerMessages = require("./controllerMessages");

const userController ={
    checkEmailExistance: async (req, res) => {
        let requiredFields = ['email'];
        let validator = helpers.validateParams(req,requiredFields);
        if(!validator.status){
            return helpers.showOutput(res, helpers.showResponse(false, validator.message), 203);
        }
        let result = await User.checkEmailExistance(req.body);
        return helpers.showOutput(res, result, result.code);
    },
    resgister: async (req, res) => {
        let requiredFields = ['name','email','password'];
        let validator = helpers.validateParams(req,requiredFields);
        if(!validator.status){
            return helpers.showOutput(res, helpers.showResponse(false, validator.message), 203);
        }
        let result = await User.register(req.body);
        return helpers.showOutput(res, result, result.code);
    },
    login: async (req, res) => {
        let requiredFields = ['email', 'password'];
        let validator = helpers.validateParams(req, requiredFields);
        if (!validator.status) {
            return helpers.showOutput(res, helpers.showResponse(false, validator.message), 203);
        }
        let result = await User.login(req.body);
        return helpers.showOutput(res, result, result.code);
    },

    getAllUsers: async (req, res) => {
        let result = await User.getAllUsers();
        return helpers.showOutput(res, result, result.code);
    },

    getUser: async (req, res) => {
        let result = await User.getUser(req.body.user_id);
        return helpers.showOutput(res, result, result.code);
    },

    updateUsers: async (req, res) => {
        let admin_id = req.decoded.admin_id;
        if (!admin_id) {
            return helpers.showOutput(res, helpers.showResponse(false, ControllerMessages.INVALID_USER), 403);
        }
        let result = await User.updateUsers(req.body);
        return helpers.showOutput(res, result, result.code);
    },

    // user

    verifyOtp: async (req, res) => {
        let requiredFields = ['otp'];
        let validator = helpers.validateParams(req, requiredFields);
        if (!validator.status) {
            return helpers.showOutput(res, helpers.showResponse(false, validator.message), 203);
        }
        let user_id = req.decoded.user_id;
        if (!user_id) {
            return helpers.showOutput(res, helpers.showResponse(false, ControllerMessages.INVALID_USER), 403);
        }
        let result = await User.verifyOtp(req.body, user_id);
        return helpers.showOutput(res, result, result.code);
    },
    addlocation: async (req, res) => {
        let user_id = req.decoded.user_id;
        if (!user_id) {
            return helpers.showOutput(res, helpers.showResponse(false, ControllerMessages.INVALID_USER), 403);
        }
        let result = await User.addlocation(req.body, user_id);
        return helpers.showOutput(res, result, result.code);
    },
    
    // address
    
    getAddress: async (req, res) => {
        let result = await User.getAddress(req.body);
        return helpers.showOutput(res, result, result.code);
    },
    
    //Passgrad
    
    ckeckPassgrade: async (req, res) => {
        let user_id = req.decoded.user_id;
        if (!user_id) {
            return helpers.showOutput(res, helpers.showResponse(false, ControllerMessages.INVALID_USER), 403);
        }
        let result = await User.ckeckPassgrade(req.body);
        return helpers.showOutput(res, result, result.code);
    },



}

module.exports = {...userController}