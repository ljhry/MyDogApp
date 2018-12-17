'use strict'

var mongoose = require('mongoose')
var uuid = require('uuid')
var User = mongoose.model('User')
var robot = require('../service/robot')

exports.signature = function *(next) {
  var body = this.request.body
  var cloud = body.cloud
  var token
  var key
  var data

  if (cloud === 'qiniu') {
    // key = uuid.v4() + '.jpeg'
    // token = robot.getQiniuToken(body)
    data = robot.getQiniuToken(body)
    token = data.token
    key = data.key
  }
  else {
    data = robot.getCloudinaryToken(body)
    token = data.token
    key = data.key
  }

  this.body = {
    success: true,
    data: {
      token:token,
      key:key
    }
  }
  
}

exports.hasBody = function *(next) {
  var body = this.request.body || {}

  if (Object.keys(body).length === 0) {
    this.body = {
      success: false,
      err: '是不是漏掉什么了'
    }

    return next
  }

  yield next
}

exports.hasToken = function *(next) {
  var accessToken = this.query.accessToken

  if (!accessToken) {
    accessToken = this.request.body.accessToken
  }

  if (!accessToken) {
    this.body = {
      success: false,
      err: 'accessToken钥匙丢了'
    }

    return next
  }

  var user = yield User.findOne({
    accessToken: accessToken
  })
  .exec()

  if (!user) {
    this.body = {
      success: false,
      err: '用户没登陆'
    }

    return next
  }

  this.session = this.session || {}
  this.session.user = user

  yield next
}


