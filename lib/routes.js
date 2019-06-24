'use strict'
require('dotenv').config()
const fs = require('fs')
const path = require('path')
const sharp = require('sharp')
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

router.get('/i/:gallery/:page', ctx => {
  let { gallery, page } = ctx.params
  const { w, h, fit } = ctx.request.query
  if (!gallery || !page || !parseInt(page) || !w || !parseInt(w) || parseInt(w) >= 2048) {
    ctx.status = 400
    return
  }

  const folder = path.join(process.env.ARCHIVE_DIR, ctx.params.gallery)

  if (!fs.existsSync(folder)) {
    ctx.status = 404
    return
  }

  let image = fs.readdirSync(folder).filter(e => e.startsWith(page))
  if (!image.length) {
    ctx.status = 404
    return
  }

  if (!image[0].endsWith('png') && !image[0].endsWith('jpg') && !image[0].endsWith('jpeg')) {
    ctx.status = 415
    return
  }

  let result = sharp(path.join(folder, image[0]))
  if (h && parseInt(h)) {
    if (parseInt(h) >= 2048) {
      ctx.status = 400
      return
    }
    let fitting = ['outside', 'inside', 'cover', 'contain', 'fill'].includes(fit) ? fit : 'cover'
    result = result.resize(parseInt(w), parseInt(h), { fit: fitting })
  } else {
    result = result.resize(parseInt(w))
  }

  if (image[0].endsWith('png')) {
    result = result.png()
    ctx.set('Content-Type', 'image/png')
  } else {
    result = result.jpeg()
    ctx.set('Content-Type', 'image/jpeg')
  }

  ctx.body = result
})

module.exports = router.routes()
