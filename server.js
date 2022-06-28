const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const passport = require('passport')
const app = express()

// 引入users.js
const users = require('./routes/api/users')
const profiles = require('./routes/api/profiles')
// DB config
const db = require('./config/keys').mongoURI

// 使用body-parser 中间件
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())


// Connect to mongodb
mongoose.connect(db)
        .then( ()=>{ console.log('MongoDB Connect') })
        .catch( err => { console.log(err) })
        
// passport初始化
app.use(passport.initialize()) 
// 配置passport 传递passport
require('./config/passport')(passport)


// test
// app.get('/',(req,res) => {
//   res.send('Hello World !')
// })

// 使用routes
app.use('/api/users',users)
app.use('/api/profiles',profiles)




const port = process.env.PORT || 5000;
const hostname = process.env.HOST || '0.0.0.0';
app.listen(port,hostname,() => {
  console.log(`Server running on port ${hostname}:${port}`)
})
