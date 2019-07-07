'use strict'
require('dotenv').config()
const KoaRouter = require('koa-router')
const router = new KoaRouter()
const { routes: apiRoutes } = require('./api')
const { routes: imageRoutes } = require('./image')

router.use('/api', apiRoutes)

router.use(imageRoutes)

module.exports = router.routes()
