var multer = require('multer')
var path = require('path')
var moment = require('moment')


let storage = multer.diskStorage({
    destination: (req, file, cb) => {
        imagePath = ""
        switch(file.fieldname){
            case "question_file_audio":
                imagePath = path.join(__dirname, "/upload/question")
                break;
        }
        cb(null, imagePath)
    },
    filename: (req, file, cb) => {
        cb(null, `${moment().valueOf()}${path.extname(file.originalname)}`)
    }
       
})


const upload = multer({
    storage
})

module.exports= upload