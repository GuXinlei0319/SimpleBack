 // @login & register
const express = require('express') 
const router = express.Router()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const passport = require('passport')

const User = require('../../models/User')
const keys = require('../../config/keys')

// $route GET api/users/test
// @desc 返回1请求的json数据
// @access public
router.get('/test',(req,res) => {
  res.json({mag:'login works'})
})


// $route  POST api/users/register
// @desc   返回的请求的json数据
// @access public
router.post('/register',(req,res) => {
  // console.log(req.body)
  // res.send({mes:'123'})

  // 查询数据库中是否拥有邮箱
  User.findOne({email:req.body.email})
      .then((user) => {
        if(user){  // 400 请求失败的状态码
          return res.status(400).json('邮箱已被注册')
        }else{
          const newUser = new User({
            name:req.body.name,
            email:req.body.email,
            //avatar:avatar,
            password:req.body.password,  // 密码加密bcrpt
            identity:req.body.identity
          })
          bcrypt.genSalt(10, function(err, salt) {
            bcrypt.hash(newUser.password, salt, (err, hash) => {
                // Store hash in your password DB.
                if(err) throw err
                newUser.password = hash
                newUser.save() // 存储方法
                       .then(user => res.json(user))
                       .catch(err => console.log(err))
            })
          })
        }
      })
})

// $route  POST api/users/login
// @desc   返回token --json web token -jwt -passport
// @access public
router.post('/login',(req,res) => {
  const email = req.body.email
  const password = req.body.password
  // 查询数据库
  User.findOne({email})
      .then(user => {
        if(!user){
          return res.status(404).json('用户不存在')
        }
        // 密码匹配
        bcrypt.compare(password, user.password) //得到返回结果布尔值
              .then(isMatch => { 
                if(isMatch){
                  //jwt.sign('规则'，‘加密名字，'过期时间，箭头函数)
                  // 钥匙令牌，根据token请求数据，没有或者过期拿不到
                  const rule = {
                    id:user.id,
                    name:user.name,
                    avatar:user.avatar,
                    identity:user.identity
                  }
                  jwt.sign(rule,keys.secretOrKey,{expiresIn:3600},(err,token) => {
                    if(err) throw err
                    res.json({
                      success:true,
                      token:'Bearer '+token
                    })
                  })
                  //res.json({msg:"登录成功"}) //返回token
                }else{
                  return res.status(400).json('密码错误')
                }
              })
              .catch()
      })
})

// $route  GET api/users/current 用户请求信息
// @desc   return current user 验证token 返回用户信息 passport-jwt / passport-jwt passport
// @access Private 
router.get(
    '/current',
    passport.authenticate('jwt',{session:false}
  ),(req,res) => {
  //res.json({msg:'success'})
  res.json({
    id:req.user.id,
    name:req.user.name,
    email:req.user.email,
    identity:req.user.identity
  })
})

module.exports = router
