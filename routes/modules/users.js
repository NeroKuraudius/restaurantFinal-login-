const express = require('express')
const router = express.Router()
const User = require('../../models/User')

// 登入頁面
router.get('/login', (req, res) => { res.render('login') })

// 登入處理
router.post('/login',)

// 註冊頁面
router.get('/register', (req, res) => { res.render('register') })

// 註冊處理
router.post('/register', (req, res) => {
  const { name, email, password, confirmPassword } = req.body

  User.findOne({ email })
    .then((user) => {
      if (user) { res.render('register', { name, email, password, confirmPassword }) }
      else {
        const newUser = new User({ name, email, password })
        newUser.save()
          .then(() => res.redirect('/'))
          .catch(err => console.log(err))
      }
    })
    .catch(err => console.log(err))
})


module.exports = router