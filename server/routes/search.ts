import Fuse from 'fuse.js'
import { Context } from 'koa'
import { getConnection } from 'typeorm'
import { Gallery } from '../models/Gallery'
import { PlainGallery } from '../models/PlainGallery'

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

let fuse: Fuse<PlainGallery, Object>

async function initializeSearch () {
  console.log('Initializing search library...')
  const start = Date.now()
  const galleries = await getConnection()
    .getRepository(Gallery)
    .find({ relations: ['tags'] })

  fuse = new Fuse(galleries.map(g => g.toPlainGallery()), fuseOpts)
  console.log(`Search library initialized in ${Date.now() - start}ms`)
}

// Expecting query param to be ?s=somestring&p=page
function search (ctx: Context) {
  if (!fuse) {
    throw new Error('Fuse not initialized before searching')
  }
  const range = 25
  const page = parseInt(ctx.query.p) || 1
  const offset = range * (page - 1)
  const results = fuse.search(ctx.query.s).map(e => e.item)
  ctx.body = { totalSize: Math.ceil(results.length / range), data: results.slice(offset, offset + range) }
}

export { initializeSearch, search }
