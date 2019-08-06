'use strict'
require('dotenv').config()
const https = require('https')
const Koa = require('koa')
const serve = require('koa-static')
const mount = require('koa-mount')
const send = require('koa-send')
const conditional = require('koa-conditional-get')
const etag = require('koa-etag')
const routes = require('./routes')
const app = new Koa()
const certopts = {
  key: process.env.SSL_KEY,
  cert: process.env.SSL_CERT
}
const staticOpts = { maxage: 31536000000 } // 1 year

app.use(conditional())
app.use(etag())

app.use(routes)

app.use(serve('./dist', staticOpts))

app.use(mount('/g', serve(process.env.ARCHIVE_DIR, staticOpts)))

if (process.env.NODE_ENV === 'development') {
  ;(async () => {
    const path = require('path')
    const koaWebpack = require('koa-webpack')
    const config = require('./webpack.dev.js')
    const middleware = await koaWebpack({ config })
    app.use(middleware)
    app.use(async (ctx) => {
      const filename = path.resolve(config.output.path, 'index.html')
      ctx.response.type = 'html'
      ctx.response.body = middleware.devMiddleware.fileSystem.createReadStream(filename)
    })
  })()
} else {
  app.use(async ctx => {
    if (ctx.accepts('html')) {
      await send(ctx, 'dist/index.html')
    }
  })
}

https.createServer(certopts, app.callback())
  .listen(443, () => console.log('Server running at https://localhost/#/'))
