const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser') 
const passport = require('passport')
const path = require("path")


const app =express()
// 映入路由
const users = require('./routes/api/user')
const profiles = require('./routes/api/profiles.js')

// 映入数据库配置
const db = require('./config/keys_prod')
// 使用中间件body-parser
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())

// 连接 momgodb
mongoose.connect(db.mongoURI,{ useNewUrlParser: true })
.then(()=>{
    console.log('momgodb已连接');
    
}).catch(err => console.log(err))
// passport 初始化
app.use(passport.initialize())
require('./config/passport')(passport)

// app.get('/',(req,res) => {
//     res.send("hello")
// })

// 使用routes
app.use('/api/users',users)
app.use('/api/profiles',profiles)

// 执行前端静态页面
if(process.env.NODE_ENV == "production") {
    app.use(express.static("client/dist"));
    app.get("*",(req,res) => {
        res.sendFile(path.resolve(__dirname,"client","dist","index.html"))
    })
}

const port = process.env.PORT || 5000

app.listen(port ,()=>{
    console.log(`running on port ${port}`);
    
})