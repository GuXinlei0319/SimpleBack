const JwtStrategy = require('passport-jwt').Strategy,
      ExtractJwt = require('passport-jwt').ExtractJwt;
const mongoose = require('mongoose')
const User = mongoose.model('users')
const keys = require('../config/keys')

const opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = keys.secretOrKey;

module.exports = passport => {
  passport.use(new JwtStrategy(opts, (jwt_payload, done) => {
    //console.log(jwt_payload)
    // {
    //   id: '61ee8c6e385291b8321499d9',
    //   name: 'guxinlei',
    //   iat: 1643037503,
    //   exp: 1643041103
    // }
    User.findById(jwt_payload.id)
        .then(user => {
          if(user){
            return done(null,user)
          }
          return done(null,false)
        })
        .catch(err => console.log(err))
  }))
}