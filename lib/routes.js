'use strict'
const KoaRouter = require('koa-router')
const registry = require('./registry')
const router = new KoaRouter()

router.get('/api/registry/:page', ctx => {
  let page = parseInt(ctx.params.page) || 1
  if (!page) {
    ctx.status = 400
    return
  }
  const range = 15 // range is galleries per page
  const offset = range * (page - 1)
  let i = 0
  let data = []
  for (const gallery of registry.values()) {
    if (i >= offset && i < offset + range) {
      data.push(gallery)
    }

    if (i >= offset + range) break
    i++
  }
  const totalSize = Math.ceil(registry.size / range)
  ctx.body = { data, totalSize }
})

router.get('/api/gallery/:id', ctx => {
  const gallery = registry.get(ctx.params.id)
  if (!gallery) {
    ctx.status = 400
    return
  }

  ctx.body = gallery
})

module.exports = router.routes()
