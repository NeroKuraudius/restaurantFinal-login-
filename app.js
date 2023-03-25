const express = require('express')
const exphbs = require('express-handlebars')
const methodOverrid = require('method-override')
const session = require('express-session')
const usePassport = require('./config/passport')
const routes = require('./routes') //引入./routes後會自動抓取該目錄下名為index的檔案
require('./config/mongoose')

const app = express()
const port = 3000


// 設定固定樣板
app.engine('hbs', exphbs({ defaultLayout: 'main', extname: '.hbs' }))
app.set('view engine', 'hbs')

// 設定靜態資料來源
app.use(express.static('public'))

// 設定body-parser
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

// 設定每筆路由都會先經由method-override進行前處理
app.use(methodOverrid('_method'))

// 設定session
app.use(session({
  secret: 'ThisIsMySecret',
  resave: false,
  saveUninitialized: true
}))

// 載入passport設定檔(必須在express-session之後)
usePassport(app)

// 新增res.locals變數


app.use(routes)


app.listen(port, () => {
  console.log(`Express is listening on http://localhost:${port}`)
})