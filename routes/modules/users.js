const express = require('express')
const router = express.Router()
const User = require('../../models/User')
const passport = require('passport')

// 登入頁面
router.get('/login', (req, res) => { res.render('login') })

// 登入處理
router.post('/login', passport.authenticate('local', { successRedirect: '/', failureRedirect: '/users/login',failureFlash:true }))

// 註冊頁面
router.get('/register', (req, res) => { res.render('register') })

// 註冊處理
router.post('/register', (req, res) => {
  const { name, email, password, confirmPassword } = req.body
  const errors = []
  
  if (!name||!email||!password||!confirmPassword){
    errors.push({message:'All of the blanks is required.'})
  }

  if (password !== confirmPassword){
    errors.push({message:'The password is different.'})
  }

  if (errors.length){
    return res.render('register',{errors,name,email,password,confirmPassword})
  }

  User.findOne({ email })
    .then((user) => {
      if (user) { 
        errors.push({message:'This email had been registered.'})
        return res.render('register', { errors,name, email, password, confirmPassword }) 
      }
      const newUser = new User({ name, email, password })
      return newUser.save()
        .then(() => res.redirect('/'))
        .catch(err => console.log(err))
      })
    .catch(err => console.log(err))
})

// 登出
router.get('/logout', (req, res) => {
  req.logout((err) => {
    if (err) { return next(err) }
  })
  req.flssh('success_msg', 'You are logout now')
  res.redirect('/users/login')
})

module.exports = router