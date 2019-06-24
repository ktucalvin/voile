'use strict'
require('dotenv').config()
const https = require('https')
const Koa = require('koa')
const serve = require('koa-static')
const mount = require('koa-mount')
const send = require('koa-send')
const routes = require('./lib/routes')
const app = new Koa()
const certopts = {
  key: process.env.SSL_KEY,
  cert: process.env.SSL_CERT
}

app.use(routes)

app.use(serve('./dist'))

app.use(mount('/g', serve(process.env.ARCHIVE_DIR)))

app.use(async ctx => {
  if (ctx.path.endsWith('bundle.js')) {
    await send(ctx, 'dist/bundle.js')
  } else if (ctx.path.endsWith('main.css')) {
    await send(ctx, 'dist/main.css')
  } else {
    await send(ctx, 'dist/index.html')
  }
})

https.createServer(certopts, app.callback())
  .listen(443, () => console.log('Server running at https://localhost/#/'))
