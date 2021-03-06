import Fuse from 'fuse.js'
import { Context } from 'koa'
import { getConnection } from 'typeorm'
import { Gallery } from '../models/Gallery'
import type { Gallery as CommonGallery } from '@common/types/app'
import { isString } from '@server/lib/utils'

const fuseOpts = {
  shouldSort: true,
  threshold: 0.2,
  location: 0,
  distance: 100,
  maxPatternLength: 32,
  minMatchCharLength: 1,
  keys: [
    'name',
    'tags.language',
    'tags.character',
    'tags.category',
    'tags.group',
    'tags.parody',
    'tags.artist',
    'tags.content'
  ]
}

let fuse: Fuse<CommonGallery>

async function initializeSearch () {
  console.log('Initializing search library...')
  const start = Date.now()
  const galleries = await getConnection()
    .getRepository(Gallery)
    .find({ relations: ['tags'] })

  fuse = new Fuse(galleries.map(g => g.toCommonGallery()), fuseOpts)
  console.log(`Search library initialized in ${Date.now() - start}ms`)
}

// Expecting query param to be ?s=somestring&p=page
function search (ctx: Context) {
  if (!fuse) {
    throw new Error('Fuse not initialized before searching')
  }

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

  if (!isString(orderBy) || !isString(sortBy)) {
    ctx.status = 400
    return
  }

  if (!isString(ctx.query.s)) {
    ctx.status = 400
    return
  }

  page = parseInt(page)
  length = parseInt(length)
  orderBy = orderBy.toUpperCase()
  sortBy = sortBy.toLowerCase()

  const offset = length * (page - 1)
  const results = fuse.search(ctx.query.s).map(e => e.item)

  const orderMultiplier = orderBy === 'ASC' ? 1 : -1

  if (sortBy === 'views') {
    results.sort((a, b) => (a.views - b.views) * orderMultiplier)
  } else if (sortBy === 'id') {
    results.sort((a, b) => (a.id - b.id) * orderMultiplier)
  } else if (sortBy === 'name') {
    results.sort((a, b) => a.name.localeCompare(b.name) * orderMultiplier)
  } else {
    ctx.status = 400
    return
  }

  ctx.body = {
    validResults: results.length,
    pages: Math.ceil(results.length / length),
    data: results.slice(offset, offset + length)
  }
}

export { initializeSearch, search }
