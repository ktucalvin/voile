'use strict'
const registry = require('../lib/registry')

function getRegistryInformation (ctx) {
  let { page } = ctx.params
  if (!page) page = 1
  if (!parseInt(page) || page < 1) {
    ctx.status = 400
    return
  }
  const range = 25 // range is galleries per page
  const offset = range * (page - 1)
  let i = 0
  const data = []
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
    ctx.status = 404
    return
  }

  ctx.body = gallery
}

module.exports = {
  getGalleryInformation,
  getRegistryInformation
}
