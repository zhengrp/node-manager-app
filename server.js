const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser') 
const passport = require('passport')

const app =express()
// 映入路由
const users = require('./routes/api/user')

// 映入数据库配置
const db = require('./config/keys')
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

// routes
app.use('/api/users',users)

const port = process.env.PORT || 5000

app.listen(port ,()=>{
    console.log(`running on port ${port}`);
    
})