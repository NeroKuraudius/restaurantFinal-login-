const express = require('express')
const router = express.Router()

// 登入頁面
router.get('/login', (req, res) => { res.render('login') })

// 登入處理
router.post('/login',)

// 註冊頁面
router.get('/register', (req, res) => {res.render('register')})

// 註冊處理



module.exports = router