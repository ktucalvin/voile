'use strict'
require('dotenv').config()
const KoaRouter = require('koa-router')
const registry = require('../lib/registry')
const router = new KoaRouter()

function getRegistryInformation (ctx) {
  let page = parseInt(ctx.params.page) || 1
  if (!page) {
    ctx.status = 400
    return
  }
  const range = 24 // range is galleries per page
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
}

function getGalleryInformation (ctx) {
  const gallery = registry.get(ctx.params.id)
  if (!gallery) {
    ctx.status = 400
    return
  }

  ctx.body = gallery
}

router.get('/registry/:page', getRegistryInformation)
router.get('/gallery/:id', getGalleryInformation)

module.exports = {
  routes: router.routes(),
  getGalleryInformation,
  getRegistryInformation
}
