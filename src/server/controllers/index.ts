import KoaRouter from 'koa-router'
import { getGalleryInformation, getRegistryInformation, getRandomGalleryId } from './registry-lookup'
import { resizeImage } from './image'
import { initializeSearch, search } from './search'

export async function getRoutes () {
  const router = new KoaRouter()
  router.prefix('/api')

  router.get('/img/:gallery/:chapter/:page', resizeImage)
  router.get('/galleries', getRegistryInformation)
  router.get('/galleries/:id', getGalleryInformation)
  router.get('/random', getRandomGalleryId)
  router.get('/search', search)

  await initializeSearch()

  return router.routes()
}
