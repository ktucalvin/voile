import 'dotenv/config'
import 'module-alias/register'
import 'reflect-metadata'
import https from 'https'
import Koa from 'koa'
import serve from 'koa-static'
import mount from 'koa-mount'
import helmet from 'koa-helmet'
import conditional from 'koa-conditional-get'
import etag from 'koa-etag'
import compress from 'koa-compress'
import compressible from 'compressible'
import morgan from 'morgan'
import { createConnection } from 'typeorm'
import { getRoutes } from './controllers'
import staticOpts from './lib/static-options'
import { noExposeErrors } from './lib/no-expose-errors'
import { serveIndexFallback } from './lib/serve-index-fallback'

const app = new Koa()
const certopts = {
  key: process.env.SSL_KEY,
  cert: process.env.SSL_CERT
}

let url: string
let serverStart: number

async function initDatabase () {
  console.log('Creating database connections...')
  serverStart = Date.now()
  await createConnection()
  console.log('Finished connecting to database')
}

async function setupMiddleware () {
  const logger = morgan('common')
  const routes = await getRoutes()
  app.use(async (ctx, next) => {
    logger(ctx.req, ctx.res, () => {})
    await next()
  })

  app.use(
    helmet.contentSecurityPolicy({
      directives: {
        defaultSrc: ["'self'"],
        baseUri: ["'self'"],
        fontSrc: ["'self'", 'https:', 'data:'],
        frameAncestors: ["'self'"],
        imgSrc: ["'self'", 'data:'],
        objectSrc: ['none'],
        scriptSrc: [
          "'self'",
          'https://unpkg.com/react@17/umd/react.production.min.js',
          'https://unpkg.com/react-dom@17/umd/react-dom.production.min.js',
          'https://unpkg.com/react-router-dom/umd/react-router-dom.min.js'
        ],
        styleSrc: ["'self'", 'https:', 'unsafe-inline']
      }
    })
  )

  app.use(helmet({ contentSecurityPolicy: false }))

  app.use(noExposeErrors())

  app.use(conditional())

  app.use(etag())

  app.use(compress({
    filter: type => !(/event-stream/i.test(type)) && !!compressible(type)
  }))

  app.use(routes)

  app.use(mount('/i', serve(process.env.ARCHIVE_DIR, staticOpts)))

  if (process.env.NODE_ENV === 'development') {
    url = 'https://localhost:3000'
  } else {
    url = 'https://localhost/#/'
    app.use(serve('./dist/client', staticOpts))
  }

  app.use(serveIndexFallback())
}

initDatabase()
  .then(setupMiddleware)
  .then(() => {
    https.createServer(certopts, app.callback())
      .listen(443, () => console.log(`Server started in ${Date.now() - serverStart}ms and is now running at ${url}`))
  })
  .catch((err: Error) => {
    console.log('Failed to start server due to error:')
    console.log(err)
    process.exit(1)
  })
