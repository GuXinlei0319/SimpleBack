const mongoose = require("mongoose")
const Schema = mongoose.Schema


// Create Schema
const ProfileSchema = new Schema({
  type:{ 
    type:String
  },
  describe:{
    type:String
  },
  income:{ // 收入
    type:String,
    required:true
  },
  expend:{ // 支出
    type:String,
    required:true
  },
  cash:{  // 现金
    type:String,
    required:true
  },
  remark:{ // 备注
    type:String
  },
  date:{ // 时间
    type:Date,
    default:Date.now
  }
})

module.exports = Profile = mongoose.model('profile',ProfileSchema) 