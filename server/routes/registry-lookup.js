'use strict'
const { getDatabasePool } = require('../lib/db')
const pool = getDatabasePool()

async function getRegistryInformation (ctx) {
  const { page = 1, length = 25 } = ctx.params // length is galleries per page
  if (!parseInt(page) || page < 1) {
    ctx.status = 400
    return
  }

  const offset = (parseInt(page) - 1) * parseInt(length)
  let rows = await pool.query(
    'SELECT * FROM galleries LIMIT ? OFFSET ?',
    [length, offset]
  )

  rows = rows.map(row => {
    return ({
      id: row.gallery_id,
      name: row.gallery_name
    })
  })

  const galleryQuery = await pool.query('SELECT COUNT(*) as count FROM galleries')
  const totalGalleries = galleryQuery[0].count

  const totalSize = Math.floor(totalGalleries / length)
  ctx.body = { data: rows, totalSize }
}

async function getGalleryInformation (ctx) {
  const rows = await pool.query(
    'SELECT * FROM galleries NATURAL JOIN galleries_tags NATURAL JOIN tags NATURAL JOIN chapters WHERE gallery_id=?',
    [ctx.params.id]
  )

  if (!rows.length) {
    ctx.status = 404
    return
  }

  const gallery = {
    id: rows[0].gallery_id,
    name: rows[0].gallery_name,
    description: rows[0].description,
    tags: {},
    chapters: {}
  }

  for (const row of rows) {
    if (gallery.tags[row.type]) {
      gallery.tags[row.type].push(row.tag_name)
    } else {
      gallery.tags[row.type] = [row.tag_name]
    }

    gallery.chapters[row.chapter_number] = {
      name: row.chapter_name,
      pages: row.pages
    }
  }

  ctx.body = gallery
}

async function getRandomGalleryId (ctx) {
  const rows = await pool.query('SELECT gallery_id FROM galleries ORDER BY RAND() LIMIT 1')
  const id = rows[0].gallery_id
  ctx.redirect(`/g/${id}`)
}

module.exports = {
  getGalleryInformation,
  getRegistryInformation,
  getRandomGalleryId
}
