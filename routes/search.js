'use strict'
const Fuse = require('fuse.js')
const registry = require('../lib/registry')
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

const fuse = new Fuse(Array.from(registry.values()), fuseOpts)

// Expecting query param to be ?s=somestring&p=page
function search (ctx) {
  const range = 25
  const page = parseInt(ctx.query.p) || 1
  const offset = range * (page - 1)
  const results = fuse.search(ctx.query.s)
  ctx.body = { totalSize: Math.ceil(results.length / range), data: results.slice(offset, offset + range) }
}

module.exports = { search }
