// 登录 注册
const express = require('express')
const router = express.Router()
const User = require('../../models/User')
const keys = require('../../config/keys')

// 加密插件
const bcrypt = require('bcrypt')
// 基于gravatar规范在Node.js中生成Gravatar URL的库
const gravatar = require('gravatar')
const jwt = require('jsonwebtoken')

// 路由请求返回json数据
// @access public
router.get("/test", (req, res) => {
    res.json({ msg: "login!!!" })
})
// 注册注册
router.post("/register", (req, res) => {
    console.log(req.body);
    // 查询数据库邮箱
    User.findOne({ email: req.body.email }).then((user) => {
        // 不存在user则注册
        if (user) {
            return res.status(400).json({ email: "邮箱已被使用！" })
        } else {
            var avatar = gravatar.url(req.body.email, {s: '200', r: 'pg', d: 'mm'});
            const newUser = new User({
                name: req.body.name,
                email: req.body.email,
                password: req.body.password,
                avatar

            })
            // 加密 生成salt和hash
            bcrypt.genSalt(10, function (err, salt) {
                bcrypt.hash(newUser.password, salt, function (err, hash) {
                    if (err) throw err
                    // Store hash in your password DB.
                    newUser.password = hash;
                    newUser.save()
                        .then(user => res.json(user))
                        .catch(err => console.log(err))
                });
                
            });
        }
    })

})
// 登录登录
router.post("/login", (req, res) => {
    console.log(req.body);
    const email = req.body.email
    const password = req.body.password
    // 查询数据库邮箱
    User.findOne({ email }).then((user) => {
        if (!user) {
            return res.status(400).json({ email: "用户不存在" })
        }
        // 进行密码匹配
        bcrypt.compare(password,user.password)
            .then(isMatch => {
                if (isMatch) {
                    // jwt：npm install jsonwebtoken
                    // jwt.sign('规则','加密名字','过期时间','函数')
                    const rule ={id: user.id,name:user.name}
                    jwt.sign(rule,keys.secret,{expiresIn:3600},(err,token) => {
                        if (err) throw err
                        res.json({
                            success: true,
                            token: 'test' +token
                        })
                    })
                    // res.json({msg:'success'})
                } else {
                    return res.status(400).json({password:"密码错误！"})
                }
            })
    })

})

module.exports = router
