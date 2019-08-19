'use strict'
require('dotenv').config()
const fs = require('fs')
const path = require('path')
const sharp = require('sharp')
const send = require('koa-send')
const KoaRouter = require('koa-router')
const staticOpts = require('../lib/static-options')
const router = new KoaRouter()

async function resizeImage (ctx) {
  let { gallery, chapter, page } = ctx.params
  let { w, h = 'auto', fit = 'cover', format = 'webp' } = ctx.request.query
  const width = parseInt(w)
  const height = parseInt(h)
  if (format === 'jpg') format = 'jpeg'
  if (!gallery || !page || !parseInt(page) || !chapter || !parseFloat(chapter)) {
    ctx.status = 400
    return
  }

  if (!width || width < 1 || width > 2048) {
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

  const folder = path.join(process.env.ARCHIVE_DIR, gallery, chapter)

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
    const file = path.join(folder, page)
    await send(ctx, file, staticOpts)
    return
  }

  ctx.set('Cache-Control', `max-age=${staticOpts.maxage}`)
  ctx.set('Content-Type', `image/${format}`)

  // avoid writing default values for height/fit in filename
  const fileHeight = h === 'auto' ? '' : `x${height}`
  const fileFit = fit === 'cover' ? '' : `-${fit}`
  const cachedFile = `./imgcache/${gallery}-C${chapter}P${page}-${width}${fileHeight}${fileFit}.${format}`

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
}

router.get('/api/img/:gallery/:chapter/:page', resizeImage)

module.exports = {
  routes: router.routes(),
  resizeImage
}
