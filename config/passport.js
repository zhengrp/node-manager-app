// 使用JSON Web token进行身份验证的策略。
const JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt;
const mongoose = require('mongoose')
const User = mongoose.model("users")
const keys = require('./keys')
var opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = 'secret';

module.exports = passport => {
    passport.use(new JwtStrategy(opts, (jwt_payload, done) => {
        // console.log(jwt_payload) //验证token通过后返回的 id name iat exp
        User.findById(jwt_payload.id).then( user => {
            if (user) {
                return done(null,user)
            }
            return done(null,false)
        }).catch(err => console.log(err))
    }));
}