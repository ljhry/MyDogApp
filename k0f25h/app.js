'use strict'

var fs = require('fs')
var path = require('path')
var mongoose = require('mongoose')
var db = 'mongodb://localhost/imooc-app'

mongoose.Promise = require('bluebird')
mongoose.connect(db)

var models_path = path.join(__dirname, '/app/models')

var walk = function(modelPath) {
  fs
    .readdirSync(modelPath)
    .forEach(function(file) {
      var filePath = path.join(modelPath, '/' + file)
      var stat = fs.statSync(filePath)

      if (stat.isFile()) {
        if (/(.*)\.(js|coffee)/.test(file)) {
          require(filePath)
        }
      }
      //是否文件夹
      else if (stat.isDirectory()) {
        walk(filePath)
      }
    })
}

walk(models_path)

var koa = require('koa')
var logger = require('koa-logger')
var session = require('koa-session')
//解析post路径
var bodyParser = require('koa-bodyparser')
var app = koa()

app.keys = ['imooc']
app.use(logger())
app.use(session(app))
app.use(bodyParser())

var router = require('./config/routes')()

app
  .use(router.routes())
  .use(router.allowedMethods())

app.listen(1234,'192.168.137.1')
console.log('Listening: 1234')
