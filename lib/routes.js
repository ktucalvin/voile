'use strict'
const KoaRouter = require('koa-router')
const registry = require('./registry')
const router = new KoaRouter()

router.get('/g/:id', ctx => {
  ctx.redirect('/')
})

router.get('/api/registry', ctx => {
  ctx.body = registry
})

module.exports = router.routes()
