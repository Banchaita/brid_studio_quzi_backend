var express = require ('express');
var router = express.Router();
const questionContraller =require('../controller/Question');
var middleware = require("../controller/middleware");

// add gaming question using admin token
router.post('/add_question' ,middleware.checkAdminToken ,questionContraller.addQuestion);
router.post('/update_question',middleware.checkAdminToken,questionContraller.updateQuestion);
router.post('/add_answer',middleware.checkAdminToken,questionContraller.AddAnswer);
router.post('/add_correctanswer',middleware.checkAdminToken,questionContraller.AddcorrectAnswer);


//useing user token 
router.post('/get_all_question',middleware.checkToken ,questionContraller.getAllQuestion);
router.post('/get_question_by_level',middleware.checkToken,questionContraller.getQuestionByLevel);
router.post('/check_correct_answer',middleware.checkToken,questionContraller.checkCrrectAnswer);




module.exports =router