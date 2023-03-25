// 網址帶有'/restaurants'時進入

const express = require('express')
const router = express.Router()
const Restaurant = require('../../models/Restaurant')


// 新增頁面
router.get('/new', (req, res) => { res.render('new') })

// 新增餐廳資料
router.post('/', (req, res) => {
  const name = req.body.name
  const name_en = req.body.name_en
  const category = req.body.category
  const image = req.body.image
  const location = req.body.location
  const phone = req.body.phone
  const google_map = req.body.google_map
  const rating = req.body.rating
  const description = req.body.description
  const userId = req.user._id

  Restaurant.create({ name, name_en, category, image, location, phone, google_map, rating, description, userId })
    .then(() => res.redirect('/'))
    .catch(err => console.log(err))
})

// 刪除餐廳資料
router.delete('/:id', (req, res) => {
  const _id = req.params.id
  const userId = req.user._id
  return Restaurant.findOne({ _id, userId })
    .then(restaurant => restaurant.remove())
    .then(res.redirect('/'))
    .catch(error => console.log(error))
})

// 餐廳詳細資料渲染
router.get('/:id', (req, res) => {
  const _id = req.params.id
  const userId = req.user._id
  return Restaurant.findOne({ _id, userId })
    .lean() // 把資料整理乾淨(非常重要)
    .then(restaurant => res.render('show', { restaurant }))
    .catch(error => console.log(error))
})

// 修改資料頁面
router.get('/:id/edit', (req, res) => {
  const _id = req.params.id
  const userId = req.user._id
  return Restaurant.findOne({ _id, userId })
    .lean()
    .then(restaurant => res.render('edit', { restaurant }))
    .catch(error => console.log(error))
})

// 修改資料
router.put('/:id', (req, res) => {
  const _id = req.params.id
  const userId = req.user._id
  const restaurantData = req.body
  return Restaurant.findOne({ _id, userId })
    // 以id搜尋出的資料存為restaurantData後，再以.save()儲存
    .then(restaurant => {
      restaurant.name = restaurantData.name
      restaurant.name_en = restaurantData.name_en
      restaurant.category = restaurantData.category
      restaurant.image = restaurantData.image
      restaurant.location = restaurantData.location
      restaurant.phone = restaurantData.phone
      restaurant.google_map = restaurantData.google_map
      restaurant.rating = Number(restaurantData.rating)
      restaurant.description = restaurantData.description
      return restaurant.save()
    })
    .then(() => res.redirect(`/restaurants/${_id}`))
    .catch(error => console.log(error))
})

module.exports = router