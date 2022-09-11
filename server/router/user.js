var express = require ('express');
var router = express.Router();
const userController =require('../controller/User');
var middleware = require("../controller/middleware");

// without token
router.post('/validate_email', userController.checkEmailExistance);
router.post('/register',userController.resgister);
router.post('/login',userController.login);
router.post('/get_all_users', userController.getAllUsers);
router.post('/get_user', userController.getUser);


// with Admin token
router.post('/update_user_by_admin', middleware.checkAdminToken, userController.updateUsers);

// with user token
router.post('/verify_otp', middleware.checkToken, userController.verifyOtp);
router.post('/addlocation', middleware.checkToken, userController.addlocation);
router.post('/ckeck_passing_grade', middleware.checkToken,userController.ckeckPassgrade);

// get locations
router.post('/get_address', userController.getAddress);


// Common Routes
router.get('*',(req, res) => {res.status(405).json({status:false, message:"Invalid Get Request"})});
router.post('*',(req, res) => {res.status(405).json({status:false, message:"Invalid Post Request"})});

module.exports =router