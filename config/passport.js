const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy

module.exports = app =>{

  // 初始化passport模組
  app.use(passport.initialize())
  app.use(passport.session())

  // 設定本地登入策略


  // 設定序列化與反序列化
}