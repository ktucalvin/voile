import { isString } from '@server/lib/utils'
import { Context } from 'koa'
import { getConnection, FindManyOptions } from 'typeorm'
import { Gallery } from '../models/Gallery'

async function getGalleries (ctx: Context) {
  let {
    p: page = 1,
    length = 25,
    sort_by: sortBy = 'id',
    order_by: orderBy = 'DESC'
  } = ctx.query

  if (!isString(page) || !parseInt(page) || parseInt(page) < 1 ||
      !isString(length) || !parseInt(length) || parseInt(length) < 1) {
    ctx.status = 400
    return
  }

  if (!isString(orderBy)) {
    orderBy = orderBy[0]
  }

  if (!isString(sortBy)) {
    sortBy = sortBy[0]
  }

  page = parseInt(page)
  length = parseInt(length)
  orderBy = orderBy.toUpperCase()
  sortBy = sortBy.toLowerCase()

  if (orderBy !== 'DESC' && orderBy !== 'ASC') {
    ctx.status = 400
    return
  }

  const findOptions: FindManyOptions = {
    skip: (page - 1) * length,
    take: length
  }

  if (sortBy === 'views') {
    findOptions.order = { views: orderBy }
  } else if (sortBy === 'id') {
    findOptions.order = { galleryId: orderBy }
  } else if (sortBy === 'name') {
    findOptions.order = { galleryName: orderBy }
  } else {
    ctx.status = 400
    return
  }

  const [galleries, count] = await getConnection()
    .getRepository(Gallery)
    .findAndCount(findOptions)

  const data = galleries.map(gallery => ({
    id: gallery.galleryId,
    name: gallery.galleryName
  }))

  ctx.body = {
    data,
    pages: Math.ceil(count / length)
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

  if (!gallery) {
    ctx.status = 404
    return
  }

  await getConnection()
    .getRepository(Gallery)
    .increment({ galleryId: gallery.galleryId }, 'views', 1)

  ctx.body = gallery.toCommonGallery()
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
  getGalleries,
  getRandomGalleryId
}
