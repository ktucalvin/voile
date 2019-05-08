'use strict'
require('dotenv').config()
const https = require('https')
const Koa = require('koa')
const serve = require('koa-static')
const mount = require('koa-mount')
const routes = require('./lib/routes')
const app = new Koa()
const certopts = {
  key: process.env.SSL_KEY,
  cert: process.env.SSL_CERT
}

app.use(routes)

app.use(serve('./dist'))

app.use(mount('/g', serve('galleries')))

https.createServer(certopts, app.callback())
  .listen(443, () => console.log('Server running at https://localhost/#/'))
