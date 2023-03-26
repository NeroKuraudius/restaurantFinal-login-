const bcrypt = require('bcryptjs')
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const mongoose = require('mongoose')
const User = require('../User')
const Restaurant = require('../Restaurant.js')
const restaurantList = require('../../restaurant.json').results
const SEED_USER = {
  name: 'test',
  email: 'test@gmail.com',
  password: 'test'
}

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })

const db = mongoose.connection
db.on('error', () => {
  console.log('mongodb error!')
})

db.once('open', () => {
  bcrypt.genSalt(10)
    .then(salt => bcrypt.hash(SEED_USER.password, salt))
    .then(hash => User.create({
      name: SEED_USER.name,
      email: SEED_USER.email,
      password: hash
    }))
    .then(user => {
      const userId = user._id
      return Promise.all(Array.from(
        { length: restaurantList.length },
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
    .then(() => {
      console.log('Succeed in connecting.')
      db.close()
      process.exit()
    })
    .catch(error => console.log(error))
})