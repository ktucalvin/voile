'use strict'
const KoaRouter = require('koa-router')
const registry = require('./registry')
const router = new KoaRouter({ prefix: '/api' })

router.get('/registry', ctx => {
  ctx.body = registry
})

module.exports = router.routes()
