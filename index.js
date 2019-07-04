'use strict'
require('dotenv').config()
const https = require('https')
const Koa = require('koa')
const serve = require('koa-static')
const mount = require('koa-mount')
const send = require('koa-send')
const conditional = require('koa-conditional-get')
const etag = require('koa-etag')
const routes = require('./lib/routes')
const app = new Koa()
const certopts = {
  key: process.env.SSL_KEY,
  cert: process.env.SSL_CERT
}
const staticOpts = { maxage: 86400000 } // 1 day

app.use(conditional())
app.use(etag())

app.use(routes)

app.use(serve('./dist', staticOpts))

app.use(mount('/g', serve(process.env.ARCHIVE_DIR, staticOpts)))

app.use(async ctx => {
  if (ctx.path.endsWith('bundle.js')) {
    await send(ctx, 'dist/bundle.js', staticOpts)
  } else if (ctx.path.endsWith('main.css')) {
    await send(ctx, 'dist/main.css', staticOpts)
  } else if (ctx.path === '/favicon.ico') {
    ctx.status = 404
  } else {
    await send(ctx, 'dist/index.html', staticOpts)
  }
})

https.createServer(certopts, app.callback())
  .listen(443, () => console.log('Server running at https://localhost/#/'))
