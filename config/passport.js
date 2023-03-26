const passport = require('passport')
const bcrypt = require('bcryptjs')
const User = require('../models/User')
const LocalStrategy = require('passport-local').Strategy
const FBStrategy = require('passport-facebook').Strategy

module.exports = app => {

  // 初始化passport模組
  app.use(passport.initialize())
  app.use(passport.session())

  // 設定本地登入策略
  passport.use(new LocalStrategy({ usernameField: 'email', passReqToCallback: true }, (req, email, password, done) => {
    User.findOne({ email })
      .then(user => {
        if (!user) {
          return done(null, false, req.flash('warning_msg', 'This email did not register yet.'))
        }
        return bcrypt.compare(password, user.password)  // bcrypt.compare 的回傳值為true/flase
          .then(isMatch => {
            if (!isMatch) {
              return done(null, false, req.flash('warning_msg', 'Email or  password is incorrect!'))
            }
            return done(null, user)
          })
      })
      .catch(err => console.log(err))
  }))

  // 設定FB登入策略
  passport.use(new FBStrategy({
    clientID: process.env.FB_ID,
    clientSecret: process.env.FB_SECRET,
    callbackURL: process.env.FB_CALLBACK,
    profileFields: ['email', 'displayName'],
  }, (accessToken, refreshToken, profile, done) => {
    const { name, email } = profile._json
    User.findOne({ email })
      .then(user => {
        if (user) return (null, user)
        const randomPassword = Math.random().toString(36).slice(-10)
        bcrypt.genSalt(10)
          .then(salt => bcrypt.hash(randomPassword, salt))
          .then(hash => User.create({
            name, email, password: hash
          }))
          .then(user => done(null, user))
          .catch(err => done(err, false))
      })
  }))

  // 設定序列化與反序列化
  passport.serializeUser((user, done) => {
    done(null, user._id)
  })
  passport.deserializeUser((id, done) => {
    User.findById(id)
      .lean()
      .then(user => done(null, user))
      .catch(err => done(err, null)) //第二個null可省略
  })
}