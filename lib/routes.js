'use strict'
const KoaRouter = require('koa-router')
const registry = require('./registry')
const router = new KoaRouter()

router.get('/g/:id', ctx => {
  ctx.redirect('/')
})

router.get('/api/registry/:page', ctx => {
  let page = parseInt(ctx.params.page) || 1
  if (!page) {
    ctx.status = 400
    return
  }
  const range = 16 // range is galleries per page
  const offset = range * (page - 1)
  const portion = registry.slice(offset, offset + range)
  const totalSize = Math.ceil(registry.length / range)
  ctx.body = { portion, totalSize }
})

module.exports = router.routes()
