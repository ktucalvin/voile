import { Context } from 'koa'
import { getConnection } from 'typeorm'
import { Gallery } from '../models/Gallery'

async function getRegistryInformation (ctx: Context) {
  const { page = 1, length = 25 } = ctx.params // length is galleries per page
  if (!parseInt(page) || page < 1 || !parseInt(length) || length < 1) {
    ctx.status = 400
    return
  }

  const [galleries, count] = await getConnection()
    .getRepository(Gallery)
    .findAndCount({ skip: (page - 1) * length, take: length })

  const data = galleries.map(gallery => ({
    id: gallery.galleryId,
    name: gallery.galleryName
  }))

  ctx.body = {
    data,
    totalSize: Math.ceil(count / length)
  }
}

async function getGalleryInformation (ctx: Context) {
  if (!parseInt(ctx.params.id)) {
    ctx.status = 400
    return
  }

  const gallery = await getConnection()
    .getRepository(Gallery)
    .findOne(ctx.params.id, { relations: ['tags', 'chapters'] })

  ctx.body = gallery.toPlainGallery()
}

async function getRandomGalleryId (ctx: Context) {
  const { id } = await getConnection()
    .createQueryBuilder(Gallery, 'gallery')
    .select('gallery.gallery_id', 'id')
    .orderBy('RAND()')
    .getRawOne()

  ctx.redirect(`/g/${id}`)
}

export {
  getGalleryInformation,
  getRegistryInformation,
  getRandomGalleryId
}
