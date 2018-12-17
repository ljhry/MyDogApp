'use strict'

var xss = require('xss')
var mongoose = require('mongoose')
var User = mongoose.model('User')
var uuid = require('uuid')
var sms = require('../service/sms')


exports.signup = function *(next) {
  var phoneNumber = this.request.body.phoneNumber
  // var phoneNumber = this.query.phoneNumber
  console.log('📞 ',phoneNumber)
  var user = yield User.findOne({
    phoneNumber: phoneNumber
  }).exec()

  var verifyCode = sms.getCode()

  if (!user) {
    var accessToken = uuid.v4()

    user = new User({
      nickname: '小狗宝',
      avatar: 'http://miao.su/images/2018/11/01/c15ba154aaaed3a237f84.png',
      phoneNumber: xss(phoneNumber),
      verifyCode: verifyCode,
      accessToken: accessToken
    })
  }
  else {
    user.verifyCode = verifyCode
    // user.verifyCode = '1232'
  }

  try {
    user = yield user.save()
  }
  catch (e) {
    this.body = {
      success: false
    }

    return next
  }

  var msg = '您的注册验证码是：' + user.verifyCode

  try {
    sms.send(user.phoneNumber, msg)
  }
  catch (e) {
    console.log(e)

    this.body = {
      success: false,
      err: '短信服务异常'
    }

    return next
  }

  this.body = {
    success: true
  }
}

exports.verify = function *(next) {
  var verifyCode = this.request.body.verifyCode
  var phoneNumber = this.request.body.phoneNumber

  if (!verifyCode || !phoneNumber) {
    this.body = {
      success: false,
      err: '验证没通过'
    }

    return next
  }

  var user = yield User.findOne({
    phoneNumber: phoneNumber,
    verifyCode: verifyCode
  }).exec()

  if (user) {
    user.verified = true
    user = yield user.save()

    this.body = {
      success: true,
      data: {
        nickname: user.nickname,
        accessToken: user.accessToken,
        avatar: user.avatar,
        _id: user._id
      }
    }
  }
  else {
    this.body = {
      success: false,
      err: '验证码不正确'
    }
  }
}

exports.update = function *(next) {
  var body = this.request.body
  var user = this.session.user
  var accessToken = body.accessToken
  var fields = 'avatar,gender,age,nickname,breed'.split(',')

  var user = yield User.findOne({
    accessToken: accessToken
  }).exec()

  if(!user){
    this.body = {
      success:false,
      err:'用户不见了'
    }
    return next
  }
  
  fields.forEach(function(field) {
    if (body[field]) {
      user[field] = xss(body[field])
    }
  })

  user = yield user.save()

  this.body = {
    success: true,
    data: {
      nickname: user.nickname,
      accessToken: user.accessToken,
      avatar: user.avatar,
      age: user.age,
      breed: user.breed,
      gender: user.gender,
      _id: user._id
    }
  }
}

