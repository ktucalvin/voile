'use strict'
const KoaRouter = require('koa-router')

async function getRoutes () {
  const { getGalleryInformation, getRegistryInformation, getRandomGalleryId } = require('./registry-lookup')
  const { resizeImage } = require('./image')
  const { initializeSearch, search } = require('./search')
  const router = new KoaRouter()
  router.prefix('/api')

  router.get('/img/:gallery/:chapter/:page', resizeImage)
  router.get('/registry/:page', getRegistryInformation)
  router.get('/gallery/:id', getGalleryInformation)
  router.get('/random', getRandomGalleryId)
  router.get('/search', search)

  await initializeSearch()

  return router.routes()
}

module.exports = { getRoutes }
