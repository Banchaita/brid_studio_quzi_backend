require('dotenv').config({path:__dirname+"/.env"})
require('./server/connections')
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser'); 
const cors=require('cors')


const app = express()
app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json())

app.use(cors())

app.get('/', (req,res) => {
    res.sendFile(__dirname+'/server/views/index.html')
})
app.use('/files', express.static(__dirname + '/server/services/upload/question'));


const administration = require('./server/router/admin')
const user = require('./server/router/user')
const question = require('./server/router/question')


app.use(process.env.api_v1 + "administration", administration);
app.use(process.env.api_v1+'user',user)
app.use(process.env.api_v1+'question',question)


// app.use(process.env['API_V1']+'admin',admin)

const port = process.env.port ||4000 
app.listen(port,()=>{
    console.log('server is running',+port);
})