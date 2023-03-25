const passport = require('passport')
const User = require('../models/User')
const LocalStrategy = require('passport-local').Strategy

module.exports = app => {

  // 初始化passport模組
  app.use(passport.initialize())
  app.use(passport.session())

  // 設定本地登入策略
  passport.use(new LocalStrategy({ usernameField: 'email', passReqToCallback: true }, (req,email, password, done) => {
    User.findOne({ email })
      .then(user => {
        if (!user) {
          return done(null, false, req.flash('warning_msg', 'This email did not register yet.'))
        }
        if (password !== user.password) {
          return done(null, false, req.flash('warning_msg', 'Email or  password is incorrect!'))
        }
        return done(null, user)
      })
      .catch(err => console.log(err))
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