'use strict'
const Fuse = require('fuse.js')
const { getDatabasePool } = require('../lib/db')
const pool = getDatabasePool()

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

let fuse

async function initializeSearch () {
  console.log('Initializing search library...')
  const registry = new Map()
  const rows = await pool.query(
    'SELECT * FROM galleries NATURAL JOIN galleries_tags NATURAL JOIN tags'
  )

  for (const row of rows) {
    const name = row.gallery_name
    const gallery = registry.get(name) || { name, id: row.gallery_id, tags: {} }
    if (gallery.tags[row.type]) {
      gallery.tags[row.type].push(row.tag_name)
    } else {
      gallery.tags[row.type] = [row.tag_name]
    }
    registry.set(name, gallery)
  }

  fuse = new Fuse(Array.from(registry.values()), fuseOpts)
  console.log('Search initialized')
}

// Expecting query param to be ?s=somestring&p=page
function search (ctx) {
  if (!fuse) {
    throw new Error('Fuse not initialized before searching')
  }
  const range = 25
  const page = parseInt(ctx.query.p) || 1
  const offset = range * (page - 1)
  const results = fuse.search(ctx.query.s)
  ctx.body = { totalSize: Math.ceil(results.length / range), data: results.slice(offset, offset + range) }
}

module.exports = { initializeSearch, search }
