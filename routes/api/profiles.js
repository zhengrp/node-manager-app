// 登录 注册
const express = require('express')
const router = express.Router()
const Profile = require('../../models/Profile')
const passport = require('passport')

// @ router GEt api/test
// @desc 路由请求返回json数据 
// @access public
router.get('/test', (req, res) => {
    res.json({ msg: "porfiles is working" })
})
// @ router POST api/profiles/test
// @desc create信息接口 
// @access Pr
router.post(
    '/add',
    passport.authenticate('jwt', { session: false }),
    (req, res) => {
        const profileFields = {};

        if (req.body.type) profileFields.type = req.body.type;
        if (req.body.describe) profileFields.describe = req.body.describe;
        if (req.body.income) profileFields.income = req.body.income;
        if (req.body.expend) profileFields.expend = req.body.expend;
        if (req.body.cash) profileFields.cash = req.body.cash;
        if (req.body.remark) profileFields.remark = req.body.remark;
        new Profile(profileFields).save().then(profile => {
            res.json(profile);
        });
    }
);
// @ router POST api/edit/:id
// @desc edit信息接口 
// @access Private
router.post(
    '/edit/:id',
    passport.authenticate('jwt', { session: false }),
    (req, res) => {
        const profileFields = {};

        if (req.body.type) profileFields.type = req.body.type;
        if (req.body.describe) profileFields.describe = req.body.describe;
        if (req.body.income) profileFields.income = req.body.income;
        if (req.body.expend) profileFields.expend = req.body.expend;
        if (req.body.cash) profileFields.cash = req.body.cash;
        if (req.body.remark) profileFields.remark = req.body.remark;
        Profile.findOneAndUpdate(
            { _id: req.params.id },
            { $set: profileFields},
            { new: true }
        ).then(profile => res.json(profile))
    }
);

//@route  GET api/profiles
// @desc   获取所有信息
// @access Private
router.get(
    '/',
    passport.authenticate('jwt', { session: false }), (req, res) => {
        Profile.find()//查询所有信息
            .then(profile => {
                if (!profile) {
                    return res.status(404).json('没有任何内容');
                }
                res.json(profile);
            })
            .catch(err => res.status(404).json(err));
    }
);

//@route  GET api/profiles/：id
// @desc   获取单个信息
// @access Private
router.get(
    '/:id',
    passport.authenticate('jwt', { session: false }),
    (req, res) => {
        Profile.findOne({ _id: req.params.id })
            .then(profile => {
                if (!profile) {
                    return res.status(404).json('没有任何内容');
                }

                res.json(profile);
            })
            .catch(err => res.status(404).json(err));
    }
);

//@route  GET api/profiles/：id
// @desc   删除单个信息
// @access Private
router.delete(
    '/delete/:id',
    passport.authenticate('jwt', { session: false }),
    (req, res) => {
        Profile.findOneAndRemove({ _id: req.params.id })
            .then(profile => {
                profile.save().then(profile => res.json(profile))
            })
            .catch(err => res.status(404).json(err));
    }
);
module.exports = router