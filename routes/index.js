'use strict'
const KoaRouter = require('koa-router')
const { getGalleryInformation, getRegistryInformation, getRandomGalleryId } = require('./registry-lookup')
const { resizeImage } = require('./image')
const { search } = require('./search')
const router = new KoaRouter()
router.prefix('/api')

router.get('/img/:gallery/:chapter/:page', resizeImage)
router.get('/registry/:page', getRegistryInformation)
router.get('/gallery/:id', getGalleryInformation)
router.get('/random', getRandomGalleryId)
router.get('/search', search)

module.exports = router.routes()
