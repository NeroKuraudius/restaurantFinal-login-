// 該檔案為總路由器

const express = require('express')
const router = express.Router()
const { authenticator } = require('../middleware/auth')

const home = require('./modules/home')
const restaurants = require('./modules/restaurants')
const users = require('./modules/users')
const auth = require('./modules/auth')

router.use('/users',  users)
router.use('/restaurants', authenticator, restaurants)
router.use('/auth',auth)
router.use('/', authenticator,home)

module.exports = router