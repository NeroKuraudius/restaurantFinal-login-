// 網址帶有'/'時進入

const express = require('express')
const router = express.Router()
const Restaurant = require('../../models/Restaurant.js')
const selectedValue = require('../../public/javascripts/selectedValue.js')
const sorter = require('../../public/javascripts/sorter')
const selected = require('../../public/javascripts/selectedValue')


//首頁渲染
router.get('/', (req, res) => {
  Restaurant.find()
    .lean()
    .sort({ _id: 'asc' }) //asc：正向排列(反向為desc)
    .then(restaurants => res.render('index', { restaurants }))
    .catch(error => console.log(error))
})


// 選擇排序方式
router.post('/', (req, res) => {
  const selection = req.body.sort ? req.body.sort : ''
  const sortBy = sorter(selection)
  const selectedValue = selected(selection)

  Restaurant.find()
    .lean()
    .collation({ locale: 'en' }) // 處理不同語言問題
    .sort(sortBy)
    .then(restaurants => res.render("index", { restaurants, selectedValue }))
})


// 設定搜尋結果渲染
router.get('/search', (req, res) => {
  const keyword = req.query.keyword.trim().toLowerCase()
  if (!keyword || !keyword.length) {
    return res.redirect('/')
  }
  Restaurant.find() // .find()中沒條件表示全部取出
    .lean() // 資料處理乾淨後再動作 ※非常重要
    .then(shops => { // shops：未篩選資料
      const shopsList = shops.filter(shop => shop.name.toLowerCase().includes(keyword) || shop.category.toLowerCase().includes(keyword))
      // shopsList：篩選後資料 、 shop：shops中取出篩選的單筆資料
      res.render('index', { restaurants: shopsList, keyword })
    })
    .catch(error => console.log(error))
})


module.exports = router