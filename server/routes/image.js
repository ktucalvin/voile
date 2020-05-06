'use strict'
require('dotenv').config()
const fsp = require('fs').promises
const path = require('path')
const sharp = require('sharp')
const send = require('koa-send')
const staticOpts = require('../lib/static-options')
const fsutils = require('../lib/fsutils')
const isResizable = /(jpg|jpeg|png)$/

async function resizeImage (ctx) {
  const { gallery, chapter, page } = ctx.params
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
  let image

  try {
    image = await fsp.readdir(folder)
    image = image.filter(e => e.startsWith(page))[0]
  } catch (err) {
    ctx.status = 404
    return
  }

  if (!image) {
    ctx.status = 404
    return
  }

  if (!isResizable.test(image)) {
    const file = path.relative(process.env.ARCHIVE_DIR, path.join(folder, page))
    await send(ctx, file, staticOpts)
    return
  }

  ctx.set('Cache-Control', `max-age=${staticOpts.maxage}`)
  ctx.set('Content-Type', `image/${format}`)

  // avoid writing default values for height/fit in filename
  const fileHeight = h === 'auto' ? '' : `x${height}`
  const fileFit = fit === 'cover' ? '' : `-${fit}`
  const cacheDir = path.join('./imgcache', process.env.DB_NAME)
  const cacheFile = path.join(cacheDir, `${gallery}-C${chapter}P${page}-${width}${fileHeight}${fileFit}.${format}`)

  // serve cached image if it exists
  try {
    ctx.body = await fsutils.createReadStream(cacheFile)
    return
  } catch (err) { }

  // If we couldn't serve it, then make a resized image file and serve that
  const result = sharp(path.join(folder, image))
  if (height) {
    result.resize(width, height, { fit })
  } else {
    result.resize(width)
  }

  if (format === 'png') {
    ctx.body = result.png()
  } else if (format === 'jpeg') {
    ctx.body = result.jpeg()
  } else {
    ctx.body = result.webp()
  }

  await fsutils.ensureDir(cacheDir)
  result.clone().toFile(cacheFile, err => { if (err) console.log(err) })
}

module.exports = {
  resizeImage
}
