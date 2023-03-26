const bcrypt = require('bcryptjs')
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const mongoose = require('mongoose')
const User = require('../User')
const Restaurant = require('../Restaurant.js')
const restaurantList = require('../../restaurant.json').results
const SEED_USER = {
  user1: {
    email: 'user1@example.com',
    password: '12345678'
  },
  user2: {
    email: 'user2@example.com',
    password: '12345678'
  }
}

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })

const db = mongoose.connection
db.on('error', () => {
  console.log('mongodb error!')
})


db.once('open', () => {
  bcrypt.genSalt(10)
    .then(salt => bcrypt.hash(SEED_USER.user1.password, salt))
    .then(hash => User.create({
      email: SEED_USER.user1.email,
      password: hash
    }))
    .then(user => {
      const userId = user._id
      return Promise.all(Array.from(
        { length: 3 },
        (_, i) => Restaurant.create({
          name: restaurantList[`${i}`].name,
          name_en: restaurantList[`${i}`].name_en,
          category: restaurantList[`${i}`].category,
          image: restaurantList[`${i}`].image,
          location: restaurantList[`${i}`].location,
          phone: restaurantList[`${i}`].phone,
          google_map: restaurantList[`${i}`].google_map,
          rating: restaurantList[`${i}`].rating,
          description: restaurantList[`${i}`].description,
          userId
        })
      ))
    })

  bcrypt.genSalt(10)
    .then(salt => bcrypt.hash(SEED_USER.user2.password, salt))
    .then(hash => User.create({
      email: SEED_USER.user2.email,
      password: hash
    }))
    .then(user => {
      const userId = user._id
      return Promise.all(Array.from(
        { length: 3 },
        (_, i) => Restaurant.create({
          name: restaurantList[`${i + 3}`].name,
          name_en: restaurantList[`${i + 3}`].name_en,
          category: restaurantList[`${i + 3}`].category,
          image: restaurantList[`${i + 3}`].image,
          location: restaurantList[`${i + 3}`].location,
          phone: restaurantList[`${i + 3}`].phone,
          google_map: restaurantList[`${i + 3}`].google_map,
          rating: restaurantList[`${i + 3}`].rating,
          description: restaurantList[`${i + 3}`].description,
          userId
        })
      ))
    })
    .then(() => {
      console.log('Succeed in connecting.')
      db.close()
      process.exit()
    })
    .catch(error => console.log(error))
})
