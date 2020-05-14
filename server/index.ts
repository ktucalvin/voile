import 'dotenv/config'
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
import { createConnection } from 'typeorm'
import { getRoutes } from './routes'
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
