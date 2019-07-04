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
  let { w, h = 'auto', fit = 'cover', format = 'webp' } = ctx.request.query
  const width = parseInt(w)
  const height = parseInt(h)
  if (format === 'jpg') format = 'jpeg'
  if (!gallery || !page || !parseInt(page) || !width || width < 1 || width > 2048) {
    ctx.status = 400
    return
  }

  if (h !== 'auto' && (!height || height < 1 || height > 2048)) {
    ctx.status = 400
    return
  }

  if (!['outside', 'inside', 'cover', 'contain', 'fill'].includes(fit)) {
    ctx.status = 400
    return
  }

  if (!['png', 'jpeg', 'webp'].includes(format)) {
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

  ctx.set('Cache-Control', 'max-age=86400')
  ctx.set('Content-Type', `image/${format}`)

  // avoid writing default values for height/fit in filename
  const fileHeight = h === 'auto' ? '' : `x${height}`
  const fileFit = fit === 'cover' ? '' : `-${fit}`
  const cachedFile = `./imgcache/${gallery}-${page}-${width}${fileHeight}${fileFit}.${format}`

  // serve cached image if it exists
  if (fs.existsSync(cachedFile)) {
    ctx.body = fs.createReadStream(cachedFile)
    return
  }

  // else resize on the fly
  let result = sharp(path.join(folder, image[0]))
  if (height) {
    result = result.resize(width, height, { fit })
  } else {
    result = result.resize(width)
  }

  if (format === 'png') {
    ctx.body = result.png()
  } else if (format === 'jpeg') {
    ctx.body = result.jpeg()
  } else {
    ctx.body = result.webp()
  }

  // force file write to be after network response otherwise a 500 internal server error occurs
  setTimeout(() => {
    if (!fs.existsSync('./imgcache')) {
      fs.mkdirSync('./imgcache')
    }
    result.toFile(cachedFile, err => { if (err) console.log(err) })
  })
})

module.exports = router.routes()
