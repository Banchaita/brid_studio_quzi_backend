const mongoose = require('mongoose');

var mongoDB = process.env.MONGO_URI;
mongoose.Promise = global.Promise;
mongoose.connect(mongoDB,{
    useNewUrlParser : true,
    useUnifiedTopology : true
});

var db = mongoose.connection;
db.once('open',()=>{
    console.log("connection estabished success");
})

