// 登录 注册
const express = require('express')
const router = express.Router()
const User = require('../../models/User')
const keys = require('../../config/keys')
const passport = require('passport')
// 加密插件
const bcrypt = require('bcrypt')
// 基于gravatar规范在Node.js中生成全球公认头像 URL的库
const gravatar = require('gravatar')
const jwt = require('jsonwebtoken')

// 路由请求返回json数据
// @access public
// router.get("/test", (req, res) => {
//     res.json({ msg: "login!!!" })
// })
// 注册注册
// POST api/users/register
router.post("/register", (req, res) => {
    console.log(req.body);
    // 查询数据库邮箱
    User.findOne({ email: req.body.email }).then((user) => {
        // 不存在user则注册
        if (user) {
            return res.status(400).json("邮箱已被使用")
        } else {
            var avatar = gravatar.url(req.body.email, { s: '200', r: 'pg', d: 'mm' });
            const newUser = new User({
                name: req.body.name,
                email: req.body.email,
                password: req.body.password,
                identity: req.body.identity,
                avatar

            })
            // 加密 生成salt和hash
            bcrypt.genSalt(10, function (err, salt) {
                bcrypt.hash(newUser.password, salt, function (err, hash) {
                    if (err) throw err
                    // Store hash in your password DB.
                    newUser.password = hash
                    newUser.save()
                        .then(user => res.json(user))
                        .catch(err => console.log(err))
                });

            });
        }
    })

})
// 登录登录
// POST api/users/login
router.post("/login", (req, res) => {
    console.log(req.body);
    const email = req.body.email
    const password = req.body.password
    // 查询数据库邮箱
    User.findOne({ email }).then((user) => {
        if (!user) {
            return res.status(400).json("用户不存在" )
        }
        // 使用加密插件bcrypt进行密码匹配
        bcrypt.compare(password, user.password)
            .then(isMatch => {
                if (isMatch) {//验证密码，获取token
                    // jwt：npm install jsonwebtoken
                    // jwt.sign('规则（对象）','加密名字（‘secret’）','过期时间（对象expiresIn:time）','函数')
                    const rule = { 
                        id: user.id, 
                        name: user.name,
                        avatar:user.avatar,
                        identity:user.identity
                    }
                    jwt.sign(rule, keys.secretOrKey, { expiresIn: 36000 }, (err, token) => {
                        if (err) throw err
                        res.json({
                            success: true,
                            token: 'Bearer ' + token
                        })
                    })
                    // res.json({msg:'success'})
                } else {
                    return res.status(400).json("密码错误！" )
                }
            })
    })

})
//$router GET api/users/current
// @desc y验证token return current user
// @access Private
router.get("/current", passport.authenticate('jwt', { session: false }), (req, res) => {
    res.json({
        id: req.user.id,
        name: req.user.name,
        email: req.user.email,
        identity:req.user.identity
    })
})

module.exports = router
