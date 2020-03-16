'use strict'
require('dotenv').config()
const https = require('https')
const Koa = require('koa')
const serve = require('koa-static')
const mount = require('koa-mount')
const conditional = require('koa-conditional-get')
const etag = require('koa-etag')
const compress = require('koa-compress')
const compressible = require('compressible')
const helmet = require('koa-helmet')
const { getRoutes } = require('./routes')
const { initDatabase } = require('./lib/db')
const staticOpts = require('./lib/static-options')
const noExposeErrors = require('./lib/no-expose-errors')
const serveIndexFallback = require('./lib/serve-index-fallback')
const app = new Koa()
const certopts = {
  key: process.env.SSL_KEY,
  cert: process.env.SSL_CERT
}

const dbOpts = {
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME
}

let url

async function setupMiddleware () {
  const routes = await getRoutes()
  app.use(helmet())

  app.use(noExposeErrors())

  app.use(conditional())

  app.use(etag())

  app.use(compress({
    filter: type => !(/event-stream/i.test(type)) && compressible(type)
  }))

  app.use(routes)

  app.use(mount('/i', serve(process.env.ARCHIVE_DIR, staticOpts)))

  if (process.env.NODE_ENV === 'development') {
    url = 'https://localhost:3000'
  } else {
    url = 'https://localhost/#/'
    app.use(serve('./dist', staticOpts))
  }

  app.use(serveIndexFallback())
}

initDatabase(dbOpts)
  .then(setupMiddleware)
  .then(() => {
    https.createServer(certopts, app.callback())
      .listen(443, () => console.log(`Server running at ${url}`))
  })
