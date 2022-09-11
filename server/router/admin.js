var express = require ('express');
var router = express.Router();
const adminController =require('../controller/Admin');
var middleware = require("../controller/middleware");

// without token
router.post('/register',adminController.register);
router.post('/login',adminController.login);

// with token
router.post('/update_admin', middleware.checkAdminToken ,adminController.updateAdmin);
router.post('/change_password', middleware.checkAdminToken ,adminController.updatePasswordAdmin);
router.post('/get', middleware.checkAdminToken ,adminController.getAdmin);
router.post('/add_passing_grade', middleware.checkAdminToken,adminController.addPassingGrade);

//add gaming level using admin token
router.post('/add_level', middleware.checkAdminToken ,adminController.addLevel);
router.post('/get_all_level',middleware.checkToken,adminController.getAllLevel)
router.post('/get_level_by_id', middleware.checkToken, adminController.geLevelById);
router.post('/level_update', middleware.checkAdminToken,adminController.updateLevel);


// add gaming question using admin token
// router.post('/add_question', middleware.checkAdminToken ,adminController.addQuestion);


module.exports =router